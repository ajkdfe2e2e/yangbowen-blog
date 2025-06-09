import React from 'react'
import Link from 'next/link'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>杨博文的博客</h3>
            <p>记录生活、分享技术、用AI创造美好</p>
            <div className="social-links">
              <a href="#" aria-label="GitHub">GitHub</a>
              <a href="#" aria-label="微博">微博</a>
              <a href="#" aria-label="邮箱">邮箱</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>快速导航</h4>
            <Link href="/">首页</Link>
            <Link href="/posts">文章</Link>
            <Link href="/create">写文章</Link>
            <Link href="/gallery">AI配图</Link>
          </div>
          
          <div className="footer-section">
            <h4>特色功能</h4>
            <p>✨ AI智能配图</p>
            <p>📝 Markdown编辑</p>
            <p>🎨 美观界面</p>
            <p>📱 响应式设计</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} 杨博文. 个人博客 | 集成AI配图功能</p>
          <p>Powered by Next.js & MCP Technology</p>
        </div>
      </div>
      
      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          color: white;
          padding: 3rem 0 1rem;
          margin-top: auto;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .footer-section h3 {
          color: var(--accent-color);
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        
        .footer-section h4 {
          color: #e5e7eb;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }
        
        .footer-section p {
          color: #d1d5db;
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        
        .footer-section a {
          color: #d1d5db;
          display: block;
          margin-bottom: 0.5rem;
          transition: color 0.3s;
        }
        
        .footer-section a:hover {
          color: var(--accent-color);
        }
        
        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .social-links a {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          transition: all 0.3s;
        }
        
        .social-links a:hover {
          background: var(--accent-color);
          transform: translateY(-2px);
        }
        
        .footer-bottom {
          border-top: 1px solid #374151;
          padding-top: 1rem;
          text-align: center;
          color: #9ca3af;
        }
        
        .footer-bottom p {
          margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .social-links {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  )
}