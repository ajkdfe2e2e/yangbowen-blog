# Cloudflare Worker 适配层

这是将 Next.js 博客项目适配为 Cloudflare Worker 的适配层。

## 🏗️ 架构说明

### 文件结构
```
src/
├── index.js          # Worker主入口文件
├── handlers/
│   ├── posts.js      # 文章API处理器
│   ├── weather.js    # 天气API处理器
│   └── static.js     # 静态资源处理器
└── README.md         # 说明文档
```

### 主要功能

1. **API适配**: 将Next.js的API路由适配为Worker格式
2. **静态页面**: 提供简化的HTML页面
3. **CORS支持**: 自动处理跨域请求
4. **环境变量**: 支持Cloudflare环境变量配置

## 🚀 快速部署

### 方法1: GitHub Actions自动部署

1. **配置Secrets**:
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API令牌
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare账户ID

2. **推送代码**: 
   ```bash
   git push origin main
   ```

3. **自动部署**: GitHub Actions会自动部署到Cloudflare Workers

### 方法2: 本地部署

```bash
# 安装依赖
npm install

# 本地开发
npm run worker:dev

# 部署到生产环境
npm run worker:deploy
```

## 🌐 API 接口

### 文章API
- `GET /api/posts` - 获取所有文章
- `GET /api/posts?slug=文章标识` - 获取单篇文章
- `POST /api/posts` - 创建文章
- `PUT /api/posts?slug=文章标识` - 更新文章
- `DELETE /api/posts?slug=文章标识` - 删除文章

### 天气API
- `GET /api/weather?city=城市名` - 获取指定城市天气

## 📄 页面路由
- `/` - 首页
- `/posts` - 文章列表
- `/create` - 创建文章
- `/admin` - 管理界面
- `/posts/[slug]` - 文章详情

## ⚡ 技术特点

1. **零冷启动**: Cloudflare Worker 无服务器架构
2. **全球CDN**: 自动全球分发，访问速度快
3. **高性能**: 边缘计算，响应时间 < 50ms
4. **成本低廉**: 每天10万次请求免费
5. **自动扩缩**: 无需担心流量峰值

## 🔧 环境变量配置

在 Cloudflare Dashboard 中设置以下环境变量：

```
AMAP_API_KEY = 你的高德地图API密钥
MINIMAX_TOKEN = 你的MiniMax_AI_Token
```

## 📊 监控和日志

- **实时日志**: Cloudflare Dashboard → Workers → 项目 → Logs
- **性能监控**: 内置性能分析和错误追踪
- **使用统计**: 请求量、错误率、响应时间等

## 🔍 故障排除

### 常见问题

1. **部署失败**:
   - 检查API Token权限
   - 确认Account ID正确
   - 查看GitHub Actions日志

2. **API错误**:
   - 检查环境变量配置
   - 查看Worker实时日志
   - 确认外部API可访问性

3. **页面无法访问**:
   - 确认域名配置
   - 检查Worker状态
   - 查看CDN缓存设置

## 🔄 数据持久化

当前使用内存存储，Worker重启会丢失数据。

**生产环境建议**:
- 使用 Cloudflare KV 存储
- 连接外部数据库
- 启用数据备份策略

## 📈 性能优化

1. **缓存策略**: 静态资源CDN缓存
2. **压缩优化**: 自动Gzip压缩
3. **代码分割**: 按需加载资源
4. **图片优化**: WebP格式支持

## 🌟 功能扩展

- [ ] 用户认证系统
- [ ] 评论功能
- [ ] 搜索引擎优化
- [ ] 多语言支持
- [ ] 主题切换
- [ ] 订阅推送

## 📞 技术支持

如遇到问题，请：
1. 查看 [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
2. 检查项目 Issues
3. 联系开发者: yangbowen@email.com