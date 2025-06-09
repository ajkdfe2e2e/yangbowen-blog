import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const postsDirectory = path.join(process.cwd(), 'posts')

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  coverImage: string | null
  category: string | null
  tags: string[]
  author: string
  readTime: number
}

export function getAllPosts(): Post[] {
  // 确保posts目录存在
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      // 计算阅读时间（基于字数，假设每分钟阅读250字）
      const wordCount = content.length
      const readTime = Math.ceil(wordCount / 250)

      // 确保date是字符串格式
      let dateString: string
      if (data.date) {
        if (data.date instanceof Date) {
          dateString = data.date.toISOString()
        } else if (typeof data.date === 'string') {
          dateString = data.date
        } else {
          dateString = new Date().toISOString()
        }
      } else {
        dateString = new Date().toISOString()
      }

      return {
        slug,
        content,
        readTime,
        title: data.title || '未命名文章',
        date: dateString,
        excerpt: data.excerpt || content.substring(0, 200) + '...',
        coverImage: data.coverImage || null,
        category: data.category || null,
        tags: data.tags || [],
        author: data.author || '杨博文',
      } as Post
    })

  // 按日期排序
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const wordCount = content.length
    const readTime = Math.ceil(wordCount / 250)

    // 确保date是字符串格式
    let dateString: string
    if (data.date) {
      if (data.date instanceof Date) {
        dateString = data.date.toISOString()
      } else if (typeof data.date === 'string') {
        dateString = data.date
      } else {
        dateString = new Date().toISOString()
      }
    } else {
      dateString = new Date().toISOString()
    }

    return {
      slug,
      content,
      readTime,
      title: data.title || '未命名文章',
      date: dateString,
      excerpt: data.excerpt || content.substring(0, 200) + '...',
      coverImage: data.coverImage || null,
      category: data.category || null,
      tags: data.tags || [],
      author: data.author || '杨博文',
    }
  } catch (error) {
    console.error(`获取文章失败: ${slug}`, error)
    return null
  }
}

export function createPost(postData: Omit<Post, 'slug' | 'readTime'>): string {
  const slug = generateSlug(postData.title)
  const frontMatter = matter.stringify(postData.content, {
    title: postData.title,
    date: postData.date,
    excerpt: postData.excerpt,
    coverImage: postData.coverImage,
    category: postData.category,
    tags: postData.tags,
    author: postData.author || '杨博文',
  })

  const filePath = path.join(postsDirectory, `${slug}.md`)
  
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
  
  fs.writeFileSync(filePath, frontMatter)
  return slug
}

export function markdownToHtml(markdown: string): string {
  return marked(markdown)
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-') // 支持中文
    .replace(/^-+|-+$/g, '')
    .substring(0, 50) // 限制长度
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  
  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''))
}

// 为 getStaticPaths 提供路径格式
export function getAllPostSlugs(): Array<{ params: { slug: string } }> {
  const slugs = getPostSlugs()
  return slugs.map((slug) => ({
    params: {
      slug
    }
  }))
}