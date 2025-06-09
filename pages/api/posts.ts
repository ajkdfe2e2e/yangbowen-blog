import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface Post {
  slug: string
  title: string
  date: string
  category: string
  tags: string[]
  author: string
  excerpt: string
  content: string
}

interface ApiResponse {
  success: boolean
  data?: Post | Post[]
  error?: string
}

const postsDirectory = path.join(process.cwd(), 'posts')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res)
    case 'POST':
      return handlePost(req, res)
    case 'PUT':
      return handlePut(req, res)
    case 'DELETE':
      return handleDelete(req, res)
    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' })
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { slug } = req.query

    if (slug) {
      // 获取单个文章
      const filePath = path.join(postsDirectory, `${slug}.md`)
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, error: '文章不存在' })
      }

      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      const post: Post = {
        slug: slug as string,
        title: data.title,
        date: data.date,
        category: data.category,
        tags: data.tags || [],
        author: data.author,
        excerpt: data.excerpt,
        content
      }

      return res.status(200).json({ success: true, data: post })
    } else {
      // 获取所有文章列表
      if (!fs.existsSync(postsDirectory)) {
        return res.status(200).json({ success: true, data: [] })
      }

      const filenames = fs.readdirSync(postsDirectory)
      const posts: Post[] = []

      for (const filename of filenames) {
        if (filename.endsWith('.md')) {
          const filePath = path.join(postsDirectory, filename)
          const fileContents = fs.readFileSync(filePath, 'utf8')
          const { data, content } = matter(fileContents)

          posts.push({
            slug: filename.replace(/\.md$/, ''),
            title: data.title,
            date: data.date,
            category: data.category,
            tags: data.tags || [],
            author: data.author,
            excerpt: data.excerpt,
            content
          })
        }
      }

      // 按日期倒序排列
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      return res.status(200).json({ success: true, data: posts })
    }
  } catch (error) {
    console.error('Get posts error:', error)
    return res.status(500).json({ success: false, error: '获取文章时发生错误' })
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { title, category, tags, excerpt, content, slug } = req.body

    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        error: '标题和内容不能为空' 
      })
    }

    // 确保 posts目录存在
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
    }

    const postSlug = slug || title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const today = new Date().toISOString().split('T')[0]
    
    const frontMatter = `---
title: ${title}
date: ${today}
category: ${category || '默认'}
tags: [${(tags || []).join(', ')}]
author: 杨博文
excerpt: ${excerpt || ''}
---

${content}`

    const filePath = path.join(postsDirectory, `${postSlug}.md`)
    
    if (fs.existsSync(filePath)) {
      return res.status(409).json({ 
        success: false, 
        error: '文章已存在，请使用不同的标题' 
      })
    }

    fs.writeFileSync(filePath, frontMatter, 'utf8')

    const newPost: Post = {
      slug: postSlug,
      title,
      date: today,
      category: category || '默认',
      tags: tags || [],
      author: '杨博文',
      excerpt: excerpt || '',
      content
    }

    return res.status(201).json({ success: true, data: newPost })
  } catch (error) {
    console.error('Create post error:', error)
    return res.status(500).json({ success: false, error: '创建文章时发生错误' })
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { slug } = req.query
    const { title, category, tags, excerpt, content } = req.body

    if (!slug) {
      return res.status(400).json({ success: false, error: '缺少文章标识' })
    }

    const filePath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: '文章不存在' })
    }

    const existingContent = fs.readFileSync(filePath, 'utf8')
    const { data: existingData } = matter(existingContent)

    const updatedFrontMatter = `---
title: ${title || existingData.title}
date: ${existingData.date}
category: ${category || existingData.category}
tags: [${(tags || existingData.tags || []).join(', ')}]
author: ${existingData.author}
excerpt: ${excerpt || existingData.excerpt}
---

${content || existingData.content}`

    fs.writeFileSync(filePath, updatedFrontMatter, 'utf8')

    const updatedPost: Post = {
      slug: slug as string,
      title: title || existingData.title,
      date: existingData.date,
      category: category || existingData.category,
      tags: tags || existingData.tags || [],
      author: existingData.author,
      excerpt: excerpt || existingData.excerpt,
      content: content || existingData.content
    }

    return res.status(200).json({ success: true, data: updatedPost })
  } catch (error) {
    console.error('Update post error:', error)
    return res.status(500).json({ success: false, error: '更新文章时发生错误' })
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { slug } = req.query

    if (!slug) {
      return res.status(400).json({ success: false, error: '缺少文章标识' })
    }

    const filePath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: '文章不存在' })
    }

    fs.unlinkSync(filePath)

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Delete post error:', error)
    return res.status(500).json({ success: false, error: '删除文章时发生错误' })
  }
} 