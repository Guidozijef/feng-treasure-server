export const MOCK_BANNERS = [
  {
    id: 'ai-tools',
    tag: '2025 重点企划 · 精选首发',
    title: 'AI生产力工具全集',
    subTitle: '50+离线模型与一键开箱脚本整合包',
    btnText: '立即获取',
    targetType: 'resource',
    targetId: 'cursor-ai',
    image: '/images/res_cursor_ai.svg',
    bgColor: 'linear-gradient(135deg, #0263e0 0%, #1e40af 100%)'
  },
  {
    id: 'dev-pack',
    tag: '独家定制 · 程序员必备',
    title: '全栈开发效能武器库',
    subTitle: 'Docker镜像加速/高频脚本/逆向工具',
    btnText: '立即获取',
    targetType: 'category',
    targetId: 'dev',
    image: '/images/hot_docker.svg',
    bgColor: 'linear-gradient(135deg, #059669 0%, #065f46 100%)'
  },
  {
    id: 'design-pack',
    tag: '商用无忧 · 终身免费',
    title: '设计师超级素材全家桶',
    subTitle: '万套精选字体/矢量图标/3D模型',
    btnText: '立即获取',
    targetType: 'category',
    targetId: 'design',
    image: '/images/feed_font.svg',
    bgColor: 'linear-gradient(135deg, #d97706 0%, #9a3412 100%)'
  }
];

export const MOCK_ANNOUNCEMENTS = [
  {
    id: 'notice-1',
    title: '今日更新广播',
    content: '今日已更新 38 款优质资源，全部免毒免流，包括 Cursor AI、沉浸式翻译 Pro 与 2025 商用字体包！',
    publishDate: '2025-09-13',
    badge: 'NEW'
  },
  {
    id: 'notice-2',
    title: '高速直链升级通知',
    content: '百度网盘与夸克网盘备用高速分流通道已配置完成，黑卡 SVIP 尊享满速下载。',
    publishDate: '2025-09-12',
    badge: 'HOT'
  }
];

export const MOCK_CATEGORIES = [
  { id: 'pc', name: '电脑应用', icon: '/images/cat_pc.svg', bgClass: 'cat-bg-pc', hasHot: false, sort: 1 },
  { id: 'study', name: '学习资料', icon: '/images/cat_study.svg', bgClass: 'cat-bg-study', hasHot: true, sort: 2 },
  { id: 'tools', name: '效率工具', icon: '/images/cat_tools.svg', bgClass: 'cat-bg-tools', hasHot: false, sort: 3 },
  { id: 'design', name: '设计素材', icon: '/images/cat_design.svg', bgClass: 'cat-bg-design', hasHot: false, sort: 4 },
  { id: 'dev', name: '编程开发', icon: '/images/cat_dev.svg', bgClass: 'cat-bg-dev', hasHot: false, sort: 5 },
  { id: 'media', name: '影音多媒体', icon: '/images/cat_media.svg', bgClass: 'cat-bg-media', hasHot: false, sort: 6 },
  { id: 'game', name: '游戏娱乐', icon: '/images/cat_game.svg', bgClass: 'cat-bg-game', hasHot: false, sort: 7 },
  { id: 'office', name: '办公模版', icon: '/images/cat_office.svg', bgClass: 'cat-bg-office', hasHot: false, sort: 8 }
];

export const MOCK_QUICK_TAGS = [
  { id: 'direct', name: '全部直链', hasArrow: true, active: true },
  { id: 'portable', name: '免解压绿色版', hasArrow: false, active: false },
  { id: 'today', name: '今日最新', hasDot: true, hasArrow: false, active: false },
  { id: 'highScore', name: '高分必收', hasArrow: false, active: false },
  { id: 'openSource', name: '开源神器', hasArrow: false, active: false },
  { id: 'appleM', name: 'M芯片适配', hasArrow: false, active: false }
];

