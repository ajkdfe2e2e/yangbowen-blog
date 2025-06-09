/** @type {import('next').NextConfig} */
const nextConfig = {
  // 为了支持API路由，我们需要使用Node.js运行时
  // 如果部署到GitHub Pages等静态主机，需要改为Vercel等支持Node.js的平台
  
  // 临时禁用静态导出以支持API
  // output: 'export',
  
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // 环境变量配置
  env: {
    AMAP_API_KEY: '31280bbb46f491bd85df213f90d01f31',
    MINIMAX_TOKEN: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiLmnajljZrmlociLCJVc2VyTmFtZSI6IuadqOWNmuaWhyIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTIyMjE4MTk5MjY5NTExNjM0IiwiUGhvbmUiOiIxOTIzMzgxNzg1NCIsIkdyb3VwSUQiOiIxOTIyMjE4MTk5MjY1MzE3MzMwIiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiIiwiQ3JlYXRlVGltZSI6IjIwMjUtMDYtMDkgMTE6MjY6MzciLCJUb2tlblR5cGUiOjEsImlzcyI6Im1pbmltYXgifQ.LgLhhOff8zk8NqpwglUQuxI7XmhqKUMEqt83lS8snE17WUMi68_JARBhMRAJ3Uhi0Brp2_d6UC3_e8O2t5rMG6KR7pZh0oYcPDAQpfcH4c0W3BeibSDM8YKSBi7y_i4V5oNAnyZ4kTwgQXEm-Ojzco5UBAHSiPQcozifnM_G45ODAqf2H8QCMMeEqeJkecEvjA2Q9KxORgCHQNgV4_kqLUaR8CPrgyrckv4K2rY5PmnUZTtHNdmXxQ2WkKDvq4DjNEyvLqDDaQEE_6QKu75C6tlWbyqzJ-Pr7ucbaawFu5UN9bUUCBSfX1osKxEymqTHOwbdnO-jeOOSv5nsHHjq8g'
  },
  
  // 确保外部链接正常工作
  experimental: {
    optimizePackageImports: ['react', 'react-dom']
  }
}

module.exports = nextConfig