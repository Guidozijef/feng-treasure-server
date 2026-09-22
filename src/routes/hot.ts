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
    heat: `${((items[0].downloads || 98600) / 1000).toFixed(1)}w`,
    icon: items[0].icon || '/images/cloud.svg',
    title: items[0].title,
    fullTitle: items[0].fullTitle || items[0].title,
    version: items[0].versionBadge || items[0].version || '最新稳定版',
    tag: items[0].badge || (items[0].tags && items[0].tags[0] ? items[0].tags[0].text : '全平台免安装'),
    desc: items[0].desc,
    rating: `${items[0].rating || 9.9} 分`,
    size: items[0].size || '82.4 MB',
    source: '网盘高速直链',
    link: items[0].panUrl,
    code: items[0].pwd
  } : null;

  const top2 = items[1] ? {
    id: items[1].id,
    rankBadge: 'TOP 2',
    heat: `${((items[1].downloads || 89200) / 1000).toFixed(1)}w`,
    icon: items[1].icon || '/images/hot_typora.svg',
    title: items[1].title,
    sub: items[1].versionBadge || items[1].platform || '极简便携',
    desc: items[1].desc || '经典高效生产力工具',
    tag: items[1].badge || (items[1].tags && items[1].tags[0] ? items[1].tags[0].text : '稳定无弹窗'),
    source: '网盘极速直链',
    link: items[1].panUrl,
    code: items[1].pwd
  } : null;

  const top3 = items[2] ? {
    id: items[2].id,
    rankBadge: 'TOP 3',
    heat: `${((items[2].downloads || 76500) / 1000).toFixed(1)}w`,
    icon: items[2].icon || '/images/hot_docker.svg',
    title: items[2].title,
    sub: items[2].versionBadge || items[2].platform || '开箱即用',
    desc: items[2].desc || '高分必备极客开发神器',
    tag: items[2].badge || (items[2].tags && items[2].tags[0] ? items[2].tags[0].text : '国内高速源'),
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
    rating: String(item.rating || '4.9'),
    heat: `${((item.downloads || 50000) / 1000).toFixed(1)}w热度`,
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
