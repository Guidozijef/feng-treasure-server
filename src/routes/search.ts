import { Hono } from 'hono';
import { success } from '../utils/response.js';
import { MOCK_RESOURCES } from '../utils/mockData.js';
import { getCollectionList } from '../db/pb.js';

export const searchRouter = new Hono();

// 资源全局搜索
searchRouter.get('/', async (c) => {
  const keyword = (c.req.query('keyword') || '').trim().toLowerCase();
  const sort = c.req.query('sort') || 'composite'; // 'composite' | 'latest' | 'download'
  const { items } = await getCollectionList('resources', MOCK_RESOURCES);

  let list = [...items];
  if (keyword) {
    list = list.filter(item => {
      const matchTitle = (item.title || '').toLowerCase().includes(keyword);
      const matchDesc = (item.desc || '').toLowerCase().includes(keyword);
      const matchFullDesc = (item.fullDesc || '').toLowerCase().includes(keyword);
      const matchPlatform = (item.platform || '').toLowerCase().includes(keyword);
      const matchTags = (item.tags || []).some((t: any) => (t.text || '').toLowerCase().includes(keyword));
      return matchTitle || matchDesc || matchFullDesc || matchPlatform || matchTags;
    });
  }

  // 排序
  if (sort === 'latest') {
    list.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  } else if (sort === 'download') {
    list.sort((a, b) => b.downloads - a.downloads);
  } else {
    // 综合
    list.sort((a, b) => (b.rating * 10000 + b.downloads) - (a.rating * 10000 + a.downloads));
  }

  return c.json(success(list, 'success', list.length));
});

// 获取热搜词榜单
searchRouter.get('/hot-keywords', (c) => {
  const hotKeywords = [
    { text: 'Cursor AI', heat: '99w', isHot: true },
    { text: 'Typora 经典版', heat: '88w', isHot: true },
    { text: 'Docker Desktop', heat: '65w', isHot: false },
    { text: 'Notion 汉化', heat: '54w', isHot: false },
    { text: 'Bandizip 免装', heat: '49w', isHot: false },
    { text: '408 考研笔记', heat: '38w', isHot: false },
    { text: 'WindTerm 终端', heat: '32w', isHot: false },
    { text: '商用免费字体', heat: '29w', isHot: false }
  ];
  return c.json(success(hotKeywords));
});
