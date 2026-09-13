import { Hono } from 'hono';
import { success } from '../utils/response.js';
import { getCollectionFullList, getCollectionOne, createRecord } from '../db/pb.js';

export const vipRouter = new Hono();

// 获取 VIP 套餐列表 (从 PocketBase vip_plans 读取)
vipRouter.get('/plans', async (c) => {
  const items = await getCollectionFullList('vip_plans', { sort: 'sort' });
  return c.json(success(items));
});

// 获取 8 大会员特权说明 (从 PocketBase vip_privileges 读取)
vipRouter.get('/privileges', async (c) => {
  const items = await getCollectionFullList('vip_privileges', { sort: 'sort' });
  return c.json(success(items));
});

// 获取常见问题答疑 (从 PocketBase vip_faqs 读取)
vipRouter.get('/faqs', async (c) => {
  const items = await getCollectionFullList('vip_faqs', { sort: 'sort' });
  return c.json(success(items));
});

// 创建 VIP 订单 (直接写入 PocketBase vip_orders 表)
vipRouter.post('/create-order', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { planId, uid } = body;

  const plan = await getCollectionOne<any>('vip_plans', planId || 'year');
  const planName = plan?.name || '年度黑卡';
  const price = plan?.price || 68;
  const orderNo = 'VIP' + Date.now() + Math.floor(Math.random() * 1000);

  const record = await createRecord('vip_orders', {
    order_no: orderNo,
    plan_id: planId || 'year',
    plan_name: planName,
    price,
    uid: uid || '8932014',
    pay_status: 'paid'
  });

  return c.json(success({
    orderNo,
    planName,
    amount: price,
    expireDate: planId === 'forever' ? '终身永久有效' : '2026-09-13 到期',
    status: 'paid',
    message: `恭喜！订单已入库，成功开通【${planName}】`
  }));
});
