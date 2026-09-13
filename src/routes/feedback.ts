import { Hono } from 'hono';
import { success, error } from '../utils/response.js';
import { createRecord, getCollectionList } from '../db/pb.js';

export const feedbackRouter = new Hono();

// 获取失效问题选项
feedbackRouter.get('/types', (c) => {
  return c.json(success({
    issueTypes: [
      { id: 'netdisk', name: '网盘链接失效 / 被取消' },
      { id: 'pwd', name: '提取码 / 解压密码错误' },
      { id: 'harm', name: '文件被和谐 / 无法访问' },
      { id: 'corrupt', name: '解压包损坏 / 无法解压' },
      { id: 'outdated', name: '版本过旧 / 需更新' },
      { id: 'other', name: '其它异常问题' }
    ],
    channels: [
      { id: 'quark', name: '夸克网盘', iconType: 'cloud', selected: true },
      { id: 'baidu', name: '百度网盘', iconType: 'cloud', selected: false },
      { id: 'ali', name: '阿里云盘', iconType: 'cloud', selected: false },
      { id: 'lanzou', name: '蓝奏云', iconType: 'cloud', selected: false },
      { id: 'direct', name: '官方高速直链', iconType: 'link', selected: false }
    ]
  }));
});

// 提交失效报告 (直接写入 PocketBase resource_reports 表)
feedbackRouter.post('/report', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { resourceId, resourceTitle, issueType, channels, detailText, screenshots, noticeEnabled } = body;

  if (!issueType) {
    return c.json(error('请选择失效类型', 400));
  }

  const record = await createRecord('resource_reports', {
    resource_id: resourceId || '',
    resource_title: resourceTitle || '',
    issue_type: issueType,
    channels: Array.isArray(channels) ? channels.join(',') : (channels || ''),
    detail_text: detailText || '',
    screenshots: Array.isArray(screenshots) ? screenshots.join(',') : '',
    notice_enabled: !!noticeEnabled,
    status: 'pending',
    status_text: '专人寻找校验中',
    statusType: 'pending',
    time: '刚刚'
  });

  return c.json(success({
    reportId: record.id,
    status: 'pending',
    statusText: '专人寻找校验中',
    message: '反馈已成功录入数据库，技术专人进入补档排期'
  }));
});

// 获取我的失效反馈记录 (直接从 PocketBase resource_reports 查询)
feedbackRouter.get('/history', async (c) => {
  const { items } = await getCollectionList('resource_reports', { perPage: 20 });
  return c.json(success(items));
});

// 催办
feedbackRouter.post('/urge', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  return c.json(success({ urged: true }, `已向工程师加急催促【${body.title || '工单'}】！`));
});
