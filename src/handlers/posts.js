// 文章API处理器 - Worker适配版本

const POSTS_DATA = [
  {
    slug: 'welcome',
    title: '欢迎来到我的博客',
    date: '2024-01-01',
    category: '生活',
    tags: ['欢迎', '开始'],
    author: '杨博文',
    excerpt: '这是我的第一篇博客文章，欢迎大家的到来！',
    content: `# 欢迎来到我的博客

这是我的第一篇博客文章，欢迎大家的到来！

## 关于这个博客

这个博客将记录我的生活、技术学习和思考。

### 功能特点

- 📝 支持Markdown写作
- 🤖 集成AI文生图功能  
- 🌤️ 实时天气显示
- 📱 响应式设计

希望你们喜欢这个博客！`
  },
  {
    slug: 'weather-integration',
    title: '博客集成天气功能',
    date: '2024-01-02',
    category: '技术',
    tags: ['天气', 'API', '功能'],
    author: '杨博文',
    excerpt: '为博客添加了实时天气显示功能，让阅读更有温度。',
    content: `# 博客集成天气功能

今天为博客添加了实时天气显示功能！

## 技术实现

使用了高德地图的天气API：

\`\`\`javascript
const weatherUrl = \`https://restapi.amap.com/v3/weather/weatherInfo?city=\${adcode}&key=\${API_KEY}\`
\`\`\`

## 功能特点

- 🌤️ 实时天气数据
- 🏙️ 支持城市切换
- 📊 详细天气信息
- 🎨 美观的UI界面

让博客阅读更有温度！`
  }
]

export async function handlePosts(request, env) {
  const url = new URL(request.url)
  const method = request.method
  const slug = url.searchParams.get('slug') || url.pathname.split('/').pop()

  try {
    switch (method) {
      case 'GET':
        return await handleGetPosts(slug)
      case 'POST':
        return await handleCreatePost(request, env)
      case 'PUT':
        return await handleUpdatePost(request, env, slug)
      case 'DELETE':
        return await handleDeletePost(slug, env)
      default:
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Method not allowed' 
        }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Posts handler error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: '处理文章请求时发生错误' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function handleGetPosts(slug) {
  if (slug && slug !== 'posts') {
    // 获取单个文章
    const post = POSTS_DATA.find(p => p.slug === slug)
    
    if (!post) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '文章不存在' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: post 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } else {
    // 获取所有文章列表
    const posts = POSTS_DATA.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return new Response(JSON.stringify({ 
      success: true, 
      data: posts 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function handleCreatePost(request, env) {
  try {
    const body = await request.json()
    const { title, category, tags, excerpt, content, slug } = body

    if (!title || !content) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '标题和内容不能为空' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const postSlug = slug || title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // 检查是否已存在
    if (POSTS_DATA.find(p => p.slug === postSlug)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '文章已存在，请使用不同的标题' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const newPost = {
      slug: postSlug,
      title,
      date: new Date().toISOString().split('T')[0],
      category: category || '默认',
      tags: tags || [],
      author: '杨博文',
      excerpt: excerpt || '',
      content
    }

    POSTS_DATA.push(newPost)

    // 在实际部署中，这里应该使用KV存储持久化数据
    // await env.POSTS_CACHE.put(postSlug, JSON.stringify(newPost))

    return new Response(JSON.stringify({ 
      success: true, 
      data: newPost 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: '创建文章时发生错误' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function handleUpdatePost(request, env, slug) {
  try {
    const body = await request.json()
    const { title, category, tags, excerpt, content } = body

    const postIndex = POSTS_DATA.findIndex(p => p.slug === slug)
    
    if (postIndex === -1) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '文章不存在' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const existingPost = POSTS_DATA[postIndex]
    const updatedPost = {
      ...existingPost,
      title: title || existingPost.title,
      category: category || existingPost.category,
      tags: tags || existingPost.tags,
      excerpt: excerpt || existingPost.excerpt,
      content: content || existingPost.content
    }

    POSTS_DATA[postIndex] = updatedPost

    // 在实际部署中，这里应该使用KV存储持久化数据
    // await env.POSTS_CACHE.put(slug, JSON.stringify(updatedPost))

    return new Response(JSON.stringify({ 
      success: true, 
      data: updatedPost 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: '更新文章时发生错误' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function handleDeletePost(slug, env) {
  const postIndex = POSTS_DATA.findIndex(p => p.slug === slug)
  
  if (postIndex === -1) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: '文章不存在' 
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  POSTS_DATA.splice(postIndex, 1)

  // 在实际部署中，这里应该使用KV存储删除数据
  // await env.POSTS_CACHE.delete(slug)

  return new Response(JSON.stringify({ 
    success: true, 
    message: '文章删除成功' 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}