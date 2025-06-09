import React, { useState } from 'react'
import Head from 'next/head'
import { Layout } from '../components/Layout'
import { McpImageGenerator } from '../components/McpImageGenerator'
import { marked } from 'marked'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleImageGenerated = (imageUrl: string) => {
    setCoverImage(imageUrl)
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容')
      return
    }

    setIsSaving(true)
    try {
      // 生成文章的markdown文件内容
      const frontMatter = [
        '---',
        `title: "${title}"`,
        `date: "${new Date().toISOString()}"`,
        `excerpt: "${excerpt || content.substring(0, 200) + '...'}"`,
        coverImage ? `coverImage: "${coverImage}"` : '',
        category ? `category: "${category}"` : '',
        tags ? `tags: [${tags.split(',').map(tag => `"${tag.trim()}"`).join(', ')}]` : '',
        `author: "杨博文"`,
        '---',
        '',
        content
      ].filter(Boolean).join('\n')

      // 生成文件名
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50)

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

      alert('文章已下载！请将下载的 .md 文件放入 posts/ 目录中，然后重新构建网站。')
      
    } catch (error) {
      console.error('下载文章失败:', error)
      alert('下载失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const getPreviewHtml = () => {
    return marked(content)
  }

  return (
    <Layout>
      <Head>
        <title>写文章 - 杨博文的博客</title>
        <meta name="description" content="创建新的博客文章，支持AI配图" />
      </Head>

      <div className="create-post">
        <div className="container">
          <h1 className="page-title">创作新文章</h1>
          
          {/* AI配图生成器 */}
          <McpImageGenerator onImageGenerated={handleImageGenerated} />
          
          <div className="editor-container">
            <div className="editor-header">
              <button 
                className={`tab ${!isPreview ? 'active' : ''}`}
                onClick={() => setIsPreview(false)}
              >
                编辑
              </button>
              <button 
                className={`tab ${isPreview ? 'active' : ''}`}
                onClick={() => setIsPreview(true)}
              >
                预览
              </button>
            </div>
            
            <div className="editor-content">
              {!isPreview ? (
                <div className="edit-mode">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="title">文章标题 *</label>
                      <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="输入文章标题..."
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="category">分类</label>
                      <input
                        id="category"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="例如：技术、生活、思考..."
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="tags">标签</label>
                      <input
                        id="tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="用逗号分隔，例如：React, Next.js, 前端"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="excerpt">文章摘要</label>
                    <textarea
                      id="excerpt"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="输入文章摘要，留空将自动截取内容前200字..."
                      rows={3}
                    />
                  </div>
                  
                  {coverImage && (
                    <div className="cover-preview">
                      <label>封面图片预览：</label>
                      <img src={coverImage} alt="封面图片" className="cover-image" />
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="content">文章内容 * (支持Markdown)</label>
                    <textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="在这里输入文章内容，支持Markdown语法..."
                      rows={20}
                    />
                  </div>
                </div>
              ) : (
                <div className="preview-mode">
                  <div className="preview-header">
                    <h1>{title || '文章标题'}</h1>
                    <div className="preview-meta">
                      <span>作者：杨博文</span>
                      <span>分类：{category || '未分类'}</span>
                      <span>发布时间：{new Date().toLocaleDateString('zh-CN')}</span>
                    </div>
                    {coverImage && (
                      <img src={coverImage} alt="封面图片" className="preview-cover" />
                    )}
                  </div>
                  <div 
                    className="preview-content"
                    dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                  />
                </div>
              )}
            </div>
            
            <div className="editor-footer">
              <button 
                onClick={handleSave}
                disabled={isSaving || !title.trim() || !content.trim()}
                className="save-btn"
              >
                {isSaving ? '下载中...' : '下载文章'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .create-post {
          padding: 2rem 0;
          background: #f9fafb;
          min-height: calc(100vh - 160px);
        }
        
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .page-title {
          text-align: center;
          color: var(--text-color);
          margin-bottom: 2rem;
          font-size: 2.5rem;
        }
        
        .editor-container {
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .editor-header {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .tab {
          flex: 1;
          padding: 1rem 2rem;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          color: var(--text-light);
        }
        
        .tab.active {
          background: var(--primary-color);
          color: white;
        }
        
        .editor-content {
          padding: 2rem;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--text-color);
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          font-family: inherit;
          transition: border-color 0.3s;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .cover-preview {
          margin-bottom: 1.5rem;
        }
        
        .cover-image {
          width: 100%;
          max-width: 400px;
          height: auto;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          margin-top: 0.5rem;
        }
        
        .preview-mode {
          max-height: 600px;
          overflow-y: auto;
        }
        
        .preview-header h1 {
          color: var(--text-color);
          margin-bottom: 1rem;
        }
        
        .preview-meta {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          color: var(--text-light);
          font-size: 0.9rem;
        }
        
        .preview-cover {
          width: 100%;
          max-width: 600px;
          height: auto;
          border-radius: 10px;
          margin-bottom: 2rem;
        }
        
        .preview-content {
          line-height: 1.8;
          color: var(--text-color);
        }
        
        .preview-content h1,
        .preview-content h2,
        .preview-content h3 {
          color: var(--text-color);
          margin: 2rem 0 1rem;
        }
        
        .preview-content p {
          margin-bottom: 1rem;
        }
        
        .preview-content code {
          background: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }
        
        .preview-content pre {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
        }
        
        .editor-footer {
          padding: 1.5rem 2rem;
          border-top: 1px solid #e5e7eb;
          text-align: right;
        }
        
        .save-btn {
          background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1rem;
        }
        
        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .preview-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </Layout>
  )
} 