export const MOCK_SCENES_MAP: Record<string, Array<{ id: string; name: string; active: boolean }>> = {
  pc: [
    { id: 'mac', name: 'Mac 专区', active: true },
    { id: 'win', name: 'Windows常用', active: false },
    { id: 'essential', name: '装机必备', active: false },
    { id: 'opensource', name: '开源神器', active: false },
    { id: 'plugin', name: '浏览器插件', active: false },
    { id: 'portable_tag', name: '便携绿色', active: false }
  ],
  study: [
    { id: 'cs', name: '计算机408', active: true },
    { id: 'algo', name: '算法题库', active: false },
    { id: 'math', name: '考研数学', active: false },
    { id: 'english', name: '四六级核心', active: false },
    { id: 'pdf', name: '高清PDF彩印', active: false },
    { id: 'notes', name: '学霸手写笔记', active: false }
  ],
  tools: [
    { id: 'devops', name: '运维部署', active: true },
    { id: 'ocr', name: 'OCR识别', active: false },
    { id: 'screen', name: '截图贴图', active: false },
    { id: 'terminal', name: '终端SSH', active: false },
    { id: 'zip', name: '压缩解压', active: false },
    { id: 'sync', name: '多端同步', active: false }
  ],
  design: [
    { id: 'ps', name: 'PS/PR插件', active: true },
    { id: 'lut', name: '电影LUT调色', active: false },
    { id: 'font', name: '商用免费字库', active: false },
    { id: 'c4d', name: '3D/C4D工程', active: false },
    { id: 'ui', name: 'Figma组件', active: false },
    { id: 'sketch', name: '矢量图标库', active: false }
  ],
  dev: [
    { id: 'frontend', name: 'Vue/React源码', active: true },
    { id: 'backend', name: 'Spring Boot脚手架', active: false },
    { id: 'ai', name: '大模型Agent', active: false },
    { id: 'docker_tpl', name: 'Compose编排', active: false },
    { id: 'python', name: '爬虫与自动化', active: false },
    { id: 'electron', name: '桌面客户端', active: false }
  ],
  media: [
    { id: 'player', name: '高帧播放器', active: true },
    { id: 'encode', name: '无损压制工具', active: false },
    { id: 'music', name: '无损音质解码', active: false },
    { id: 'cut', name: '剪辑特效包', active: false },
    { id: 'sub', name: '字幕自动提取', active: false },
    { id: 'stream', name: '直播推流推介', active: false }
  ],
  game: [
    { id: 'steam', name: 'Steam汉化补丁', active: true },
    { id: 'mod', name: '精选MOD整合', active: false },
    { id: 'emu', name: '街机复古模拟器', active: false },
    { id: 'speed', name: '加速辅助脚本', active: false },
    { id: 'tool', name: '手柄映射工具', active: false },
    { id: 'save', name: '完美通关存档', active: false }
  ],
  office: [
    { id: 'ppt', name: '商务精美PPT', active: true },
    { id: 'excel', name: '财务自动函数表', active: false },
    { id: 'word', name: '毕业论文排版', active: false },
    { id: 'resume', name: '高通过率简历', active: false },
    { id: 'notion', name: 'Notion知识库', active: false },
    { id: 'mind', name: '思维导图模板', active: false }
  ]
};

