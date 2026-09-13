import { Hono } from 'hono';
import { success } from '../utils/response.js';
import { MOCK_CATEGORIES, MOCK_QUICK_TAGS, MOCK_SCENES_MAP } from '../utils/mockData.js';
import { getCollectionList } from '../db/pb.js';

export const categoriesRouter = new Hono();

// 获取 8 大分类列表
categoriesRouter.get('/', async (c) => {
  const { items } = await getCollectionList('categories', MOCK_CATEGORIES, { sort: 'sort' });
  return c.json(success(items));
});

// 获取顶部分类快速标签
categoriesRouter.get('/quick-tags', async (c) => {
  const { items } = await getCollectionList('quick_tags', MOCK_QUICK_TAGS);
  return c.json(success(items));
});

// 获取指定分类下的细分场景标签
categoriesRouter.get('/:id/sub-scenes', async (c) => {
  const catId = c.req.param('id');
  const scenes = MOCK_SCENES_MAP[catId] || MOCK_SCENES_MAP['pc'] || [];
  return c.json(success(scenes));
});
