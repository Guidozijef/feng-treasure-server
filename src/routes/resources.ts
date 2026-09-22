import { Hono } from 'hono';
import { success, error } from '../utils/response.js';
import { getCollectionList, getCollectionOne, createRecord } from '../db/pb.js';

export const resourcesRouter = new Hono();

// 辅助函数：解析文件体积为 MB 数值，用于精准区间过滤
function parseSizeMB(sizeStr: string): number {
  if (!sizeStr) return 0;
  const lower = sizeStr.toLowerCase().trim();
  const num = parseFloat(lower) || 0;
  if (lower.includes('gb')) return num * 1024;
  if (lower.includes('kb')) return num / 1024;
  return num; // 默认视为 MB
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

  // 2. 细分场景过滤
  if (scene && scene !== 'all') {
    filterParts.push(`scenes ~ "${scene}"`);
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
      filterParts.push('(badge ~ "免安装" || badge ~ "便携" || badge ~ "绿色" || tags ~ "免安装" || tags ~ "便携" || tags ~ "绿色" || desc ~ "免安装")');
    } else if (license === 'official') {
      filterParts.push('(badge ~ "官方" || badge ~ "原版" || badge ~ "纯净" || tags ~ "官方" || tags ~ "原版" || tags ~ "纯净")');
    } else if (license === 'free') {
      filterParts.push('(badge ~ "免费" || badge ~ "开源" || tags ~ "免费" || tags ~ "开源")');
    } else if (license === 'vip') {
      filterParts.push('(badge ~ "特权" || badge ~ "VIP" || badge ~ "免激活" || badge ~ "破解" || badge ~ "解锁" || tags ~ "特权" || tags ~ "VIP" || tags ~ "免激活" || tags ~ "破解" || tags ~ "解锁")');
    } else {
      filterParts.push(`(badge ~ "${license}" || tags ~ "${license}")`);
    }
  }

  // 5. 特色标签多选过滤
  if (tags && tags !== 'all') {
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    for (const t of tagList) {
      filterParts.push(`(tags ~ "${t}" || badge ~ "${t}" || title ~ "${t}" || desc ~ "${t}")`);
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

  // 7. 文件体积区间过滤 (精准数值解析)
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

  return c.json(success(items, 'success', total));
});


// 获取资源详情 (纯数据库读取，数据全部来自 PocketBase 数据库，零写死)
resourcesRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const item = await getCollectionOne('resources', id);
  if (!item) {
    return c.json(error('数据库中未查询到该资源', 404));
  }
  return c.json(success(item));
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

  // 写入 PocketBase 真实流水
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
