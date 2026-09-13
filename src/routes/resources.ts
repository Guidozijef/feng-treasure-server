import { Hono } from 'hono';
import { success, error } from '../utils/response.js';
import { MOCK_RESOURCES } from '../utils/mockData.js';
import { getCollectionList, getCollectionOne, createRecord } from '../db/pb.js';

export const resourcesRouter = new Hono();

// 获取资源列表 (支持多维筛选)
resourcesRouter.get('/', async (c) => {
  const category = c.req.query('category');
  const scene = c.req.query('scene');
  const sort = c.req.query('sort') || 'comprehensive'; // 'comprehensive' | 'downloads' | 'rating' | 'latest'
  const systems = c.req.query('systems'); // comma separated: 'win,mac'
  const size = c.req.query('size'); // 'all' | '<50m' | '50-500m' | '>1g'
  const page = parseInt(c.req.query('page') || '1', 10);
  const limit = parseInt(c.req.query('limit') || '20', 10);

  const { items } = await getCollectionList('resources', MOCK_RESOURCES);
  let result = [...items];

  // 1. 分类筛选
  if (category && category !== 'all') {
    result = result.filter(item => item.category === category);
  }

  // 2. 细分场景标签筛选
  if (scene && scene !== 'all') {
    result = result.filter(item => item.scenes?.includes(scene));
  }

  // 3. 操作系统筛选
  if (systems) {
    const sysList = systems.split(',').map(s => s.trim().toLowerCase());
    result = result.filter(item => {
      const p = (item.platform || '').toLowerCase();
      return sysList.some(s => p.includes(s)) || p.includes('全平台');
    });
  }

  // 4. 体积筛选
  if (size && size !== 'all') {
    // 粗略模拟体积筛选
    if (size === '<50m') {
      result = result.filter(item => !item.size?.includes('GB') && parseFloat(item.size || '0') <= 50);
    } else if (size === '>1g') {
      result = result.filter(item => item.size?.includes('GB'));
    }
  }

  // 5. 排序规则
  if (sort === 'downloads') {
    result.sort((a, b) => b.downloads - a.downloads);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'latest') {
    result.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  } else {
    // 综合加权排序
    result.sort((a, b) => (b.rating * 10000 + b.downloads) - (a.rating * 10000 + a.downloads));
  }

  const total = result.length;
  const startIndex = (page - 1) * limit;
  const pagedItems = result.slice(startIndex, startIndex + limit);

  return c.json(success(pagedItems, 'success', total));
});

// 获取资源详情
resourcesRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const fallback = MOCK_RESOURCES.find(r => r.id === id) || MOCK_RESOURCES[0];
  const item = await getCollectionOne('resources', id, fallback);
  if (!item) {
    return c.json(error('资源未找到', 404));
  }
  return c.json(success(item));
});

// 收藏 / 取消收藏
resourcesRouter.post('/:id/fav', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  const isFav = !!body.isFav;

  await createRecord('user_favorites', {
    resource_id: id,
    action: isFav ? 'favorite' : 'unfavorite',
    created: new Date().toISOString()
  });

  return c.json(success({ isFav }, isFav ? '已成功收藏此资源' : '已取消收藏'));
});

// 获取网盘直链与提取码 (记录下载日志)
resourcesRouter.get('/:id/download', async (c) => {
  const id = c.req.param('id');
  const fallback = MOCK_RESOURCES.find(r => r.id === id) || MOCK_RESOURCES[0];
  const item = await getCollectionOne('resources', id, fallback);
  if (!item) return c.json(error('资源未找到', 404));

  // 异步记录下载流水
  createRecord('download_logs', {
    resource_id: id,
    title: item.title,
    time: new Date().toISOString()
  });

  return c.json(success({
    id: item.id,
    title: item.title,
    panUrl: item.panUrl,
    pwd: item.pwd,
    tip: '请在网盘客户端中转存并极速下载'
  }));
});
