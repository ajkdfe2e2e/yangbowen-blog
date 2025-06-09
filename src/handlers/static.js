// 静态资源和页面处理器 - Worker适配版本

// 简化的HTML页面模板
const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>杨博文的个人博客 - 智能AI配图</title>
    <meta name="description" content="杨博文的个人博客，集成AI文生图功能，记录生活、技术和思考">
    <meta name="author" content="杨博文">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; 
            color: #333; 
            background: #f5f5f5;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header { 
            background: #fff; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .header-content { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 1rem 0; 
        }
        .logo { font-size: 1.5rem; font-weight: bold; color: #2563eb; }
        nav ul { display: flex; list-style: none; gap: 2rem; }
        nav a { text-decoration: none; color: #666; font-weight: 500; }
        nav a:hover { color: #2563eb; }
        main { padding: 2rem 0; }
        .hero { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 4rem 0;
            margin-bottom: 3rem;
            border-radius: 10px;
        }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.25rem; opacity: 0.9; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .card { 
            background: white; 
            padding: 2rem; 
            border-radius: 10px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .card:hover { transform: translateY(-5px); }
        .card h3 { color: #2563eb; margin-bottom: 1rem; }
        .btn { 
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 1rem;
            transition: background 0.2s;
        }
        .btn:hover { background: #1d4ed8; }
        .weather-widget {
            background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 10px;
            margin: 2rem 0;
        }
        footer { 
            background: #1f2937; 
            color: white; 
            text-align: center; 
            padding: 2rem 0; 
            margin-top: 4rem;
        }
        @media (max-width: 768px) {
            .hero h1 { font-size: 2rem; }
            .header-content { flex-direction: column; gap: 1rem; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo">杨博文的博客</div>
                <nav>
                    <ul>
                        <li><a href="/">首页</a></li>
                        <li><a href="/posts">文章</a></li>
                        <li><a href="/create">写文章</a></li>
                        <li><a href="/admin">管理</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <main>
        <div class="container">
            <div class="hero">
                <h1>欢迎来到我的智能博客</h1>
                <p>集成AI文生图功能，记录生活、技术和思考</p>
            </div>

            <div class="weather-widget" id="weather">
                <h3>🌤️ 实时天气</h3>
                <p>正在加载天气信息...</p>
            </div>

            <div class="grid">
                <div class="card">
                    <h3>📝 智能写作</h3>
                    <p>支持Markdown格式写作，让创作更加专业和高效。</p>
                    <a href="/create" class="btn">开始写作</a>
                </div>
                
                <div class="card">
                    <h3>🤖 AI配图</h3>
                    <p>集成AI文生图功能，为你的文章自动生成精美配图。</p>
                    <a href="/create" class="btn">体验AI配图</a>
                </div>
                
                <div class="card">
                    <h3>🌤️ 天气集成</h3>
                    <p>实时显示天气信息，让阅读体验更有温度。</p>
                    <a href="/api/weather" class="btn">查看API</a>
                </div>
            </div>

            <div id="posts" style="margin-top: 3rem;">
                <h2 style="margin-bottom: 2rem; color: #2563eb;">📚 最新文章</h2>
                <div id="posts-list">
                    <p>正在加载文章...</p>
                </div>
            </div>
        </div>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 杨博文的个人博客. All rights reserved.</p>
            <p>由 Cloudflare Workers 强力驱动</p>
        </div>
    </footer>

    <script>
        async function loadWeather() {
            try {
                const response = await fetch('/api/weather?city=北京');
                const data = await response.json();
                
                if (data.success) {
                    const weather = data.data;
                    document.getElementById('weather').innerHTML = \`
                        <h3>🌤️ \${weather.city} 实时天气</h3>
                        <p>\${weather.weather} \${weather.temperature}°C</p>
                        <p>湿度: \${weather.humidity}% | 风向: \${weather.windDirection}</p>
                    \`;
                }
            } catch (error) {
                console.error('天气加载失败:', error);
            }
        }

        async function loadPosts() {
            try {
                const response = await fetch('/api/posts');
                const data = await response.json();
                
                if (data.success) {
                    const posts = data.data;
                    const postsHtml = posts.map(post => \`
                        <div class="card">
                            <h3>\${post.title}</h3>
                            <p style="color: #666; margin-bottom: 0.5rem;">
                                \${post.date} | \${post.category}
                            </p>
                            <p>\${post.excerpt}</p>
                            <a href="/posts/\${post.slug}" class="btn">阅读全文</a>
                        </div>
                    \`).join('');
                    
                    document.getElementById('posts-list').innerHTML = \`<div class="grid">\${postsHtml}</div>\`;
                }
            } catch (error) {
                console.error('文章加载失败:', error);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            loadWeather();
            loadPosts();
        });
    </script>
</body>
</html>`;

export async function handleStatic(request, env) {
  const url = new URL(request.url)
  const path = url.pathname

  // 根据路径返回相应内容
  if (path === '/' || path.startsWith('/posts') || path.startsWith('/create') || path.startsWith('/admin')) {
    return new Response(HTML_TEMPLATE, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    })
  }

  if (path === '/favicon.ico') {
    return new Response('', { status: 204 })
  }

  // 404页面
  const notFoundHtml = `<!DOCTYPE html>
<html><head><title>404</title></head><body style="text-align:center;padding:50px;">
<h1>404 - 页面未找到</h1><a href="/">返回首页</a></body></html>`
  
  return new Response(notFoundHtml, {
    status: 404,
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  })
}