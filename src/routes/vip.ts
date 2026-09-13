import { Hono } from 'hono';
import { success, error } from '../utils/response.js';
import { MOCK_VIP_PLANS, MOCK_VIP_PRIVILEGES, MOCK_VIP_FAQS } from '../utils/mockData.js';
import { createRecord } from '../db/pb.js';

export const vipRouter = new Hono();

// 获取 VIP 套餐列表
vipRouter.get('/plans', (c) => {
  return c.json(success(MOCK_VIP_PLANS));
});

// 获取 8 大会员特权说明
vipRouter.get('/privileges', (c) => {
  return c.json(success(MOCK_VIP_PRIVILEGES));
});

// 获取常见问题答疑
vipRouter.get('/faqs', (c) => {
  return c.json(success(MOCK_VIP_FAQS));
});

// 创建 VIP 订阅订单 / 模拟支付下单
vipRouter.post('/create-order', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { planId, uid } = body;

  const plan = MOCK_VIP_PLANS.find(p => p.id === planId) || MOCK_VIP_PLANS[1];
  const orderNo = 'VIP' + Date.now() + Math.floor(Math.random() * 1000);

  const record = await createRecord('vip_orders', {
    order_no: orderNo,
    plan_id: plan.id,
    plan_name: plan.name,
    price: plan.price,
    uid: uid || '8932014',
    pay_status: 'paid',
    created: new Date().toISOString()
  });

  return c.json(success({
    orderNo,
    planName: plan.name,
    amount: plan.price,
    expireDate: plan.id === 'forever' ? '终身永久有效' : '2026-09-13 到期',
    status: 'paid',
    message: `恭喜！您已成功开通【${plan.name}】`
  }));
});
