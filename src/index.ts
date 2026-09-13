import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { config } from './config.js';
import { authenticateAdmin } from './db/pb.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// 引入模块化路由
import { homeRouter } from './routes/home.js';
import { categoriesRouter } from './routes/categories.js';
import { resourcesRouter } from './routes/resources.js';
import { searchRouter } from './routes/search.js';
import { hotRouter } from './routes/hot.js';
import { feedbackRouter } from './routes/feedback.js';
import { requestRouter } from './routes/request.js';
import { vipRouter } from './routes/vip.js';
import { userRouter } from './routes/user.js';

const app = new Hono();

// 全局中间件
app.use('*', logger());
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use('*', errorHandler());

// 健康检测探针
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    app: 'feng-treasure-server',
    version: '1.0.0',
    pocketbase: config.pocketbaseUrl,
    time: new Date().toISOString()
  });
});

// 根路径友好欢迎信息
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>枫的藏宝阁 API 服务</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0b1120; color: #f8fafc; padding: 40px; display: flex; justify-content: center; }
          .card { background: #1e293b; border-radius: 16px; padding: 32px; max-width: 640px; width: 100%; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
          h1 { color: #38bdf8; margin-top: 0; }
          .badge { display: inline-block; background: #0284c7; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; }
          ul { line-height: 1.8; color: #cbd5e1; }
          code { background: #0f172a; padding: 2px 6px; border-radius: 4px; color: #38bdf8; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🍁 枫的藏宝阁 API 服务已就绪 <span class="badge">Hono + PocketBase</span></h1>
          <p>技术栈：<strong>Hono</strong> (轻量高性能) + <strong>PocketBase</strong> (数据持久化)</p>
          <p>当前连接 PocketBase：<code>${config.pocketbaseUrl}</code></p>
          <h3>核心接口列表：</h3>
          <ul>
            <li><code>GET /api/health</code> - 服务健康探针</li>
            <li><code>GET /api/home/overview</code> - 首页聚合总览</li>
            <li><code>GET /api/categories</code> - 8 大分类列表</li>
            <li><code>GET /api/resources</code> - 资源多维筛选与分页</li>
            <li><code>GET /api/resources/:id</code> - 资源详情</li>
            <li><code>GET /api/resources/:id/download</code> - 获取直链与密码</li>
            <li><code>GET /api/hot/rankings</code> - 飙升榜与热门排行</li>
            <li><code>GET /api/search?keyword=</code> - 资源全局搜索</li>
            <li><code>POST /api/feedback/report</code> - 提交失效链接报告</li>
            <li><code>POST /api/request/submit</code> - 提交求资源工单</li>
            <li><code>GET /api/vip/plans</code> - VIP 套餐列表</li>
            <li><code>GET /api/user/profile</code> - 用户个人中心资产</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

// 注册 API 模块路由
app.route('/api/home', homeRouter);
app.route('/api/categories', categoriesRouter);
app.route('/api/resources', resourcesRouter);
app.route('/api/search', searchRouter);
app.route('/api/hot', hotRouter);
app.route('/api/feedback', feedbackRouter);
app.route('/api/request', requestRouter);
app.route('/api/vip', vipRouter);
app.route('/api/user', userRouter);

// 404 处理
app.notFound(notFoundHandler);

// 尝试连接并认证 PocketBase 管理员
authenticateAdmin();

// 启动服务器
console.log(`🚀 [枫的藏宝阁 API] 正在启动，监听端口: ${config.port}`);
console.log(`🔗 [PocketBase 目标] ${config.pocketbaseUrl}`);

serve({
  fetch: app.fetch,
  port: config.port
});
