import { Hono } from 'hono';
import { success, error } from '../utils/response.js';
import { MOCK_USER_PROFILE, MOCK_RESOURCES } from '../utils/mockData.js';
import { createRecord } from '../db/pb.js';

export const userRouter = new Hono();

// 获取个人中心资料与资产数据
userRouter.get('/profile', (c) => {
  return c.json(success(MOCK_USER_PROFILE));
});

// 每日签到打卡 (+5 云豆)
userRouter.post('/checkin', async (c) => {
  await createRecord('user_checkins', {
    uid: MOCK_USER_PROFILE.uid,
    points_awarded: 5,
    date: new Date().toISOString().slice(0, 10)
  });

  return c.json(success({
    isCheckIn: true,
    addedPoints: 5,
    currentPoints: MOCK_USER_PROFILE.points + 5
  }, '打卡成功！+5 云豆已到账'));
});

// 获取我的云端收藏列表
userRouter.get('/favorites', (c) => {
  return c.json(success(MOCK_RESOURCES.slice(0, 5), 'success', 5));
});

// 获取我的获取历史 (下载记录)
userRouter.get('/history', (c) => {
  const history = MOCK_RESOURCES.slice(0, 4).map(res => ({
    id: res.id,
    title: res.title,
    time: '2025-09-12 15:30',
    panUrl: res.panUrl,
    pwd: res.pwd,
    size: res.size
  }));
  return c.json(success(history, 'success', history.length));
});

// 激活码兑换
userRouter.post('/redeem', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const code = (body.code || '').trim().toUpperCase();

  if (!code) {
    return c.json(error('请输入激活兑换码', 400));
  }

  return c.json(success({
    redeemed: true,
    reward: '30 天黑卡 SVIP 特权 + 100 云豆'
  }, '兑换码验证成功！特权已即刻激活生效'));
});
