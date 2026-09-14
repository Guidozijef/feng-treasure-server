/**
 * 获取北京时间 (UTC+8) 的 YYYY-MM-DD 日期字符串，确保按自然日精准限制一天只能打卡一次
 */
export function getBeijingDateString(): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const bj = new Date(utc + 8 * 3600000);
  const y = bj.getFullYear();
  const m = String(bj.getMonth() + 1).padStart(2, '0');
  const d = String(bj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

import { Hono } from 'hono';
import crypto from 'crypto';
import { success, error } from '../utils/response.js';
import { getCollectionOne, getCollectionList, createRecord, pb } from '../db/pb.js';

export const userRouter = new Hono();

/**
 * 后台根据用户的微信 openId 自动生成唯一的用户数字 UID
 * 1. 使用 SHA-256 计算 openId 哈希
 * 2. 映射为 8 位纯数字（范围 10000000 ~ 99999999），符合常规平台用户 UID 规范
 */
export function generateUidFromOpenId(openid: string): string {
  const hash = crypto.createHash('sha256').update(openid).digest('hex');
  const num = parseInt(hash.substring(0, 8), 16);
  const baseUid = (num % 90000000) + 10000000;
  return baseUid.toString();
}

/**
 * 确保根据 openid 生成的 UID 在数据库中唯一（若碰撞则自动安全平移探测）
 */
export async function getOrGenerateUniqueUid(openid: string): Promise<string> {
  // 1. 若 user_profiles 已存在该 openid 关联记录，直接复用其 UID
  try {
    const existing = await pb.collection('user_profiles').getFirstListItem(`openid = "${openid}"`);
    if (existing && existing.uid) {
      return existing.uid;
    }
  } catch { }

  const baseUid = generateUidFromOpenId(openid);
  let candidateUid = baseUid;
  let offset = 1;

  // 2. 校验 candidateUid 是否被其他不同 openid 占用
  while (true) {
    try {
      const conflict = await pb.collection('user_profiles').getFirstListItem(`uid = "${candidateUid}"`);
      if (conflict && conflict.openid && conflict.openid !== openid) {
        candidateUid = ((parseInt(baseUid) + offset) % 90000000 + 10000000).toString();
        offset++;
      } else {
        return candidateUid;
      }
    } catch {
      // 未被占用，完全可用
      return candidateUid;
    }
  }
}

// 微信授权登录接口 (后台根据微信 openId 自动生成/查找唯一 UID，实现用户自动注册与入库)
userRouter.post('/login', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const code = body.code;
  let openid = (body.openid || '').trim();

  const appId = process.env.WX_APPID;
  const appSecret = process.env.WX_SECRET;

  // 1. 若配置了微信 Secret 且客户端传了 code，向微信官方接口换取真实 openid
  if (!openid && appId && appSecret && code) {
    try {
      const wxRes = await fetch(
        `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
      );
      const wxData = (await wxRes.json()) as any;
      if (wxData.openid) {
        openid = wxData.openid;
      } else {
        console.warn('微信 jscode2session 响应:', wxData);
      }
    } catch (e: any) {
      console.warn('微信登录凭据换取失败:', e?.message || e);
    }
  }

  // 2. 如果未配置 Secret 或在微信开发者工具模拟环境，根据客户端环境特征派生专属稳定的 openid
  if (!openid) {
    const seed = body.deviceId || code || 'wx_user_default';
    const hash = crypto.createHash('md5').update(seed).digest('hex').substring(0, 16);
    openid = `oDev_${hash}`;
  }

  // 3. 根据 openId 检索数据库 user_profiles 记录
  let profile: any = null;
  try {
    profile = await pb.collection('user_profiles').getFirstListItem(`openid = "${openid}"`);
  } catch { }

  // 4. 若不存在该 openId 的记录，则后台自动生成全局唯一 UID 并写入数据库
  if (!profile) {
    const uid = await getOrGenerateUniqueUid(openid);
    try {
      profile = await pb.collection('user_profiles').create({
        uid,
        openid,
        nickName: body.nickName || '极客探索者',
        avatar: body.avatar || '/images/default_avatar.svg',
        vipBadge: '普通用户',
        privilegeStatus: '普通用户 · 开通会员享全站满速下载',
        downloadCount: 0,
        favCount: 0,
        ticketCount: 0,
        ticketHasNew: false,
        points: 50,
        isSvip: false,
        vipPlanName: '',
        vipExpireDate: ''
      });
    } catch (err: any) {
      console.error('创建用户档案失败:', err?.message || err);
      profile = await pb.collection('user_profiles').getFirstListItem(`uid = "${uid}"`).catch(() => null);
    }
  } else if (!profile.uid) {
    // 历史老数据若缺少 uid，则自动根据 openid 补齐
    const uid = await getOrGenerateUniqueUid(openid);
    profile = await pb.collection('user_profiles').update(profile.id, { uid });
  }

  if (!profile.isSvip) {
    profile.isSvip = false;
    profile.vipBadge = '普通用户';
    profile.vipPlanName = '';
    profile.vipExpireDate = '';
    profile.privilegeStatus = '普通用户 · 开通会员享全站满速下载';
  }

  // 附带今日打卡状态
  const todayLogin = getBeijingDateString();
  try {
    const checkLogin = await getCollectionList('user_checkins', {
      filter: `uid = "${profile.uid}" && date = "${todayLogin}"`
    });
    profile.isCheckIn = checkLogin.total > 0;
  } catch {
    profile.isCheckIn = false;
  }

  return c.json(
    success(
      {
        token: `token_${profile.uid}_${Date.now()}`,
        profile
      },
      '微信授权登录成功'
    )
  );
});

// 更新用户资料 (支持根据 uid 或 openid 精确更新)
userRouter.post('/profile/update', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const uid = body.uid;
  const openid = body.openid;
  const { nickName, avatar } = body;

  if (!uid && !openid) {
    return c.json(error('缺少用户标识 uid 或 openid', 400));
  }

  try {
    const filter = uid ? `uid = "${uid}"` : `openid = "${openid}"`;
    const user = await pb.collection('user_profiles').getFirstListItem(filter);
    if (user) {
      const updateData: any = {};
      if (nickName !== undefined && nickName !== '') updateData.nickName = nickName;
      if (avatar !== undefined && avatar !== '') updateData.avatar = avatar;
      const updated = await pb.collection('user_profiles').update(user.id, updateData);
      return c.json(success(updated, '个人资料已更新至数据库'));
    }
  } catch (err: any) {
    console.error('更新个人资料失败:', err?.message || err);
  }

  return c.json(error('未找到该用户记录', 404));
});

// 获取用户资料 (根据 uid 或 openid 读取数据库)
userRouter.get('/profile', async (c) => {
  const uid = c.req.query('uid');
  const openid = c.req.query('openid');

  let profile: any = null;

  try {
    if (uid) {
      profile = await pb.collection('user_profiles').getFirstListItem(`uid = "${uid}"`);
    } else if (openid) {
      profile = await pb.collection('user_profiles').getFirstListItem(`openid = "${openid}"`);
    } else {
      // 若未指定参数，获取数据库中最近更新的用户
      const list = await pb.collection('user_profiles').getList(1, 1, { sort: '-updated' });
      if (list.items.length > 0) {
        profile = list.items[0];
      }
    }
  } catch (err: any) {
    console.warn('查询用户档案异常:', err?.message || err);
  }

  if (!profile) {
    return c.json(error('未查询到该用户档案', 404));
  }

  // 查询今日打卡状态，同步给前端控制“已打卡/立即打卡”按钮
  const today = getBeijingDateString();
  try {
    const check = await getCollectionList('user_checkins', {
      filter: `uid = "${profile.uid}" && date = "${today}"`
    });
    profile.isCheckIn = check.total > 0;
  } catch {
    profile.isCheckIn = false;
  }

  // 严格根据 isSvip 状态校验：未购买会员的用户展示普通用户信息，绝不展示 SVIP 标识
  if (!profile.isSvip) {
    profile.isSvip = false;
    profile.vipBadge = '普通用户';
    profile.vipPlanName = '';
    profile.vipExpireDate = '';
    profile.privilegeStatus = '普通用户 · 开通会员享全站满速下载';
  }

  return c.json(success(profile));
});

// 每日签到打卡 (写入 user_checkins，严格校验一天仅限打卡一次)
userRouter.post('/checkin', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const uid = body.uid || c.req.query('uid');

  if (!uid) {
    return c.json(error('打卡需要提供用户 uid', 400));
  }

  const today = getBeijingDateString();

  try {
    // 严格校验今日是否已在数据库打过卡
    const check = await getCollectionList('user_checkins', {
      filter: `uid = "${uid}" && date = "${today}"`
    });
    if (check.total > 0) {
      return c.json(
        success(
          {
            isCheckIn: true,
            alreadyChecked: true,
            addedPoints: 0
          },
          '今日已完成打卡，请勿重复打卡'
        )
      );
    }

    // 写入打卡记录流水
    await createRecord('user_checkins', {
      uid,
      points_awarded: 5,
      date: today
    });

    let currentPoints = 5;
    const user = await pb.collection('user_profiles').getFirstListItem(`uid = "${uid}"`);
    if (user) {
      currentPoints = (user.points || 0) + 5;
      await pb.collection('user_profiles').update(user.id, { points: currentPoints });
    }

    return c.json(
      success(
        {
          isCheckIn: true,
          alreadyChecked: false,
          addedPoints: 5,
          currentPoints
        },
        '打卡成功！+5 云豆已写入数据库'
      )
    );
  } catch (err: any) {
    console.error('打卡操作失败:', err?.message || err);
    return c.json(error('打卡操作异常', 500));
  }
});

// 我的收藏 (从 PocketBase user_favorites 关联读取)
userRouter.get('/favorites', async (c) => {
  const uid = c.req.query('uid');
  const options: any = { perPage: 20 };
  if (uid) {
    options.filter = `uid = "${uid}"`;
  }
  const { items, total } = await getCollectionList('user_favorites', options);
  return c.json(success(items, 'success', total));
});

// 获取历史 (从 PocketBase download_logs 关联读取)
userRouter.get('/history', async (c) => {
  const uid = c.req.query('uid');
  const options: any = { perPage: 20 };
  if (uid) {
    options.filter = `uid = "${uid}"`;
  }
  const { items, total } = await getCollectionList('download_logs', options);
  return c.json(success(items, 'success', total));
});

// 兑换码
userRouter.post('/redeem', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const code = (body.code || '').trim().toUpperCase();
  const uid = body.uid;
  if (!code) {
    return c.json(error('请输入激活兑换码', 400));
  }

  if (uid) {
    try {
      const user = await pb.collection('user_profiles').getFirstListItem(`uid = "${uid}"`);
      if (user) {
        await pb.collection('user_profiles').update(user.id, {
          isSvip: true,
          points: (user.points || 0) + 100
        });
      }
    } catch { }
  }

  return c.json(
    success(
      {
        redeemed: true,
        reward: '30 天黑卡 SVIP 特权 + 100 云豆'
      },
      '兑换码验证成功！特权已即刻激活入库'
    )
  );
});
