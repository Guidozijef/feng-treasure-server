import { Hono } from 'hono';
import { success } from '../utils/response.js';
import { MOCK_BANNERS, MOCK_ANNOUNCEMENTS, MOCK_RESOURCES } from '../utils/mockData.js';
import { getCollectionList } from '../db/pb.js';

export const homeRouter = new Hono();

// 获取首页 Banner 列表
homeRouter.get('/banners', async (c) => {
  const { items } = await getCollectionList('banners', MOCK_BANNERS);
  return c.json(success(items));
});

// 获取首页更新快报
homeRouter.get('/announcements', async (c) => {
  const { items } = await getCollectionList('announcements', MOCK_ANNOUNCEMENTS);
  return c.json(success(items));
});

// 获取首页精选推荐 (支持 tab 过滤: all | new | essential | direct | hot)
homeRouter.get('/recommendations', async (c) => {
  const tab = c.req.query('tab') || 'all';
  const { items } = await getCollectionList('resources', MOCK_RESOURCES);

  let filtered = [...items];
  if (tab === 'hot') {
    filtered.sort((a, b) => b.downloads - a.downloads);
  } else if (tab === 'new') {
    filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  } else if (tab === 'essential') {
    filtered = filtered.filter(item => item.scenes?.includes('essential') || item.rating >= 4.9);
  } else if (tab === 'direct') {
    filtered = filtered.filter(item => (item.tags || []).some((t: any) => t.text?.includes('直链') || t.text?.includes('免费')));
  }

  return c.json(success(filtered, 'success', filtered.length));
});

// 获取首页飙升榜 TopPicks (3条)
homeRouter.get('/top-picks', async (c) => {
  const { items } = await getCollectionList('resources', MOCK_RESOURCES);
  const sorted = [...items].sort((a, b) => b.downloads - a.downloads).slice(0, 3);
  const picks = sorted.map((res, index) => ({
    id: res.id,
    title: res.title,
    version: res.version,
    badge: index === 0 ? 'TOP 1' : index === 1 ? 'TOP 2' : 'TOP 3',
    desc: `${res.platform} · ${res.size} · ${res.versionBadge}`,
    downloads: res.downloadCountText || `${res.downloads} 人已获取`,
    icon: res.icon,
    iconBg: res.iconBg,
    link: res.panUrl,
    code: res.pwd
  }));
  return c.json(success(picks));
});

// 获取首页聚合总览数据
homeRouter.get('/overview', async (c) => {
  const [banners, announcements, resources] = await Promise.all([
    getCollectionList('banners', MOCK_BANNERS),
    getCollectionList('announcements', MOCK_ANNOUNCEMENTS),
    getCollectionList('resources', MOCK_RESOURCES)
  ]);

  const topPicks = [...resources.items].sort((a, b) => b.downloads - a.downloads).slice(0, 3).map((res, index) => ({
    id: res.id,
    title: res.title,
    version: res.version,
    badge: index === 0 ? 'TOP 1' : index === 1 ? 'TOP 2' : 'TOP 3',
    desc: `${res.platform} · ${res.size}`,
    downloads: res.downloadCountText || `${res.downloads} 人已获取`,
    icon: res.icon,
    iconBg: res.iconBg,
    link: res.panUrl,
    code: res.pwd
  }));

  return c.json(success({
    banners: banners.items,
    announcements: announcements.items,
    topPicks,
    feedList: resources.items.slice(0, 10),
    stats: {
      totalResources: 1240,
      totalDownloads: 486000,
      updatedToday: 38
    }
  }));
});
