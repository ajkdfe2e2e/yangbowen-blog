import React from 'react'
import Head from 'next/head'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export const Layout: React.FC<LayoutProps> = ({ children, title, description }) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} - 杨博文的博客` : '杨博文的博客'}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <div className="layout">
        <Header />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      
      <style jsx>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .main-content {
          flex: 1;
        }
      `}</style>
      </div>
    </>
  )
}