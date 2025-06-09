import React from 'react'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { Layout } from '@/components/Layout'
import { getAllPosts, Post } from '@/lib/posts'

interface HomeProps {
  posts: Post[]
}

interface PostCardProps {
  post: Post
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <time className="text-sm text-gray-500" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          {post.category && (
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
              {post.category}
            </span>
          )}
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
          <Link href={`/posts/${post.slug}`}>
            {post.title}
          </Link>
        </h2>
        
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {post.tags && post.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <Link 
            href={`/posts/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            阅读全文 →
          </Link>
        </div>
      </div>
    </article>
  )
}

const Home: React.FC<HomeProps> = ({ posts }) => {
  return (
    <Layout 
      title="首页"
      description="杨博文的个人博客，分享技术、生活与思考"
    >
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            欢迎来到我的博客
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            这里分享我在技术、生活中的所得与所思
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/about"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🙋‍♂️ 了解我
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              📧 联系我
            </Link>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">最新文章</h2>
          <span className="text-gray-500">共 {posts.length} 篇文章</span>
        </div>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无文章</h3>
            <p className="text-gray-500">敬请期待更多精彩内容！</p>
          </div>
        )}
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const posts = getAllPosts()
  
  return {
    props: {
      posts
    }
  }
}

export default Home