# 枫的藏宝阁 (Feng Treasure) - 后台 API 服务

基于 **Hono** + **PocketBase** 构建的高性能、轻量级后台服务，专为「枫的藏宝阁」微信小程序提供全套 API 接口。

---

## 🛠️ 技术栈与特性

- **Web 框架**: [Hono](https://hono.dev/)（超快、类型安全、低开销）
- **数据库**: [PocketBase](https://pocketbase.io/)（运行于 `http://47.109.109.134:8091`）
- **自动降级容灾机制**: 即使 PocketBase 暂未创建 Collection 或连接异常，服务也会自动降级提供丰富完备的预设数据，确保小程序端 100% 正常交互。
- **跨域支持**: 内置 CORS 跨域中间件，方便本地调试与多端接入。
- **环境配置**: 基于 `.env` 灵活配置端口与数据库地址。

---

## 📁 目录结构

```
d:\git\feng-treasure-server
├── src/
│   ├── config.ts              # 环境变量与应用配置
│   ├── index.ts               # Hono 应用入口与服务启动
│   ├── db/
│   │   └── pb.ts              # PocketBase 客户端与安全读写包装
│   ├── middleware/
│   │   └── errorHandler.ts    # 全局错误与 404 处理中间件
│   ├── routes/
│   │   ├── home.ts            # 首页 Banner、更新快报、聚合总览
│   │   ├── categories.ts      # 8 大分类、场景标签、快速标签
│   │   ├── resources.ts       # 资源多维筛选、详情、收藏、直链下载
│   │   ├── search.ts          # 资源全局模糊搜索与热搜榜
│   │   ├── hot.ts             # 飙升榜、热门榜单与评分榜
│   │   ├── feedback.ts        # 失效链接报告与工单进展
│   │   ├── request.ts         # 求资源工单登记与催办
│   │   ├── vip.ts             # SVIP 会员套餐、特权、下单
│   │   └── user.ts            # 用户资产、打卡签到、收藏与历史
│   └── utils/
│       ├── mockData.ts        # 兜底与种子数据
│       └── response.ts        # 统一标准返回格式封装
├── .env                       # 本地环境变量
├── .env.example               # 环境变量示例
├── package.json               # 依赖与脚本
└── tsconfig.json              # TypeScript 编译配置
```

---

## 🚀 本地开发与启动

### 1. 安装依赖
```bash
npm install
```

### 2. 开发模式运行 (热重载)
```bash
npm run dev
```
服务将启动在: `http://localhost:3000`
访问探针: `http://localhost:3000/api/health`

### 3. 构建与生产运行
```bash
npm run build
npm start
```

---

## ☁️ 阿里云服务器部署指南

### 1. 打包/上传至服务器
将 `d:\git\feng-treasure-server` 目录上传到服务器（例如 `/root/feng-treasure/server`）：
```bash
# 在服务器上创建目录并进入
mkdir -p /root/feng-treasure/server
cd /root/feng-treasure/server
```

### 2. 配置服务器端 .env
在服务器对应目录下创建 `.env`：
```env
PORT=3000
# 阿里云上后台与 PocketBase 在同一台机器，可直接内网连接更高效更安全：
POCKETBASE_URL=http://127.0.0.1:8091
PB_ADMIN_EMAIL=
PB_ADMIN_PASSWORD=
```

### 3. 使用 PM2 守护运行
```bash
npm install -g pm2
npm install
npm run build
pm2 start dist/index.js --name feng-server
pm2 save
pm2 startup
```

---

## 📊 PocketBase 数据表（Collections）推荐配置

后台支持自动适配以下 PocketBase 集合。如需在 PocketBase 后台手动建表，推荐字段如下：

1. **`resources` (资源表)**
   - `id` (text, 唯一主键)
   - `title` (text, 资源标题)
   - `fullTitle` (text, 完整标题)
   - `version` (text, 版本号)
   - `versionBadge` (text, 版本徽章)
   - `desc` (text, 简要描述)
   - `fullDesc` (text, 详细描述)
   - `category` (text, 分类ID: pc / study / tools / design / dev / media / game / office)
   - `scenes` (json, 细分场景数组)
   - `platform` (text, 操作系统平台)
   - `size` (text, 体积如 48MB)
   - `rating` (number, 评分如 4.9)
   - `downloads` (number, 下载量)
   - `panUrl` (text, 网盘直链)
   - `pwd` (text, 提取码)
   - `icon` (text, 图标路径)

2. **`resource_reports` (失效反馈表)**
   - `resource_id` (text)
   - `resource_title` (text)
   - `issue_type` (text)
   - `channels` (text)
   - `detail_text` (text)
   - `status` (text: pending / resolved)

3. **`resource_requests` (求资源工单表)**
   - `order_no` (text)
   - `title` (text)
   - `category` (text)
   - `platforms` (text)
   - `detail_desc` (text)
   - `is_svip_speed` (bool)
   - `status` (text: pending / done)

4. **`vip_orders` (会员充值订单表)**
   - `order_no` (text)
   - `plan_id` (text)
   - `price` (number)
   - `uid` (text)
   - `pay_status` (text)

---

## 🔌 完整 API 接口一览

| 模块 | 请求方法 | 路径 | 功能说明 |
|---|---|---|---|
| **健康探针** | `GET` | `/api/health` | 服务状态与数据库连接检测 |
| **首页** | `GET` | `/api/home/banners` | 轮播 Banner 列表 |
| **首页** | `GET` | `/api/home/announcements` | 今日更新广播快报 |
| **首页** | `GET` | `/api/home/top-picks` | 飙升榜前三精选 |
| **首页** | `GET` | `/api/home/recommendations` | 首页综合推荐列表（支持 tab 筛选） |
| **首页** | `GET` | `/api/home/overview` | 首页聚合总览数据 |
| **分类** | `GET` | `/api/categories` | 8 大主分类 |
| **分类** | `GET` | `/api/categories/quick-tags` | 顶部快速便携标签 |
| **分类** | `GET` | `/api/categories/:id/sub-scenes` | 分类专属细分场景标签 |
| **资源** | `GET` | `/api/resources` | 多维筛选列表（category/scene/systems/size/sort/page） |
| **资源** | `GET` | `/api/resources/:id` | 资源完整详情 |
| **资源** | `POST`| `/api/resources/:id/fav` | 收藏 / 取消收藏 |
| **资源** | `GET` | `/api/resources/:id/download` | 获取网盘直链、提取码与下载流水记录 |
| **榜单** | `GET` | `/api/hot/rankings` | 飙升榜 / 本周热门 / 今日新上 / 评分最高 |
| **搜索** | `GET` | `/api/search` | 关键词搜索与排序 |
| **搜索** | `GET` | `/api/search/hot-keywords` | 大家都在搜热搜词 |
| **失效反馈** | `GET` | `/api/feedback/types` | 失效问题分类与渠道选项 |
| **失效反馈** | `POST`| `/api/feedback/report` | 提交失效链接报告 |
| **失效反馈** | `GET` | `/api/feedback/history` | 我的反馈进展列表 |
| **失效反馈** | `POST`| `/api/feedback/urge` | 催促进度 |
| **求资源** | `GET` | `/api/request/config` | 求档分类与平台选项 |
| **求资源** | `POST`| `/api/request/submit` | 提交求资源工单 |
| **求资源** | `GET` | `/api/request/history` | 我的求档历史记录 |
| **VIP中心** | `GET` | `/api/vip/plans` | 会员套餐列表（月卡/年卡/永久） |
| **VIP中心** | `GET` | `/api/vip/privileges` | 8 大极客黑卡特权 |
| **VIP中心** | `GET` | `/api/vip/faqs` | 常见问题答疑 |
| **VIP中心** | `POST`| `/api/vip/create-order` | 建立会员订单 |
| **个人中心** | `GET` | `/api/user/profile` | 用户资料、UID、资产、VIP 状态 |
| **个人中心** | `POST`| `/api/user/checkin` | 每日打卡签到 (+5 云豆) |
| **个人中心** | `GET` | `/api/user/favorites` | 我的收藏列表 |
| **个人中心** | `GET` | `/api/user/history` | 我的下载记录 |
| **个人中心** | `POST`| `/api/user/redeem` | 激活码兑换特权 |
