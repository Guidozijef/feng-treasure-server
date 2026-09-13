import { Hono } from 'hono';
import { success } from '../utils/response.js';
import { getCollectionList, getCollectionFullList } from '../db/pb.js';

export const searchRouter = new Hono();

// 资源全局模糊搜索 (直接查询 PocketBase resources 表)
searchRouter.get('/', async (c) => {
  const keyword = (c.req.query('keyword') || '').trim();
  const sortParam = c.req.query('sort') || 'composite';

  let filter = '';
  if (keyword) {
    filter = `title ~ "${keyword}" || fullTitle ~ "${keyword}" || desc ~ "${keyword}" || fullDesc ~ "${keyword}" || platform ~ "${keyword}"`;
  }

  let sort = '-downloads';
  if (sortParam === 'latest') {
    sort = '-publishDate';
  } else if (sortParam === 'download') {
    sort = '-downloads';
  } else {
    sort = '-rating';
  }

  const { items, total } = await getCollectionList('resources', {
    filter,
    sort,
    perPage: 50
  });

  return c.json(success(items, 'success', total));
});

// 获取热搜词 (直接读取 PocketBase hot_keywords 表)
searchRouter.get('/hot-keywords', async (c) => {
  const items = await getCollectionFullList('hot_keywords', { sort: 'sort' });
  return c.json(success(items));
});
