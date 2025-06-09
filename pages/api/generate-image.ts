import type { NextApiRequest, NextApiResponse } from 'next'

interface ImageGenerationRequest {
  prompt: string
  aspect_ratio?: string
  n?: number
}

interface ImageGenerationResponse {
  success: boolean
  imageUrl?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImageGenerationResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { prompt, aspect_ratio = '1:1', n = 1 }: ImageGenerationRequest = req.body

  if (!prompt) {
    return res.status(400).json({ 
      success: false, 
      error: '请提供图片描述' 
    })
  }

  try {
    const MINIMAX_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiLmnajljZrmlociLCJVc2VyTmFtZSI6IuadqOWNmuaWhyIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTIyMjE4MTk5MjY5NTExNjM0IiwiUGhvbmUiOiIxOTIzMzgxNzg1NCIsIkdyb3VwSUQiOiIxOTIyMjE4MTk5MjY1MzE3MzMwIiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiIiwiQ3JlYXRlVGltZSI6IjIwMjUtMDYtMDkgMTE6MjY6MzciLCJUb2tlblR5cGUiOjEsImlzcyI6Im1pbmltYXgifQ.LgLhhOff8zk8NqpwglUQuxI7XmhqKUMEqt83lS8snE17WUMi68_JARBhMRAJ3Uhi0Brp2_d6UC3_e8O2t5rMG6KR7pZh0oYcPDAQpfcH4c0W3BeibSDM8YKSBi7y_i4V5oNAnyZ4kTwgQXEm-Ojzco5UBAHSiPQcozifnM_G45ODAqf2H8QCMMeEqeJkecEvjA2Q9KxORgCHQNgV4_kqLUaR8CPrgyrckv4K2rY5PmnUZTtHNdmXxQ2WkKDvq4DjNEyvLqDDaQEE_6QKu75C6tlWbyqzJ-Pr7ucbaawFu5UN9bUUCBSfX1osKxEymqTHOwbdnO-jeOOSv5nsHHjq8g'

    const response = await fetch('https://api.minimax.chat/v1/text_to_image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MINIMAX_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'image-01',
        prompt: prompt,
        aspect_ratio: aspect_ratio,
        n: n,
        prompt_optimizer: true
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('MiniMax API error:', errorData)
      return res.status(500).json({ 
        success: false, 
        error: 'AI图片生成服务暂时不可用' 
      })
    }

    const data = await response.json()
    
    if (data.choices && data.choices.length > 0 && data.choices[0].image) {
      return res.status(200).json({ 
        success: true, 
        imageUrl: data.choices[0].image.url 
      })
    } else {
      return res.status(500).json({ 
        success: false, 
        error: '图片生成失败，请重试' 
      })
    }
  } catch (error) {
    console.error('Image generation error:', error)
    res.status(500).json({ 
      success: false, 
      error: '图片生成时发生错误' 
    })
  }
} 