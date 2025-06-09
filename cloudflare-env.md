# Cloudflare Workers 环境变量配置

## 在 Cloudflare Dashboard 中设置以下环境变量：

### 1. 高德天气API
```
AMAP_API_KEY = 31280bbb46f491bd85df213f90d01f31
```

### 2. MiniMax AI Token
```
MINIMAX_TOKEN = eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJtaW5pbWF4IiwiZXhwIjoxNzY1NDEzMjE5LCJpYXQiOjE3MzM4NzMyMTksImlzcyI6Im1pbmltYXgiLCJuYmYiOjE3MzM4NzMyMTksInN1YiI6IjIwMTUwMzQ4OTcwMDM2NDM3MjAifQ.UjRgJoiWFNbMNZaBLCqKC9E7hnEcmqNJT8VkY7DGEL2wYs0fKIqmTnDVhjcXnH1gqoWA4aZE9L7wbJhQQhzqt5ZpvQ9LrQ6JEF0dOOhDWlQI7-P5X3k8OkT0AKKLVpKy4tnBAoG3A2PF1RR4IgHwdvTMOsz3JN7jO7mCwW21v-Zp5k9Nt9dR0xQq3K4tJ6a8e4gG5lTN4p2oEg8z_GFXNrKNkGXhZHvLjMpbJBvjQy1PgMCqIbUX7g2w8W0xOV-CjqxJ3Roa7W2vVhC3GYKMyL9J1VtgOD3yXHf2Pz6Eo7UMNVH4zS5jKE_Qz8I3rlRhPaFbTjH1Wp
```

## 设置步骤：

1. 进入 Cloudflare Dashboard
2. 选择您的 Workers 项目
3. 转到 "Settings" > "Environment variables"
4. 添加上述变量
5. 重新部署项目

## 验证 API 功能：

部署完成后，测试以下端点：

### 天气API
```
GET https://your-worker.workers.dev/api/weather?city=北京
```

### 图片生成API
```
POST https://your-worker.workers.dev/api/generate-image
Content-Type: application/json

{
  "prompt": "一只可爱的小猫",
  "aspectRatio": "1:1"
}
```

### 文章管理API
```
GET https://your-worker.workers.dev/api/posts
```