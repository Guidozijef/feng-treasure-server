import { Hono } from 'hono';
import { success } from '../utils/response.js';
import { getCollectionFullList, getCollectionOne } from '../db/pb.js';

export const categoriesRouter = new Hono();

// 获取主分类列表 (来自 PocketBase categories 表)
categoriesRouter.get('/', async (c) => {
  const items = await getCollectionFullList('categories', { sort: 'sort' });
  return c.json(success(items));
});

// 获取分类顶置快速标签 (来自 PocketBase quick_tags 表)
categoriesRouter.get('/quick-tags', async (c) => {
  const items = await getCollectionFullList('quick_tags');
  return c.json(success(items));
});

// 获取指定分类下的细分场景标签 (直接读取 PocketBase categories 记录的 scenes 字段)
categoriesRouter.get('/:id/sub-scenes', async (c) => {
  const catId = c.req.param('id');
  const cat = await getCollectionOne<any>('categories', catId);
  const scenes = cat?.scenes || [];
  return c.json(success(scenes));
});