export const MOCK_RESOURCES = [
  {
    id: 'picgo',
    title: 'PicGo 图床利器',
    fullTitle: 'PicGo 图床管理利器 v2.4.0 稳定绿色版',
    version: 'v2.4.0 稳定绿色版',
    versionBadge: 'v2.4.0',
    badge: 'TOP 1',
    badgeClass: 'badge-blue',
    desc: '好用的云存储图床管理工具，支持一键上传与剪贴板自动格式转换。免去繁琐安装与广告推送。',
    fullDesc: '好用的云存储图床管理工具，支持一键上传与剪贴板自动格式转换。免去繁琐安装与广告推送。',
    category: 'pc',
    scenes: ['mac', 'win', 'opensource', 'portable_tag'],
    platform: '全平台免安装',
    size: '48.2 MB',
    rating: 4.9,
    downloads: 52100,
    downloadCountText: '1.2w 人已获取',
    panUrl: 'https://pan.quark.cn/s/picgo_v240_free',
    pwd: '88ab',
    icon: '/images/detail_picgo.svg',
    iconBg: '#e0ecff',
    publishDate: '2025-09-10',
    tags: [
      { text: '开源免费', type: 'blue' },
      { text: '免安装绿色版', type: 'green' }
    ],
    features: [
      '支持 GitHub、又拍云、七牛云、阿里云 OSS 等 10+ 主流图床',
      '快捷键一键上传剪贴板图片，自动生成 Markdown 链接',
      '跨平台支持 Windows、macOS 与 Linux，内存占用极低'
    ],
    favCount: '2.4k'
  },
  {
    id: 'typora',
    title: 'Typora 写作神器',
    fullTitle: 'Typora 经典版 v0.11 / v1.8.10 离线便携版',
    version: 'v1.8.10 离线便携版',
    versionBadge: 'v1.8.10',
    badge: '最后免授权',
    badgeClass: 'badge-slate',
    desc: '极简无干扰的 Markdown 编辑利器，支持所见即所得、丰富的数学公式排版与暗黑主题自适应。',
    fullDesc: '所见即所得 Markdown 文本编辑器，极简免干扰无多余授权校验。内置极客暗黑主题与自动图床联动。',
    category: 'pc',
    scenes: ['mac', 'win', 'essential'],
    platform: 'Windows / macOS',
    size: '72.4 MB',
    rating: 4.9,
    downloads: 62800,
    downloadCountText: '2.3w 人已获取',
    panUrl: 'https://pan.quark.cn/s/typora_portable_vip',
    pwd: 'ty66',
    icon: '/images/hot_typora.svg',
    iconBg: '#e0e7ff',
    publishDate: '2025-09-08',
    tags: [
      { text: '离线可用', type: 'orange' },
      { text: '便携版', type: 'blue' }
    ],
    features: [
      '极致所见即所得编辑体验，打字如丝般顺滑',
      '强大 LaTeX 数学公式渲染、Mermaid 流程图绘制',
      '自定义 CSS 主题支持，文章可直接导出 PDF / HTML'
    ],
    favCount: '3.6k'
  },
  {
    id: 'docker',
    title: 'Docker Desktop 容器引擎',
    fullTitle: 'Docker Desktop v4.28 镜像加速免装版',
    version: 'v4.28 镜像加速免装版',
    versionBadge: 'v4.28',
    badge: '推荐',
    badgeClass: 'badge-green',
    desc: '专为微服务与本地容器编排调优的高速环境，内置国内多源镜像加速节点，开发更流畅。',
    fullDesc: '开发必备容器虚拟化环境，适配 M1/M2/M3 及 Win11 WSL2 镜像调优，内存降低 40% 开箱即用。',
    category: 'pc',
    scenes: ['mac', 'win', 'essential'],
    platform: 'Windows WSL2 / macOS',
    size: '512 MB',
    rating: 4.8,
    downloads: 34500,
    downloadCountText: '1.9w 人已获取',
    panUrl: 'https://pan.quark.cn/s/docker_desktop_wsl2',
    pwd: 'dock',
    icon: '/images/hot_docker.svg',
    iconBg: '#e0eaff',
    publishDate: '2025-09-05',
    tags: [
      { text: '开发神装', type: 'blue' },
      { text: '国内高速源', type: 'green' }
    ],
    features: [
      '内置国内阿里云、网易等高可用镜像源配置',
      '针对 WSL2 与 Apple Silicon 调优，内存占用大幅缩减',
      '一键启动 Docker Compose 编排套件'
    ],
    favCount: '1.8k'
  },
  {
    id: 'windterm',
    title: 'WindTerm 极客终端',
    fullTitle: 'WindTerm v2.6.1 高性能绿色版',
    version: 'v2.6.1 高性能绿色版',
    versionBadge: 'v2.6.1',
    badge: 'v2.6.1',
    badgeClass: 'badge-green',
    desc: '开源纯 C 语言编写的高性能终端与 SSH 客户端，内存占用极低，支持跳板机与会话自动保存。',
    fullDesc: '纯 C 编写极速终端，内存极低。支持跳板机、SFTP 双向文件传输与会话多标签管理。',
    category: 'tools',
    scenes: ['terminal', 'devops'],
    platform: 'Windows / Linux / macOS',
    size: '34.8 MB',
    rating: 4.8,
    downloads: 27900,
    downloadCountText: '9.6k 人已获取',
    panUrl: 'https://pan.quark.cn/s/windterm_free_portable',
    pwd: 'term',
    icon: '/images/hot_windterm.svg',
    iconBg: '#f0fdf4',
    publishDate: '2025-09-01',
    tags: [
      { text: '开源免配', type: 'blue' },
      { text: '极速轻量', type: 'green' }
    ],
    features: [
      '纯 C 语言开发，速度超越 XShell 与 SecureCRT',
      '集成自动补全、语法高亮与折叠',
      '免安装解压即用，配置随 U 盘便携携带'
    ],
    favCount: '1.2k'
  },
  {
    id: 'pixpin',
    title: 'PixPin 截图贴图神器',
    fullTitle: 'PixPin v1.8.8 离线便携版',
    version: 'v1.8.8 离线便携版',
    versionBadge: 'v1.8.8',
    badge: '神器级',
    badgeClass: 'badge-amber',
    desc: '功能强大的截图、贴图、长截图与离线 OCR 文本识别工具，小巧纯净无弹窗。',
    fullDesc: '离线 OCR 文本识别、智能贴图与长截图工具，小巧纯净无广告弹窗。',
    category: 'tools',
    scenes: ['screen', 'ocr'],
    platform: 'Windows / macOS',
    size: '26.4 MB',
    rating: 4.9,
    downloads: 31200,
    downloadCountText: '1.5w 人已获取',
    panUrl: 'https://pan.quark.cn/s/pixpin_offline_v188',
    pwd: 'pix8',
    icon: '/images/hot_pixpin.svg',
    iconBg: '#fef3c7',
    publishDate: '2025-08-28',
    tags: [
      { text: '离线OCR', type: 'orange' },
      { text: '长截图贴图', type: 'blue' }
    ],
    features: [
      '智能识别 UI 边框元素，像素级精准截图',
      '内置离线 OCR 引擎，无隐私外泄风险，一键复制文本',
      '贴图置顶与快捷缩放操作'
    ],
    favCount: '1.5k'
  },
  {
    id: 'vscode',
    title: 'VS Code 极客定制版',
    fullTitle: 'VS Code v1.87 便携免装套件',
    version: 'v1.87 便携免装套件',
    versionBadge: 'v1.87',
    badge: '开箱即用',
    badgeClass: 'badge-green',
    desc: '预装高频开发扩展插件与中文语言包，解压即用，支持随身 U 盘便携运行与配置无缝同步。',
    fullDesc: '预装高频开发插件（Python、Node、GitLens、Prettier）与中文语言包，解压即用。',
    category: 'dev',
    scenes: ['frontend', 'backend'],
    platform: '全平台免安装',
    size: '98.5 MB',
    rating: 5.0,
    downloads: 58000,
    downloadCountText: '3.4w 人已获取',
    panUrl: 'https://pan.quark.cn/s/vscode_portable_geek',
    pwd: 'code',
    icon: '/images/hot_vscode.svg',
    iconBg: '#eff6ff',
    publishDate: '2025-09-02',
    tags: [
      { text: '便携免装', type: 'blue' },
      { text: '全插件预装', type: 'green' }
    ],
    features: [
      '所有扩展与用户配置存放在同一目录，真正便携化',
      '调优启动速度与内存参数，秒开大型项目工程',
      '集成 GitLens、Error Lens、Tailwind CSS 等数十款神级插件'
    ],
    favCount: '4.1k'
  },
  {
    id: 'bandizip',
    title: 'Bandizip 经典便携版',
    fullTitle: 'Bandizip v6.29 纯净无广告版',
    version: 'v6.29 纯净无广告版',
    versionBadge: 'v6.29',
    badge: '绿色免装',
    badgeClass: 'badge-purple',
    desc: '终身无广告、支持极速多核压缩解压的经典良心解压软件，支持右键直接智能提取。',
    fullDesc: '终身无广告版本，支持多核并行解压，自动修复乱码文件名，支持右键直接预览。',
    category: 'tools',
    scenes: ['zip'],
    platform: 'Windows',
    size: '8.2 MB',
    rating: 4.8,
    downloads: 42000,
    downloadCountText: '4.2w 人已获取',
    panUrl: 'https://pan.quark.cn/s/bandizip_v629_free',
    pwd: 'zip8',
    icon: '/images/hot_bandizip.svg',
    iconBg: '#faf5ff',
    publishDate: '2025-08-20',
    tags: [
      { text: '无广告', type: 'green' },
      { text: '极速多核', type: 'blue' }
    ],
    features: [
      '最后一款完全无广告弹窗与推广的官方经典版本',
      '多核 CPU 加速解压缩，超大文件秒解',
      '支持智能解压与乱码文件名自动字符集转换'
    ],
    favCount: '2.9k'
  },
  {
    id: 'cs408',
    title: '计算机 408 考点全集',
    fullTitle: '计算机 408 考研脉络全集 (2025 高清彩印版)',
    version: '2025 精校高清彩印 PDF',
    versionBadge: '2025版',
    badge: '2025版',
    badgeClass: 'badge-blue',
    desc: '包含数据结构、计算机组成原理、操作系统与计算机网络四大科目的考点脉络图谱。',
    fullDesc: '精校高清彩印 PDF 与知识图谱梳理，包含经典大题解析与考点背诵小册子。',
    category: 'study',
    scenes: ['cs', 'notes', 'pdf'],
    platform: 'PDF / 电子书',
    size: '128 MB',
    rating: 4.9,
    downloads: 36700,
    downloadCountText: '8.8k 人已获取',
    panUrl: 'https://pan.quark.cn/s/cs408_core_notes',
    pwd: '408k',
    icon: '/images/hot_cs408.svg',
    iconBg: '#ecfdf5',
    publishDate: '2025-08-15',
    tags: [
      { text: '学霸笔记', type: 'blue' },
      { text: '考研必刷', type: 'orange' }
    ],
    features: [
      '四合一完整知识框架，考点高频词重点高亮',
      '带完整 PDF 交互目录书签，iPad / 电脑顺滑翻阅',
      '附赠历年经典真题及解题思维导图'
    ],
    favCount: '2.2k'
  },
  {
    id: 'potplayer',
    title: 'PotPlayer 纯净免安装版',
    fullTitle: 'PotPlayer 纯净免安装版 60帧整合',
    version: 'v1.7 60帧调优版',
    versionBadge: '60帧整合',
    badge: '60帧整合',
    badgeClass: 'badge-orange',
    desc: '内置 MadVR、LAV 解码滤镜与无黑边硬件加速，画质极致通透。',
    fullDesc: '内置 MadVR、LAV 解码滤镜与无黑边硬件加速，画质极致通透，支持各类 4K HDR 格式无损解码。',
    category: 'media',
    scenes: ['player', 'encode'],
    platform: '全能播放器',
    size: '35 MB',
    rating: 4.9,
    downloads: 41800,
    downloadCountText: '1.4w 人已获取',
    panUrl: 'https://pan.quark.cn/s/potplayer_clean_60fps',
    pwd: 'pot8',
    icon: '/images/res_potplayer.svg',
    iconBg: '#fef3c7',
    publishDate: '2025-08-10',
    tags: [
      { text: '4K无损', type: 'orange' },
      { text: '免安装版', type: 'blue' }
    ],
    features: [
      '预装精选暗黑皮肤，无任何右下角推广弹窗',
      '配置好 LAV Filters 与 MadVR 渲染引擎',
      '支持插帧至 60/120 帧，画面顺滑细腻'
    ],
    favCount: '1.9k'
  },
  {
    id: 'utools',
    title: 'uTools 极客生产力箱',
    fullTitle: 'uTools 极客生产力工具箱 v4.3',
    version: 'v4.3 离线增强版',
    versionBadge: 'v4.3',
    badge: '插件化',
    badgeClass: 'badge-green',
    desc: '快捷呼出搜索框，自由装配多款实用效率插件与剪切板增强。',
    fullDesc: '快捷呼出搜索框，自由装配多款实用效率插件与剪切板增强，瞬间完成换算、正则、翻译、聚合搜索。',
    category: 'pc',
    scenes: ['mac', 'win', 'plugin'],
    platform: '跨平台',
    size: '85 MB',
    rating: 4.8,
    downloads: 39600,
    downloadCountText: '1.1w 人已获取',
    panUrl: 'https://pan.quark.cn/s/utools_geek_package',
    pwd: 'utool',
    icon: '/images/res_utools.svg',
    iconBg: '#4ade80',
    publishDate: '2025-08-01',
    tags: [
      { text: '快捷启动', type: 'green' },
      { text: '聚合插件', type: 'blue' }
    ],
    features: [
      'Alt + 空格瞬间唤醒，快速进入任何功能',
      '百款开源插件市场，随用随装',
      '跨设备同步个人配置与剪贴板历史'
    ],
    favCount: '1.6k'
  },
  {
    id: 'cursor-ai',
    title: 'Cursor AI 代码辅助套件',
    fullTitle: 'Cursor AI 极速开箱便携套件',
    version: 'v0.42 最新版',
    versionBadge: 'v0.42',
    badge: 'AI神装',
    badgeClass: 'badge-blue',
    desc: 'AI 驱动编程神装，开箱免配置即刻写代码，支持多模型智能联动。',
    fullDesc: 'AI 驱动编程神装，开箱免配置即刻写代码，内附国内直连配置教程与提示词工作流。',
    category: 'dev',
    scenes: ['ai', 'frontend', 'backend'],
    platform: 'Mac / Win',
    size: '128 MB',
    rating: 4.9,
    downloads: 48200,
    downloadCountText: '2.1w 人已获取',
    panUrl: 'https://pan.quark.cn/s/cursor_ai_pack',
    pwd: 'cur8',
    icon: '/images/res_cursor_ai.svg',
    iconBg: '#eef6ff',
    publishDate: '2025-09-12',
    tags: [
      { text: 'Claude 3.5', type: 'blue' },
      { text: '开箱即用', type: 'green' }
    ],
    features: [
      'Cmd+K 代码原地智能重构与生成',
      '全项目代码库索引与智能问答',
      'Composer 多文件联动批量自动化编码'
    ],
    favCount: '3.1k'
  },
  {
    id: 'trans',
    title: '沉浸式翻译 双语增强插件',
    fullTitle: '沉浸式翻译 双语增强插件 v1.4.0 离线直装版',
    version: 'v1.4.0',
    versionBadge: 'v1.4.0',
    badge: '精选首发',
    badgeClass: 'badge-blue',
    desc: '无需外网，双语对照网页、PDF、EPUB 电子书沉浸式阅读神器。',
    fullDesc: '无需外网，双语对照网页、PDF、EPUB 电子书沉浸式阅读神器，内置免费接口配置。',
    category: 'pc',
    scenes: ['plugin', 'portable_tag'],
    platform: 'Edge / Chrome / Firefox',
    size: '2.8 MB',
    rating: 4.9,
    downloads: 38900,
    downloadCountText: '1.6w 人已获取',
    panUrl: 'https://pan.quark.cn/s/immersive-translate-pro',
    pwd: '7829',
    icon: '/images/feed_trans.svg',
    iconBg: '#eff6ff',
    publishDate: '2025-09-11',
    tags: [
      { text: 'Edge/Chrome', type: 'blue' },
      { text: '免费直链', type: 'green' }
    ],
    features: [
      '智能识别主文本区域，双语并列排版',
      '支持 PDF、EPUB、字幕双语无损翻译导出',
      '内置多种翻译引擎自定义接入'
    ],
    favCount: '2.8k'
  },
  {
    id: 'fonts',
    title: '2025精选商用免费中文字体全家桶',
    fullTitle: '2025 精选商用免费中文字体 100+款打包',
    version: '2025 典藏版',
    versionBadge: '100+款',
    badge: '商用无忧',
    badgeClass: 'badge-orange',
    desc: '包含黑体、宋体、书法、手写、卡通等 100+ 款终身免费商用字体包。',
    fullDesc: '包含黑体、宋体、书法、手写、卡通等 100+ 款终身免费商用字体包，附正版授权授权证书文件。',
    category: 'design',
    scenes: ['font', 'ui'],
    platform: '全平台 TTF / OTF',
    size: '1.4 GB',
    rating: 4.8,
    downloads: 29800,
    downloadCountText: '1.2w 人已获取',
    panUrl: 'https://www.alipan.com/s/commercial-fonts-2025',
    pwd: 'font',
    icon: '/images/feed_font.svg',
    iconBg: '#fff7ed',
    publishDate: '2025-09-09',
    tags: [
      { text: '设计商用', type: 'orange' },
      { text: '100+款', type: 'blue' }
    ],
    features: [
      '全部附带官方开源商用许可证（SIL / OFL）',
      '涵盖各大知名免费字体（思源、霞鹜、阿里妈妈等）',
      '一键安装脚本，批量部署至系统字体库'
    ],
    favCount: '2.5k'
  },
  {
    id: 'python',
    title: 'Python 实战自动化爬虫项目合集',
    fullTitle: 'Python 自动化实战与高并发爬虫项目精选',
    version: 'v3.12 适配版',
    versionBadge: '源码完整',
    badge: '开箱即用',
    badgeClass: 'badge-green',
    desc: '涵盖各大电商、社交媒体数据抓取与自动化脚本，附环境一键安装脚本。',
    fullDesc: '涵盖各大电商、社交媒体数据抓取与自动化脚本，代码规范带详细注释，附环境一键配置命令。',
    category: 'dev',
    scenes: ['python', 'ai'],
    platform: 'Python 3.10+',
    size: '420 MB',
    rating: 5.0,
    downloads: 31000,
    downloadCountText: '1.3w 人已获取',
    panUrl: 'https://pan.quark.cn/s/python-spider-pro',
    pwd: 'py38',
    icon: '/images/feed_code.svg',
    iconBg: '#f0fdf4',
    publishDate: '2025-09-06',
    tags: [
      { text: '源码脚本', type: 'green' },
      { text: '开箱即用', type: 'blue' }
    ],
    features: [
      '包含 Playwright、Scrapy 与异步 aiohttp 高性能模板',
      '包含反爬虫对策及验证码识别实战模块',
      'Docker 一键运行镜像与定时调度配置'
    ],
    favCount: '2.7k'
  },
  {
    id: 'math',
    title: '高数上/下册公式速记手册与例题',
    fullTitle: '考研数学高数公式全集与学霸考前速成笔记',
    version: '2025 彩印精校',
    versionBadge: '速记宝典',
    badge: '学霸笔记',
    badgeClass: 'badge-blue',
    desc: '公式推导、极限微分积分定理速查卡片与常考题型解法归纳。',
    fullDesc: '公式推导、极限微分积分定理速查卡片与常考题型解法归纳，掌上自习室刷题利器。',
    category: 'study',
    scenes: ['math', 'notes', 'pdf'],
    platform: 'PDF 高清版',
    size: '86 MB',
    rating: 4.9,
    downloads: 24500,
    downloadCountText: '9.2k 人已获取',
    panUrl: 'https://pan.baidu.com/s/math-notes-formula',
    pwd: 'math',
    icon: '/images/feed_chart.svg',
    iconBg: '#eff6ff',
    publishDate: '2025-08-30',
    tags: [
      { text: '学霸笔记', type: 'blue' },
      { text: '期末速成', type: 'red' }
    ],
    features: [
      '考研与大学期末考试高频公式一网打尽',
      '经典例题解析与技巧思维点拨',
      '便携电子手账排版，手机平板舒适阅读'
    ],
    favCount: '1.9k'
  },
  {
    id: 'sound',
    title: '影视解说/自媒体转场音效与BGM全集',
    fullTitle: '短视频影视解说无版权高品质音效素材包',
    version: '2025 典藏版',
    versionBadge: '无版权',
    badge: '短视频必备',
    badgeClass: 'badge-blue',
    desc: '精选 3000+ 转场、悬疑、搞笑、科技与解说专属背景音乐，无版权风险。',
    fullDesc: '精选 3000+ 转场、悬疑、搞笑、科技与解说专属背景音乐，全部分类归档并附带试听。',
    category: 'media',
    scenes: ['cut', 'music'],
    platform: 'WAV / MP3 320k',
    size: '2.1 GB',
    rating: 4.7,
    downloads: 21800,
    downloadCountText: '8.4k 人已获取',
    panUrl: 'https://pan.quark.cn/s/video-bgm-effects',
    pwd: 'bgm9',
    icon: '/images/feed_audio.svg',
    iconBg: '#faf5ff',
    publishDate: '2025-08-25',
    tags: [
      { text: '短视频必备', type: 'blue' },
      { text: '无版权', type: 'green' }
    ],
    features: [
      '所有音效按使用场景（开场、打脸、悬疑、紧张）清晰命名',
      '无损母带格式压制，高动态保真音质',
      '支持剪映、FCPX、PR 一键批量导入媒体库'
    ],
    favCount: '1.4k'
  }
];

