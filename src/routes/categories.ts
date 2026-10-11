import { Hono } from 'hono';
import { success, error } from '../utils/response.js';
import { getCollectionFullList, getCollectionOne, pb } from '../db/pb.js';

export const categoriesRouter = new Hono();

// 获取主分类列表 (附带关联细分标签)
categoriesRouter.get('/', async (c) => {
  const items = await getCollectionFullList<any>('categories', { sort: 'sort' });
  const normalized = items.map(cat => ({
    ...cat,
    tags: Array.isArray(cat.scenes) ? cat.scenes : []
  }));
  return c.json(success(normalized));
});

// 获取分类顶置快速标签
categoriesRouter.get('/quick-tags', async (c) => {
  const items = await getCollectionFullList('quick_tags');
  return c.json(success(items));
});

// 获取指定分类下的关联细分标签
categoriesRouter.get('/:id/sub-scenes', async (c) => {
  const catId = c.req.param('id');
  const cat = await getCollectionOne<any>('categories', catId);
  const scenes = cat?.scenes || [];
  return c.json(success(scenes));
});

// 别名路由：获取指定分类下的关联细分标签
categoriesRouter.get('/:id/tags', async (c) => {
  const catId = c.req.param('id');
  const cat = await getCollectionOne<any>('categories', catId);
  const scenes = cat?.scenes || [];
  return c.json(success(scenes));
});

// 更新指定分类的关联细分标签 (管理端调用)
categoriesRouter.put('/:id/tags', async (c) => {
  const catId = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  const tags = body.tags || body.scenes || [];

  try {
    let pbRecordId = catId;
    try {
      const found = await pb.collection('categories').getFirstListItem(`cat_id = "${catId}" || id = "${catId}"`);
      if (found) pbRecordId = found.id;
    } catch {}

    const updated = await pb.collection('categories').update(pbRecordId, {
      scenes: tags
    });
    return c.json(success(updated, '分类细分标签已成功更新'));
  } catch (err: any) {
    return c.json(error('更新标签失败: ' + (err?.message || err), 500));
  }
});
