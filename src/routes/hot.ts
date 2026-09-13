import { Hono } from 'hono';
import { success } from '../utils/response.js';
import { getCollectionList } from '../db/pb.js';

export const hotRouter = new Hono();

// 获取排行榜单 (纯从 PocketBase resources 统计)
hotRouter.get('/rankings', async (c) => {
  const tab = c.req.query('tab') || 'soar';
  const cat = c.req.query('category') || 'all';

  let filter = '';
  if (cat && cat !== 'all') {
    filter = `category = "${cat}"`;
  }

  let sort = '-downloads';
  if (tab === 'rating') {
    sort = '-rating';
  } else if (tab === 'new') {
    sort = '-publishDate';
  }

  const { items } = await getCollectionList<any>('resources', {
    filter,
    sort,
    perPage: 15
  });

  const top1 = items[0] ? {
    id: items[0].id,
    rankBadge: 'TOP 1 冠军榜首',
    heat: `${Math.round((items[0].downloads || 50000) / 1000)}w`,
    title: items[0].title,
    fullTitle: items[0].fullTitle || items[0].title,
    version: items[0].version,
    tag: items[0].versionBadge || '免安装绿色版',
    desc: items[0].desc,
    rating: `${items[0].rating} 分`,
    size: items[0].size,
    source: '网盘高速直链',
    link: items[0].panUrl,
    code: items[0].pwd
  } : null;

  const top2 = items[1] ? {
    id: items[1].id,
    rankBadge: 'TOP 2',
    heat: `${Math.round((items[1].downloads || 40000) / 1000)}w`,
    icon: items[1].icon,
    title: items[1].title,
    sub: items[1].versionBadge,
    desc: items[1].desc,
    tag: '稳定无弹窗',
    source: '网盘极速直链',
    link: items[1].panUrl,
    code: items[1].pwd
  } : null;

  const top3 = items[2] ? {
    id: items[2].id,
    rankBadge: 'TOP 3',
    heat: `${Math.round((items[2].downloads || 30000) / 1000)}w`,
    icon: items[2].icon,
    title: items[2].title,
    sub: items[2].versionBadge,
    desc: items[2].desc,
    tag: '国内高速源',
    source: '网盘高速',
    link: items[2].panUrl,
    code: items[2].pwd
  } : null;

  const rankList = items.slice(3, 10).map((item, idx) => ({
    rank: String(idx + 4).padStart(2, '0'),
    id: item.id,
    title: item.title,
    fullTitle: item.fullTitle || item.title,
    tag: item.versionBadge || '开箱即用',
    tagClass: idx % 3 === 0 ? 'tag-blue' : idx % 3 === 1 ? 'tag-green' : 'tag-amber',
    rating: String(item.rating),
    heat: `${Math.round((item.downloads || 10000) / 1000)}w热度`,
    size: item.size,
    icon: item.icon,
    source: '网盘高速直达',
    link: item.panUrl,
    code: item.pwd
  }));

  return c.json(success({
    tab,
    category: cat,
    top1,
    top2,
    top3,
    rankList
  }));
});