export const MOCK_VIP_PLANS = [
  {
    id: 'month',
    name: '连续包月',
    shortName: '连续包月',
    price: 9.9,
    originalPrice: '19.9',
    discount: 10,
    unit: '',
    perDay: '折合 ¥0.33/天',
    extraBenefit: '可随时取消',
    badge: '新人首月特惠',
    badgeType: 'badge-blue',
    benefitType: 'benefit-cyan'
  },
  {
    id: 'year',
    name: '年度黑卡',
    shortName: '极客黑卡',
    price: 68,
    originalPrice: '199',
    discount: 131,
    unit: '/年',
    perDay: '折合 ¥0.18/天',
    extraBenefit: '送600云豆',
    badge: '推荐爆款',
    badgeType: 'badge-orange',
    benefitType: 'benefit-orange'
  },
  {
    id: 'forever',
    name: '永久黑卡',
    shortName: '永久黑卡',
    price: 128,
    originalPrice: '399',
    discount: 271,
    unit: '',
    perDay: '一次付费终生',
    extraBenefit: '永久身份徽章',
    badge: '终身买断',
    badgeType: 'badge-black',
    benefitType: 'benefit-gold'
  }
];

export const MOCK_VIP_PRIVILEGES = [
  {
    id: 'ad',
    title: '全站免广告',
    desc: '免看激励视频，一键直达高速下载地址',
    icon: '/images/vip_priv_ad.svg',
    bgColor: '#eff6ff'
  },
  {
    id: 'copy',
    title: '无限高速复制',
    desc: '普通用户日限3次，黑卡享受无限次提取',
    icon: '/images/vip_priv_copy.svg',
    bgColor: '#f5f3ff'
  },
  {
    id: 'repo',
    title: '独家私域资源库',
    desc: '商业完整源码、内测神器与极客脚本',
    icon: '/images/vip_priv_repo.svg',
    bgColor: '#fffbeb'
  },
  {
    id: 'repair',
    title: '1对1极速补档',
    desc: '专属工单，链接失效专人在2小时内重传',
    icon: '/images/vip_priv_repair.svg',
    bgColor: '#ecfdf5'
  },
  {
    id: 'pwd',
    title: '解压密码直查',
    desc: '自动匹配解密，全网网盘提取码免解压',
    icon: '/images/vip_priv_pwd.svg',
    bgColor: '#f0f9ff'
  },
  {
    id: 'bean',
    title: '云豆双倍膨胀',
    desc: '签到做任务收益200%，积分兑换加倍快',
    icon: '/images/vip_priv_bean.svg',
    bgColor: '#fff7ed'
  },
  {
    id: 'group',
    title: 'VIP专属交流群',
    desc: '技术大佬闭门交流，群内共享一线开发情报',
    icon: '/images/vip_priv_group.svg',
    bgColor: '#faf5ff'
  },
  {
    id: 'early',
    title: '新资源提前享',
    desc: '全站每日精选新版本提前7天抢先体验',
    icon: '/images/vip_priv_early.svg',
    bgColor: '#fff1f2'
  }
];

