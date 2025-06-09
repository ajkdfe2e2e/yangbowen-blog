// Cloudflare Worker 适配层
// 将 Next.js 项目适配为 Worker 格式

import { handlePosts } from './handlers/posts'
import { handleWeather } from './handlers/weather'
import { handleStatic } from './handlers/static'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const path = url.pathname

    // 设置 CORS 头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      })
    }

    try {
      // API 路由处理
      if (path.startsWith('/api/')) {
        let response

        if (path.startsWith('/api/posts')) {
          response = await handlePosts(request, env)
        } else if (path.startsWith('/api/weather')) {
          response = await handleWeather(request, env)
        } else {
          response = new Response(JSON.stringify({ 
            success: false, 
            error: 'API not found' 
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          })
        }

        // 添加 CORS 头到响应
        const headers = new Headers(response.headers)
        Object.entries(corsHeaders).forEach(([key, value]) => {
          headers.set(key, value)
        })

        return new Response(response.body, {
          status: response.status,
          headers
        })
      }

      // 静态资源和页面处理
      return await handleStatic(request, env)

    } catch (error) {
      console.error('Worker error:', error)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }
  }
}