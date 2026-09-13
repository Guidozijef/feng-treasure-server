import { Hono } from 'hono';
import { success } from '../utils/response.js';
import { MOCK_RESOURCES } from '../utils/mockData.js';
import { getCollectionList } from '../db/pb.js';

export const hotRouter = new Hono();

// 获取排行榜单 (支持 tab 维度: soar(总榜飙升) | week(本周热门) | new(今日新上) | rating(评分最高))
hotRouter.get('/rankings', async (c) => {
  const tab = c.req.query('tab') || 'soar';
  const cat = c.req.query('category') || 'all';

  const { items } = await getCollectionList('resources', MOCK_RESOURCES);
  let list = [...items];

  if (cat && cat !== 'all') {
    list = list.filter(item => item.category === cat);
  }

  if (tab === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (tab === 'new') {
    list.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  } else {
    list.sort((a, b) => b.downloads - a.downloads);
  }

  const top1 = list[0] ? {
    id: list[0].id,
    rankBadge: 'TOP 1 冠军榜首',
    heat: '98.6w',
    title: list[0].title,
    fullTitle: list[0].fullTitle,
    version: list[0].version,
    tag: list[0].versionBadge || '免安装绿色版',
    desc: list[0].desc,
    rating: `${list[0].rating} 分`,
    size: list[0].size,
    source: '网盘高速直链',
    link: list[0].panUrl,
    code: list[0].pwd
  } : null;

  const top2 = list[1] ? {
    id: list[1].id,
    rankBadge: 'TOP 2',
    heat: '89.2w',
    icon: list[1].icon,
    title: list[1].title,
    sub: list[1].versionBadge,
    desc: list[1].desc,
    tag: '稳定无弹窗',
    source: '网盘极速直链',
    link: list[1].panUrl,
    code: list[1].pwd
  } : null;

  const top3 = list[2] ? {
    id: list[2].id,
    rankBadge: 'TOP 3',
    heat: '76.5w',
    icon: list[2].icon,
    title: list[2].title,
    sub: list[2].versionBadge,
    desc: list[2].desc,
    tag: '国内高速源',
    source: 'Quark网盘',
    link: list[2].panUrl,
    code: list[2].pwd
  } : null;

  const rankList = list.slice(3, 10).map((item, idx) => ({
    rank: String(idx + 4).padStart(2, '0'),
    id: item.id,
    title: item.title,
    fullTitle: item.fullTitle || item.title,
    tag: item.versionBadge || '开箱即用',
    tagClass: idx % 3 === 0 ? 'tag-blue' : idx % 3 === 1 ? 'tag-green' : 'tag-amber',
    rating: String(item.rating),
    heat: `${Math.round(item.downloads / 1000)}w热度`,
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
