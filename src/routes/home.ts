import { Hono } from 'hono';
import { success } from '../utils/response.js';
import { getCollectionList, getCollectionFullList } from '../db/pb.js';

export const homeRouter = new Hono();

// 获取首页 Banner (来自 PocketBase 的 banners 表)
homeRouter.get('/banners', async (c) => {
  const items = await getCollectionFullList('banners');
  return c.json(success(items));
});

// 获取首页广播 (来自 PocketBase 的 announcements 表)
homeRouter.get('/announcements', async (c) => {
  const items = await getCollectionFullList('announcements', { sort: '-publishDate' });
  return c.json(success(items));
});

// 获取首页综合精选推荐 (来自 PocketBase 的 resources 表)
homeRouter.get('/recommendations', async (c) => {
  const tab = c.req.query('tab') || 'all';

  let sort = '-downloads';
  let filter = '';

  if (tab === 'new') {
    sort = '-publishDate';
  } else if (tab === 'essential') {
    filter = 'rating >= 4.9';
    sort = '-rating';
  } else if (tab === 'direct') {
    filter = 'tags ~ "直链" || tags ~ "免费"';
  } else if (tab === 'hot') {
    sort = '-downloads';
  }

  const { items, total } = await getCollectionList('resources', {
    filter,
    sort,
    perPage: 30
  });

  return c.json(success(items, 'success', total));
});

// 获取热门飙升榜 Top 3 (来自 PocketBase 的 resources 表下载量排名前三)
homeRouter.get('/top-picks', async (c) => {
  const { items } = await getCollectionList<any>('resources', {
    sort: '-downloads',
    perPage: 3
  });

  const picks = items.map((res, index) => ({
    id: res.id,
    title: res.title,
    version: res.version,
    badge: index === 0 ? 'TOP 1' : index === 1 ? 'TOP 2' : 'TOP 3',
    desc: `${res.platform || '全平台'} · ${res.size || '免安装'} · ${res.versionBadge || ''}`,
    downloads: res.downloadCountText || `${res.downloads} 人已获取`,
    icon: res.icon,
    iconBg: res.iconBg,
    link: res.panUrl,
    code: res.pwd
  }));

  return c.json(success(picks));
});

// 首页聚合总览数据 (完全从 PocketBase 数据库各表聚合)
homeRouter.get('/overview', async (c) => {
  const [banners, announcements, resources] = await Promise.all([
    getCollectionFullList('banners'),
    getCollectionFullList('announcements', { sort: '-publishDate' }),
    getCollectionList<any>('resources', { sort: '-downloads', perPage: 10 })
  ]);

  const topPicks = resources.items.slice(0, 3).map((res, index) => ({
    id: res.id,
    title: res.title,
    version: res.version,
    badge: index === 0 ? 'TOP 1' : index === 1 ? 'TOP 2' : 'TOP 3',
    desc: `${res.platform || '全平台'} · ${res.size || ''}`,
    downloads: res.downloadCountText || `${res.downloads} 人已获取`,
    icon: res.icon,
    iconBg: res.iconBg,
    link: res.panUrl,
    code: res.pwd
  }));

  return c.json(success({
    banners,
    announcements,
    topPicks,
    feedList: resources.items,
    stats: {
      totalResources: resources.total,
      totalDownloads: resources.items.reduce((sum, item) => sum + (item.downloads || 0), 0),
      updatedToday: announcements.length
    }
  }));
});
