import { Hono } from 'hono';
import { success, error } from '../utils/response.js';
import { getCollectionList, getCollectionOne, createRecord } from '../db/pb.js';

export const resourcesRouter = new Hono();

// 场景ID到中文细分标签名称映射表（实现无缝语义对齐）
const SCENE_ID_MAP: Record<string, string> = {
  mac: 'Mac 专区',
  win: 'Windows常用',
  essential: '装机必备',
  opensource: '开源神器',
  plugin: '浏览器插件',
  portable_tag: '便携绿色',
  cs: '计算机408',
  algo: '算法题库',
  math: '考研数学',
  english: '四六级核心',
  pdf: '高清PDF彩印',
  notes: '学霸手写笔记',
  devops: '运维部署',
  ocr: 'OCR识别',
  screen: '截图贴图',
  terminal: '终端SSH',
  zip: '压缩解压',
  sync: '多端同步',
  ps: 'PS/PR插件',
  lut: '电影LUT调色',
  font: '商用免费字库',
  c4d: '3D/C4D工程',
  ui: 'Figma组件',
  sketch: '矢量图标库',
  frontend: 'Vue/React源码',
  backend: 'Spring Boot脚手架',
  ai: '大模型Agent',
  docker_tpl: 'Compose编排',
  python: '爬虫与自动化',
  electron: '桌面客户端',
  player: '高帧播放器',
  encode: '无损压制工具',
  music: '无损音质解码',
  cut: '剪辑特效包',
  sub: '字幕自动提取',
  stream: '直播推流推介',
  steam: 'Steam汉化补丁',
  mod: '精选MOD整合',
  emu: '街机复古模拟器',
  speed: '加速辅助脚本',
  tool: '手柄映射工具',
  save: '完美通关存档',
  ppt: '商务精美PPT',
  excel: '财务自动函数表',
  word: '毕业论文排版',
  resume: '高通过率简历',
  notion: 'Notion知识库',
  mind: '思维导图模板'
};

// 辅助函数：解析文件体积为 MB 数值
function parseSizeMB(sizeStr: string): number {
  if (!sizeStr) return 0;
  const lower = sizeStr.toLowerCase().trim();
  const num = parseFloat(lower) || 0;
  if (lower.includes('gb')) return num * 1024;
  if (lower.includes('kb')) return num / 1024;
  return num;
}

// 统一资源输出结构：清洗废弃冗余字段，统一 tags 结构
export function normalizeResourceItem(item: any) {
  if (!item) return item;
  let tags: Array<{ text: string; type: string }> = [];
  const palette = ['blue', 'green', 'orange', 'purple'];

  if (Array.isArray(item.tags)) {
    tags = item.tags.map((t: any, idx: number) => {
      if (typeof t === 'string') {
        return { text: t, type: palette[idx % palette.length] };
      }
      return {
        text: t.text || t.name || '',
        type: t.type || palette[idx % palette.length]
      };
    }).filter((t: any) => Boolean(t.text));
  }

  // 保证 badge 字段和 tags 第一项保持一致
  const primaryBadge = tags[0]?.text || item.badge || '';

  return {
    ...item,
    tags,
    badge: primaryBadge,
    // 废弃/冗余字段平滑对齐
    versionBadge: item.version || '',
    fullTitle: item.title || '',
    fullDesc: item.desc || '',
    downloadCountText: (item.downloads || 0) > 10000 
      ? `${((item.downloads || 0) / 10000).toFixed(1)}w 人已获取`
      : `${item.downloads || 0} 人已获取`
  };
}

