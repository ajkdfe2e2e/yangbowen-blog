# 杨博文的个人博客

🎨 一个现代化的个人博客，集成AI配图和实时天气功能

## ✨ 特色功能

### 🌤️ 实时天气
- 集成高德天气API（客户端直连）
- 支持城市搜索切换
- 美观的天气卡片设计
- 温度颜色智能映射
- 网络故障时自动回退到模拟数据

### 🎨 AI智能配图
- 基于关键词的智能图片搜索
- 集成Unsplash高质量图片库
- 支持自定义提示词
- 快速图片生成和预览

### 📝 强大的编辑器
- Markdown语法支持
- 实时预览功能
- 文章分类和标签
- 智能摘要生成

### 🎯 现代化设计
- 响应式布局设计
- 美观的渐变色彩
- 流畅的动画效果
- 优秀的用户体验

## 🚀 技术栈

- **前端框架**: Next.js 14 + React 18 + TypeScript
- **样式方案**: CSS-in-JS (styled-jsx)
- **内容管理**: Markdown + Gray Matter
- **图片服务**: Unsplash API + Lorem Picsum
- **天气API**: 高德开放平台（客户端直连）
- **部署平台**: GitHub Pages (静态导出)

## 📦 快速开始

### 安装依赖
```bash
npm install
```

### 本地开发
```bash
npm run dev
```

### 构建和导出
```bash
npm run build
```

## 🔧 配置说明

### 静态部署优化
本项目已优化为完全静态部署，所有功能都在客户端运行：

1. **天气功能**: 直接调用高德天气API，包含故障回退机制
2. **图片生成**: 使用Unsplash图片搜索API，基于关键词匹配
3. **部署方式**: 完全静态，支持任何静态托管平台

### GitHub Pages 部署

1. Fork这个仓库
2. 在仓库设置中启用GitHub Pages
3. 选择`gh-pages`分支作为发布源
4. 推送代码到`main`分支自动触发部署

**自定义域名**: https://fddfffff.site

## 📁 项目结构

```
├── components/          # React组件
│   ├── Layout.tsx      # 页面布局
│   ├── Header.tsx      # 网站头部
│   ├── Footer.tsx      # 网站底部
│   ├── WeatherWidget.tsx # 天气组件（客户端）
│   └── McpImageGenerator.tsx # 图片搜索组件
├── pages/              # Next.js页面
│   ├── index.tsx      # 首页
│   └── create.tsx     # 文章创建
├── posts/             # Markdown文章
├── lib/               # 工具库
├── styles/            # 样式文件
└── public/            # 静态资源
```

## 🎯 核心功能

### 天气组件
- 客户端直接调用高德天气API
- 支持城市搜索和切换
- 美观的UI设计和动画效果
- 完善的错误处理和回退机制

### 智能配图功能
- 基于提示词提取关键词
- 使用Unsplash搜索相关图片
- 支持多重备选方案
- 快速加载和预览

### 文章管理
- Markdown格式支持
- 文章分类和标签
- 自动生成摘要
- 阅读时间估算

## 🌟 特色亮点

1. **完全静态部署** - 无需服务器，支持所有静态托管平台
2. **智能图片搜索** - 基于关键词自动匹配高质量图片
3. **实用的天气功能** - 客户端直连API，响应快速
4. **现代化设计** - 响应式布局，美观的视觉效果
5. **开源友好** - 代码结构清晰，易于二次开发

## 📈 部署状态

- ✅ 完全静态导出
- ✅ 自动部署到GitHub Pages
- ✅ 支持自定义域名
- ✅ HTTPS安全访问
- ✅ CDN加速优化

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork这个仓库
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交Pull Request

## 📄 开源协议

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👨‍💻 作者

**杨博文**
- 博客: [yangbowen-blog.github.io](https://yangbowen.github.io)
- Email: yangbowen@example.com

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！