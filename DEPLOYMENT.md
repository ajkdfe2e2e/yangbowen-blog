# 部署指南

## 概述

杨博文的智能博客支持两种部署模式：

1. **静态部署** - GitHub Pages (仅前端功能)
2. **全功能部署** - Vercel/Netlify (包含API功能)

## 🚀 推荐部署方案：Vercel (全功能)

### 优势
- ✅ 支持API路由
- ✅ 高德天气API
- ✅ MiniMax AI图片生成
- ✅ 文章管理API
- ✅ 自动部署

### 部署步骤

1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "添加API功能"
   git push origin main
   ```

2. **连接Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用GitHub账号登录
   - 导入你的博客仓库
   - 点击 Deploy

3. **配置环境变量** (可选，已在代码中配置)
   ```
   AMAP_API_KEY=31280bbb46f491bd85df213f90d01f31
   MINIMAX_TOKEN=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 📄 GitHub Pages 部署 (静态版本)

如果您只需要静态功能，可以继续使用GitHub Pages：

### 修改配置
在 `next.config.js` 中：
```javascript
const nextConfig = {
  output: 'export',  // 启用静态导出
  // 注释掉API相关配置
}
```

### 功能限制
- ❌ 无法使用API路由
- ❌ 天气功能受限
- ❌ AI图片生成不可用
- ✅ 文章管理仍可用（手动上传）

## 🔧 API功能说明

### 1. 天气API (`/api/weather`)
- **接口**: `GET /api/weather?city=城市名`
- **功能**: 获取实时天气信息
- **数据源**: 高德地图API

### 2. 图片生成API (`/api/generate-image`)
- **接口**: `POST /api/generate-image`
- **功能**: AI文生图
- **数据源**: MiniMax AI

### 3. 文章管理API (`/api/posts`)
- **接口**: 
  - `GET /api/posts` - 获取所有文章
  - `GET /api/posts?slug=文章ID` - 获取单篇文章
  - `POST /api/posts` - 创建文章
  - `PUT /api/posts?slug=文章ID` - 更新文章
  - `DELETE /api/posts?slug=文章ID` - 删除文章

## 📱 使用指南

### 文章管理
1. 访问 `/admin` 页面
2. 填写文章信息
3. 点击"📥 生成并下载文章"
4. 使用API或手动上传到GitHub

### AI配图
1. 在创建文章页面或组件中
2. 输入图片描述
3. 选择图片比例
4. 点击"✨ 生成图片"

### 天气组件
- 自动显示默认城市天气
- 可搜索其他城市
- 实时更新天气信息

## 🔐 安全说明

API密钥已集成在代码中，适合个人使用。如需生产环境部署，建议：

1. 将API密钥移至环境变量
2. 添加API访问限制
3. 启用HTTPS
4. 设置CORS策略

## ❓ 常见问题

**Q: 为什么GitHub Pages不支持API？**
A: GitHub Pages只支持静态文件，不支持服务器端功能。需要使用Vercel等平台。

**Q: API调用失败怎么办？**
A: 检查网络连接和API密钥是否正确。可查看浏览器控制台错误信息。

**Q: 如何自定义API密钥？**
A: 在Vercel中设置环境变量，或修改 `next.config.js` 中的配置。

## 📞 技术支持

如遇到部署问题，请：
1. 检查控制台错误信息
2. 确认API密钥有效性
3. 验证网络连接
4. 查看Next.js官方文档