import React, { useState } from 'react'
import Link from 'next/link'

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="container">
        <div className="nav-brand">
          <Link href="/">
            <span className="logo">杨博文的博客</span>
          </Link>
        </div>
        
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link href="/" className="nav-link">
            首页
          </Link>
          <Link href="/posts" className="nav-link">
            文章
          </Link>
          <Link href="/create" className="nav-link">
            写文章
          </Link>
          <Link href="/gallery" className="nav-link">
            AI配图
          </Link>
          <Link href="/about" className="nav-link">
            关于我
          </Link>
        </nav>
        
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="切换菜单"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <style jsx>{`
        .header {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 80px;
        }
        
        .logo {
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
          cursor: pointer;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .nav {
          display: flex;
          gap: 2rem;
        }
        
        .nav-link {
          color: white;
          font-weight: 500;
          transition: all 0.3s;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          position: relative;
        }
        
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .menu-toggle {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }
        
        .menu-toggle span {
          width: 25px;
          height: 3px;
          background: white;
          margin: 3px 0;
          transition: 0.3s;
          border-radius: 2px;
        }
        
        @media (max-width: 768px) {
          .nav {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            flex-direction: column;
            padding: 1rem 2rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
          }
          
          .nav-open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }
          
          .menu-toggle {
            display: flex;
          }
          
          .nav-link {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0;
          }
          
          .nav-link:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </header>
  )
}