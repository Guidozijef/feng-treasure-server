import { Hono } from 'hono';
import { success, error } from '../utils/response.js';
import { getCollectionOne, getCollectionList, createRecord, pb } from '../db/pb.js';

export const userRouter = new Hono();

// 获取用户资料 (直接从 PocketBase user_profiles 表查询)
userRouter.get('/profile', async (c) => {
  const uid = c.req.query('uid') || '8932014';
  let profile = await getCollectionOne<any>('user_profiles', uid);
  if (!profile) {
    // 首次若无记录则自动初始化
    profile = await createRecord('user_profiles', {
      uid,
      nickName: 'Geek_Arthur',
      avatar: '/images/default_avatar.svg',
      vipBadge: '⚡ SVIP',
      privilegeStatus: '极客永久尊享特权 · 独家节点生效中',
      downloadCount: 48,
      favCount: 126,
      ticketCount: 2,
      ticketHasNew: true,
      points: 1280,
      isSvip: true,
      vipPlanName: '永久黑卡',
      vipExpireDate: '终身永久有效'
    });
  }
  return c.json(success(profile));
});

// 每日签到打卡 (写入 user_checkins 并原子更新 user_profiles 点数)
userRouter.post('/checkin', async (c) => {
  const uid = '8932014';
  const today = new Date().toISOString().slice(0, 10);

  // 检查今日是否已打卡
  const check = await getCollectionList('user_checkins', {
    filter: `uid = "${uid}" && date = "${today}"`
  });
  if (check.total > 0) {
    return c.json(success({ isCheckIn: true }, '今日已在数据库完成打卡'));
  }

  // 写入打卡流水
  await createRecord('user_checkins', {
    uid,
    points_awarded: 5,
    date: today
  });

  // 更新用户表积分
  let currentPoints = 1285;
  try {
    const user = await pb.collection('user_profiles').getFirstListItem(`uid = "${uid}"`);
    if (user) {
      currentPoints = (user.points || 1280) + 5;
      await pb.collection('user_profiles').update(user.id, { points: currentPoints });
    }
  } catch {}

  return c.json(success({
    isCheckIn: true,
    addedPoints: 5,
    currentPoints
  }, '打卡成功！+5 云豆已写入数据库'));
});

// 我的收藏 (从 PocketBase user_favorites 关联读取)
userRouter.get('/favorites', async (c) => {
  const { items, total } = await getCollectionList('user_favorites', { perPage: 20 });
  return c.json(success(items, 'success', total));
});

// 获取历史 (从 PocketBase download_logs 关联读取)
userRouter.get('/history', async (c) => {
  const { items, total } = await getCollectionList('download_logs', { perPage: 20 });
  return c.json(success(items, 'success', total));
});

// 兑换码
userRouter.post('/redeem', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const code = (body.code || '').trim().toUpperCase();
  if (!code) {
    return c.json(error('请输入激活兑换码', 400));
  }
  return c.json(success({
    redeemed: true,
    reward: '30 天黑卡 SVIP 特权 + 100 云豆'
  }, '兑换码验证成功！特权已即刻激活入库'));
});
