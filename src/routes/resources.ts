import { Hono } from 'hono';
import { success, error } from '../utils/response.js';
import { getCollectionList, getCollectionOne, createRecord } from '../db/pb.js';

export const resourcesRouter = new Hono();

// 获取资源列表 (直接通过 PocketBase 查询与多维过滤)
resourcesRouter.get('/', async (c) => {
  const category = c.req.query('category');
  const scene = c.req.query('scene');
  const sortParam = c.req.query('sort') || 'comprehensive';
  const systems = c.req.query('systems');
  const size = c.req.query('size');
  const page = parseInt(c.req.query('page') || '1', 10);
  const limit = parseInt(c.req.query('limit') || '20', 10);

  // 构建 PocketBase 过滤条件
  const filterParts: string[] = [];

  if (category && category !== 'all') {
    filterParts.push(`category = "${category}"`);
  }
  if (scene && scene !== 'all') {
    filterParts.push(`scenes ~ "${scene}"`);
  }
  if (systems) {
    const sysList = systems.split(',').map(s => s.trim().toLowerCase());
    const sysFilters = sysList.map(s => `platform ~ "${s}"`);
    sysFilters.push('platform ~ "全平台"');
    filterParts.push(`(${sysFilters.join(' || ')})`);
  }

  // 排序规则
  let sort = '-downloads';
  if (sortParam === 'downloads') {
    sort = '-downloads';
  } else if (sortParam === 'rating') {
    sort = '-rating';
  } else if (sortParam === 'latest') {
    sort = '-publishDate';
  }

  const { items, total } = await getCollectionList('resources', {
    page,
    perPage: limit,
    filter: filterParts.join(' && '),
    sort
  });

  return c.json(success(items, 'success', total));
});


// 获取资源详情 (纯数据库读取，数据全部来自 PocketBase 数据库，零写死)
resourcesRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const item = await getCollectionOne('resources', id);
  if (!item) {
    return c.json(error('数据库中未查询到该资源', 404));
  }
  return c.json(success(item));
});

// 用户收藏切换 (写入 PocketBase user_favorites)
resourcesRouter.post('/:id/fav', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  const isFav = !!body.isFav;

  await createRecord('user_favorites', {
    resource_id: id,
    action: isFav ? 'favorite' : 'unfavorite'
  });

  return c.json(success({ isFav }, isFav ? '已成功收藏至云端数据库' : '已取消收藏'));
});

// 获取网盘直链并记录到 PocketBase download_logs
resourcesRouter.get('/:id/download', async (c) => {
  const id = c.req.param('id');
  const item = await getCollectionOne<any>('resources', id);
  if (!item) return c.json(error('资源不存在', 404));

  // 写入 PocketBase 真实流水
  await createRecord('download_logs', {
    resource_id: id,
    title: item.title,
    time: new Date().toISOString()
  });

  return c.json(success({
    id: item.id,
    title: item.title,
    panUrl: item.panUrl,
    pwd: item.pwd,
    tip: '已获取网盘直链并记入下载日志'
  }));
});
