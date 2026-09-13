import { Hono } from 'hono';
import { success, error } from '../utils/response.js';
import { createRecord, getCollectionList } from '../db/pb.js';

export const requestRouter = new Hono();

// 获取求资源的基础配置
requestRouter.get('/config', (c) => {
  return c.json(success({
    categories: [
      { id: 'pc', name: '电脑软件', icon: '/images/cat_pc.svg' },
      { id: 'code', name: '开源源码', icon: '/images/cat_dev.svg' },
      { id: 'mobile', name: '移动应用', icon: '/images/icon_cat_mobile.svg' },
      { id: 'study', name: '学习教程', icon: '/images/cat_study.svg' },
      { id: 'design', name: '设计素材', icon: '/images/cat_design.svg' },
      { id: 'more', name: '其它', icon: '/images/icon_cat_more.svg' }
    ],
    platforms: [
      { id: 'win', name: 'Windows', selected: true },
      { id: 'mac', name: 'macOS', selected: false },
      { id: 'linux', name: 'Linux', selected: false },
      { id: 'android', name: 'Android', selected: false },
      { id: 'source', name: '源码包', selected: false },
      { id: 'direct', name: '网盘直链', selected: false }
    ],
    remainSubmitTimes: 3
  }));
});

// 提交求资源工单
requestRouter.post('/submit', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { resourceName, category, platforms, detailDesc, screenshots, isSvipSpeedEnabled } = body;

  if (!resourceName || !resourceName.trim()) {
    return c.json(error('请输入希望获取的资源名称', 400));
  }

  const orderNo = '2025' + Math.floor(100000 + Math.random() * 900000);
  const record = await createRecord('resource_requests', {
    order_no: orderNo,
    title: resourceName.trim(),
    category: category || '电脑软件',
    platforms: Array.isArray(platforms) ? platforms.join(', ') : (platforms || '通用'),
    detail_desc: detailDesc || '',
    screenshots: Array.isArray(screenshots) ? screenshots.join(',') : '',
    is_svip_speed: !!isSvipSpeedEnabled,
    status: 'pending',
    status_text: isSvipSpeedEnabled ? 'SVIP极速寻档中' : '全网寻档中 · 专人处理',
    created: new Date().toISOString()
  });

  return c.json(success({
    id: record.id,
    orderNo,
    title: resourceName.trim(),
    statusText: isSvipSpeedEnabled ? 'SVIP极速寻档中' : '全网寻档中 · 专人处理',
    message: '求档需求已立案，工程师已接单处理'
  }));
});

// 获取我的求档历史
requestRouter.get('/history', async (c) => {
  const defaultHistory = [
    {
      id: 101,
      orderNo: '2024051801',
      time: '2小时前',
      status: 'done',
      statusClass: 'status-done',
      statusIcon: '✔',
      statusText: '寻档完成 · 已上架',
      title: 'DeepSeek 开发者私有化知识库部署套件',
      subDesc: '格式：Docker Compose 源码脚本 / macOS + Win',
      category: '开源源码',
      platforms: 'macOS, Win',
      targetResId: 'cursor-ai'
    },
    {
      id: 102,
      orderNo: '2024051608',
      time: '昨天 16:42',
      status: 'pending',
      statusClass: 'status-pending',
      statusIcon: '↻',
      statusText: '全网寻档中 · 专人处理',
      title: 'Final Cut Pro 电影级调色预设包 2025版',
      subDesc: '极客工程师 @枫木 已接受委托，正在套取校验',
      category: '设计素材',
      platforms: 'macOS',
      targetResId: null
    }
  ];

  const { items } = await getCollectionList('resource_requests', defaultHistory);
  return c.json(success(items));
});

// 催单
requestRouter.post('/urge', (c) => {
  return c.json(success({ urged: true }, '已向接单工程师发送加急催促指令！'));
});
