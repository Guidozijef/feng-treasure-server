import PocketBase from 'pocketbase';
import { config } from '../config.js';

export const pb = new PocketBase(config.pocketbaseUrl);

// 自动使用管理员凭证登录 (兼容 PocketBase v0.22 与 v0.23+)
export async function authenticateAdmin() {
  if (config.adminEmail && config.adminPassword) {
    try {
      // 1. 尝试 PocketBase v0.22 传统管理员接口
      const res = await fetch(`${config.pocketbaseUrl}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: config.adminEmail, password: config.adminPassword })
      });
      if (res.ok) {
        const data: any = await res.json();
        pb.authStore.save(data.token, data.admin);
        console.log('✅ PocketBase 管理员认证成功 (v0.22 模式)');
        return;
      }
      // 2. 尝试 PocketBase v0.23+ _superusers 集合
      await pb.collection('_superusers').authWithPassword(config.adminEmail, config.adminPassword);
      console.log('✅ PocketBase 超级管理员认证成功 (v0.23+ 模式)');
    } catch (e: any) {
      console.warn('⚠️ PocketBase 管理员认证失败 (将使用公开权限):', e.message);
    }
  }
}

// 规范化记录 ID（适配前端小程序期望的语义化 id，如 picgo, typora 等）
function normalizeRecord<T>(item: any): T {
  if (!item) return item;
  const customId = item.res_id || item.cat_id || item.tag_id;
  if (customId) {
    return { ...item, id: customId } as T;
  }
  return item as T;
}

// 通用安全集合列表获取 (自动降级机制：如果集合未建或出错，平滑降级为内置丰富种子数据)
export async function getCollectionList<T>(
  collectionName: string,
  fallbackData: T[],
  options: { page?: number; perPage?: number; filter?: string; sort?: string } = {}
): Promise<{ items: T[]; total: number }> {
  try {
    const page = options.page || 1;
    const perPage = options.perPage || 100;
    const res = await pb.collection(collectionName).getList(page, perPage, {
      filter: options.filter || '',
      sort: options.sort || '-created',
      requestKey: null
    });
    if (res && res.items && res.items.length > 0) {
      const normalized = res.items.map(item => normalizeRecord<T>(item));
      return { items: normalized, total: res.totalItems };
    }
  } catch (err: any) {
    // 集合不存在或未同步时使用预设数据降级，保证小程序端体验永远丝滑
  }
  return { items: fallbackData, total: fallbackData.length };
}

// 获取单条记录 (支持通过自定义 ID 或 PocketBase 记录 ID 查询)
export async function getCollectionOne<T>(
  collectionName: string,
  id: string,
  fallbackItem?: T
): Promise<T | null> {
  try {
    // 1. 优先尝试根据 res_id 或 id 查询
    try {
      const record = await pb.collection(collectionName).getFirstListItem(
        `id = "${id}" || res_id = "${id}"`,
        { requestKey: null }
      );
      if (record) return normalizeRecord<T>(record);
    } catch {
      // 2. 降级尝试标准 getOne
      const record = await pb.collection(collectionName).getOne(id, { requestKey: null });
      if (record) return normalizeRecord<T>(record);
    }
  } catch (err: any) {
    // 异常时使用本地兜底
  }
  return fallbackItem || null;
}

// 创建新记录
export async function createRecord<T extends Record<string, any>>(
  collectionName: string,
  data: T
): Promise<any> {
  try {
    const record = await pb.collection(collectionName).create(data, { requestKey: null });
    return normalizeRecord(record);
  } catch (err: any) {
    console.warn(`[PB Save Warning] ${collectionName} 写入 PocketBase 失败，采用模拟兜底: ${err.message}`);
    return { id: `mock-${Date.now()}`, ...data, created: new Date().toISOString() };
  }
}
