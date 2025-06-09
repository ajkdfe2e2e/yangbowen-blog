import React, { useState } from 'react'
import { Layout } from '@/components/Layout'

const Admin: React.FC = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('技术')
  const [tags, setTags] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateMarkdown = () => {
    const today = new Date().toISOString().split('T')[0]
    const slug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    const frontMatter = `---
title: ${title}
date: ${today}
category: ${category}
tags: [${tagArray.join(', ')}]
author: 杨博文
excerpt: ${excerpt}
---

# ${title}

${content}`

    return { frontMatter, slug }
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    const { frontMatter, slug } = generateMarkdown()
    
    // 创建下载链接
    const blob = new Blob([frontMatter], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setIsGenerating(false)
  }

  const openGitHubUpload = () => {
    const uploadUrl = 'https://github.com/ajkdfe2e2e/yangbowen-blog/upload/main/posts'
    window.open(uploadUrl, '_blank')
  }

  return (
    <Layout 
      title="文章管理"
      description="创建和管理博客文章"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">📝 文章管理</h1>
          
          <div className="space-y-6">
            {/* 文章标题 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                文章标题 *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入文章标题"
              />
            </div>

            {/* 分类和标签 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  分类
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="技术">技术</option>
                  <option value="生活">生活</option>
                  <option value="思考">思考</option>
                  <option value="分享">分享</option>
                  <option value="教程">教程</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="如：React, TypeScript, 前端"
                />
              </div>
            </div>

            {/* 文章摘要 */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                文章摘要
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="简要描述文章内容，约150字"
              />
            </div>

            {/* 文章内容 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                文章内容 *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="使用 Markdown 格式编写文章内容..."
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGenerate}
                disabled={!title || !content || isGenerating}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? '生成中...' : '📥 生成并下载文章'}
              </button>
              
              <button
                onClick={openGitHubUpload}
                className="flex-1 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                🚀 前往GitHub上传
              </button>
            </div>
          </div>

          {/* 使用说明 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">📖 使用说明</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. 填写文章信息和内容</li>
              <li>2. 点击生成并下载文章按钮</li>
              <li>3. 点击前往GitHub上传按钮</li>
              <li>4. 在GitHub页面上传刚才下载的.md文件</li>
              <li>5. 提交后等待2-3分钟自动部署完成</li>
            </ol>
          </div>

          {/* Markdown语法提示 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">📝 Markdown语法提示</h3>
            <div className="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>• # 标题1、## 标题2、### 标题3</div>
              <div>• **粗体** 和 *斜体*</div>
              <div>• [链接文字](URL)</div>
              <div>• ![图片说明](图片URL)</div>
              <div>• 代码块和行内代码</div>
              <div>• 引用文字</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Admin 