export const MOCK_VIP_FAQS = [
  {
    id: 1,
    q: '购买后多久可以开通生效？',
    a: '付款成功后系统将在 1-3 秒内自动为您绑定当前微信 UID 并下发全站黑卡 SVIP 权限，无需手动输入任何激活码，刷新即享全套特权。'
  },
  {
    id: 2,
    q: '更换手机或跨平台可以使用吗？',
    a: '特权与您的微信账号永久关联绑定，只要在任意设备登录相同的微信账号，即可无缝同步尊贵身份与直链下载特权。'
  },
  {
    id: 3,
    q: '可以开具发票或企业报销吗？',
    a: '支持开具正规增值税电子普通发票（技术咨询服务费 / 信息服务费），支付后在购买记录中填写开票信息即可。'
  },
  {
    id: 4,
    q: '连续包月如何取消自动续费？',
    a: '在微信客户端【我 - 服务 - 钱包 - 支付设置 - 自动续费】中找到「枫的藏宝阁」，随时一键取消签约，取消后本月权益依然有效。'
  }
];

export const MOCK_USER_PROFILE = {
  nickName: 'Geek_Arthur',
  vipBadge: '⚡ SVIP',
  uid: '8932014',
  avatar: '/images/default_avatar.svg',
  privilegeStatus: '极客永久尊享特权 · 独家节点生效中',
  downloadCount: 48,
  favCount: 126,
  ticketCount: 2,
  ticketHasNew: true,
  points: 1280,
  isSvip: true,
  vipPlanName: '永久黑卡',
  vipExpireDate: '终身永久有效'
};