// 获取资源列表 (直接通过 PocketBase 查询与多维联合过滤)
resourcesRouter.get('/', async (c) => {
  const category = c.req.query('category');
  const scene = c.req.query('scene');
  const sortParam = c.req.query('sort') || 'comprehensive';
  const systems = c.req.query('systems');
  const size = c.req.query('size');
  const license = c.req.query('license');
  const tags = c.req.query('tags') || c.req.query('tag');
  const pwdType = c.req.query('pwdType');
  const page = parseInt(c.req.query('page') || '1', 10);
  const limit = parseInt(c.req.query('limit') || '50', 10);

  // 构建 PocketBase 过滤条件
  const filterParts: string[] = [];

  // 1. 大分类过滤
  if (category && category !== 'all') {
    filterParts.push(`category = "${category}"`);
  }

  // 2. 细分标签过滤 (统一通过 tags 字段检索，兼容 scene id 与中文标签名)
  if (scene && scene !== 'all') {
    const mappedName = SCENE_ID_MAP[scene];
    if (mappedName) {
      filterParts.push(`(tags ~ "${mappedName}" || tags ~ "${scene}" || scenes ~ "${scene}")`);
    } else {
      filterParts.push(`(tags ~ "${scene}" || scenes ~ "${scene}")`);
    }
  }

  // 3. 系统平台多选过滤
  if (systems && systems !== 'all') {
    const sysList = systems.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (sysList.length > 0) {
      const sysFilters: string[] = [];
      for (const sys of sysList) {
        if (sys === 'win' || sys === 'windows') {
          sysFilters.push('platform ~ "win" || platform ~ "windows"');
        } else if (sys === 'mac' || sys === 'macos') {
          sysFilters.push('platform ~ "mac" || platform ~ "apple"');
        } else if (sys === 'web') {
          sysFilters.push('platform ~ "web" || platform ~ "网页" || platform ~ "chrome"');
        } else if (sys === 'linux') {
          sysFilters.push('platform ~ "linux"');
        } else {
          sysFilters.push(`platform ~ "${sys}"`);
        }
      }
      sysFilters.push('platform ~ "全平台"');
      filterParts.push(`(${sysFilters.join(' || ')})`);
    }
  }

  // 4. 版本授权与特性过滤
  if (license && license !== 'all') {
    if (license === 'green') {
      filterParts.push('(tags ~ "免安装" || tags ~ "便携" || tags ~ "绿色" || desc ~ "免安装")');
    } else if (license === 'official') {
      filterParts.push('(tags ~ "官方" || tags ~ "原版" || tags ~ "纯净")');
    } else if (license === 'free') {
      filterParts.push('(tags ~ "免费" || tags ~ "开源")');
    } else if (license === 'vip') {
      filterParts.push('(tags ~ "特权" || tags ~ "VIP" || tags ~ "免激活" || tags ~ "破解" || tags ~ "解锁")');
    } else {
      filterParts.push(`(tags ~ "${license}" || badge ~ "${license}")`);
    }
  }

  // 5. 特色标签多选过滤
  if (tags && tags !== 'all') {
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    for (const t of tagList) {
      filterParts.push(`(tags ~ "${t}" || title ~ "${t}" || desc ~ "${t}")`);
    }
  }

  // 6. 提取码模式过滤
  if (pwdType && pwdType !== 'all') {
    if (pwdType === 'free') {
      filterParts.push('(pwd = "免码" || pwd = "")');
    } else if (pwdType === 'has_pwd') {
      filterParts.push('(pwd != "免码" && pwd != "")');
    }
  }

  // 7. 最低好评评分过滤
  const minRating = c.req.query('minRating');
  if (minRating && !isNaN(parseFloat(minRating))) {
    filterParts.push(`rating >= ${parseFloat(minRating)}`);
  }

  // 排序规则
  let sort = '-downloads';
  if (sortParam === 'downloads') {
    sort = '-downloads';
  } else if (sortParam === 'rating') {
    sort = '-rating';
  } else if (sortParam === 'latest') {
    sort = '-publishDate';
  }

  let { items, total } = await getCollectionList('resources', {
    page,
    perPage: limit,
    filter: filterParts.join(' && '),
    sort
  });

  // 8. 文件体积区间过滤
  if (size && size !== 'all') {
    items = items.filter(item => {
      const mb = parseSizeMB(item.size);
      if (size === 'small') return mb > 0 && mb <= 50;
      if (size === 'medium') return mb > 50 && mb <= 500;
      if (size === 'large') return mb > 500 && mb <= 2048;
      if (size === 'xlarge') return mb > 2048;
      return true;
    });
    total = items.length;
  }

  const normalizedItems = items.map(normalizeResourceItem);
  return c.json(success(normalizedItems, 'success', total));
});

// 获取资源详情
resourcesRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const item = await getCollectionOne('resources', id);
  if (!item) {
    return c.json(error('数据库中未查询到该资源', 404));
  }
  return c.json(success(normalizeResourceItem(item)));
});

// 用户收藏切换 (写入 PocketBase user_favorites)
resourcesRouter.post('/:id/fav', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  const isFav = !!body.isFav;

  await createRecord('user_favorites', {
    resource_id: id,
    action: isFav ? 'favorite' : 'unfavorite'
  });

  return c.json(success({ isFav }, isFav ? '已成功收藏至云端数据库' : '已取消收藏'));
});

// 获取网盘直链并记录到 PocketBase download_logs
resourcesRouter.get('/:id/download', async (c) => {
  const id = c.req.param('id');
  const item = await getCollectionOne<any>('resources', id);
  if (!item) return c.json(error('资源不存在', 404));

  await createRecord('download_logs', {
    resource_id: id,
    title: item.title,
    time: new Date().toISOString()
  });

  return c.json(success({
    id: item.id,
    title: item.title,
    panUrl: item.panUrl,
    pwd: item.pwd,
    tip: '已获取网盘直链并记入下载日志'
  }));
});
