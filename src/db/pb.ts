import PocketBase, { RecordModel } from 'pocketbase';
import { config } from '../config.js';

export const pb = new PocketBase(config.pocketbaseUrl);

// 自动使用管理员凭证登录 (兼容 PocketBase v0.22 与 v0.23+)
export async function authenticateAdmin(): Promise<void> {
  if (config.adminEmail && config.adminPassword) {
    try {
      const res = await fetch(`${config.pocketbaseUrl}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: config.adminEmail, password: config.adminPassword })
      });
      if (res.ok) {
        const data = await res.json() as any;
        pb.authStore.save(data.token, data.admin);
        console.log('✅ PocketBase 数据库认证成功 (v0.22)');
        return;
      }
      await pb.collection('_superusers').authWithPassword(config.adminEmail, config.adminPassword);
      console.log('✅ PocketBase 数据库认证成功 (v0.23+)');
    } catch (e: any) {
      console.warn('⚠️ PocketBase 认证提醒:', e?.message || e);
    }
  }
}

// 规范化记录 ID（适配前端小程序期望的语义化 id，如 picgo, typora, pc 等）
export function normalizeRecord<T = any>(item: any): T {
  if (!item) return item as T;
  const customId = item.res_id || item.cat_id || item.tag_id || item.plan_id || item.priv_id;
  if (customId) {
    return { ...item, id: customId } as T;
  }
  return item as T;
}

export interface ListOptions {
  page?: number;
  perPage?: number;
  filter?: string;
  sort?: string;
}

// 直接从 PocketBase 集合获取列表（纯数据库读取，无死数据）
export async function getCollectionList<T = any>(
  collectionName: string,
  options: ListOptions = {}
): Promise<{ items: T[]; total: number }> {
  try {
    const page = options.page || 1;
    const perPage = options.perPage || 100;
    const res = await pb.collection(collectionName).getList(page, perPage, {
      filter: options.filter || '',
      sort: options.sort || '-created',
      requestKey: null
    });
    const normalized = (res.items || []).map(item => normalizeRecord<T>(item));
    return { items: normalized, total: res.totalItems };
  } catch (err: any) {
    console.error(`[PB Read Error] 读取集合 ${collectionName} 失败:`, err?.message || err);
    return { items: [], total: 0 };
  }
}

// 直接从 PocketBase 获取全部列表
export async function getCollectionFullList<T = any>(
  collectionName: string,
  options: { filter?: string; sort?: string } = {}
): Promise<T[]> {
  try {
    const list = await pb.collection(collectionName).getFullList({
      filter: options.filter || '',
      sort: options.sort || '',
      requestKey: null
    });
    return list.map(item => normalizeRecord<T>(item));
  } catch (err: any) {
    console.error(`[PB FullList Error] 读取全部集合 ${collectionName} 失败:`, err?.message || err);
    return [];
  }
}

// 从 PocketBase 获取单条记录 (支持通过自定义 ID 或 PocketBase 内部 ID 查询)
export async function getCollectionOne<T = any>(
  collectionName: string,
  id: string
): Promise<T | null> {
  try {
    let customField = '';
    if (collectionName === 'resources') customField = 'res_id';
    else if (collectionName === 'categories') customField = 'cat_id';
    else if (collectionName === 'quick_tags') customField = 'tag_id';
    else if (collectionName === 'vip_plans') customField = 'plan_id';
    else if (collectionName === 'vip_privileges') customField = 'priv_id';
    else if (collectionName === 'user_profiles') customField = 'uid';

    if (customField) {
      try {
        const record = await pb.collection(collectionName).getFirstListItem(
          `${customField} = "${id}"`,
          { requestKey: null }
        );
        if (record) return normalizeRecord<T>(record);
      } catch {}
    }

    try {
      const record = await pb.collection(collectionName).getOne(id, { requestKey: null });
      if (record) return normalizeRecord<T>(record);
    } catch {}
  } catch (err: any) {
    console.warn(`[PB Record Not Found] ${collectionName}/${id}: ${err?.message || err}`);
  }
  return null;
}

// 写入数据记录到 PocketBase
export async function createRecord<T = any>(
  collectionName: string,
  data: any
): Promise<T> {
  const record = await pb.collection(collectionName).create(data, { requestKey: null });
  return normalizeRecord<T>(record);
}
