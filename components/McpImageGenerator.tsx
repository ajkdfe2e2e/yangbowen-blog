import React, { useState } from 'react'

interface McpImageGeneratorProps {
  onImageGenerated?: (imageUrl: string) => void
}

export const McpImageGenerator: React.FC<McpImageGeneratorProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState('1:1')

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('请输入图片描述')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspect_ratio: aspectRatio,
          n: 1
        })
      })

      const result = await response.json()

      if (result.success && result.imageUrl) {
        setGeneratedImage(result.imageUrl)
        onImageGenerated?.(result.imageUrl)
      } else {
        setError(result.error || '图片生成失败')
      }
    } catch (error) {
      console.error('Image generation error:', error)
      setError('网络错误，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      generateImage()
    }
  }

  return (
    <div className="ai-image-generator">
      <div className="generator-header">
        <h3>🎨 AI智能配图</h3>
        <p className="subtitle">基于MiniMax AI的文生图功能</p>
      </div>

      <div className="input-section">
        <div className="prompt-input-group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="描述您想要生成的图片，例如：一幅现代简约风格的科技插画，蓝色主题..."
            rows={3}
            className="prompt-input"
            disabled={isGenerating}
          />
          
          <div className="controls">
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="aspect-select"
              disabled={isGenerating}
              aria-label="选择图片比例"
            >
              <option value="1:1">1:1 正方形</option>
              <option value="16:9">16:9 横屏</option>
              <option value="4:3">4:3 横屏</option>
              <option value="3:2">3:2 横屏</option>
              <option value="2:3">2:3 竖屏</option>
              <option value="3:4">3:4 竖屏</option>
              <option value="9:16">9:16 竖屏</option>
            </select>
            
            <button
              onClick={generateImage}
              disabled={isGenerating || !prompt.trim()}
              className="generate-btn"
            >
              {isGenerating ? (
                <>
                  <span className="spinner">🎨</span>
                  生成中...
                </>
              ) : (
                '✨ 生成图片'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
      </div>

      {generatedImage && (
        <div className="result-section">
          <div className="image-container">
            <img src={generatedImage} alt="AI生成的图片" className="generated-image" />
            <div className="image-actions">
              <a
                href={generatedImage}
                download="ai-generated-image.png"
                className="download-btn"
              >
                📥 下载图片
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedImage)
                  alert('图片链接已复制到剪贴板')
                }}
                className="copy-btn"
              >
                📋 复制链接
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="tips-section">
        <h4>💡 使用技巧</h4>
        <ul>
          <li>描述越详细，生成效果越好</li>
          <li>可以指定风格：水彩画、油画、摄影、插画等</li>
          <li>可以指定颜色：蓝色调、暖色调、黑白等</li>
          <li>可以指定场景：室内、户外、抽象、现实等</li>
        </ul>
      </div>

      <style jsx>{`
        .ai-image-generator {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          padding: 2rem;
          color: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .generator-header h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
        }

        .subtitle {
          margin: 0 0 1.5rem 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .input-section {
          margin-bottom: 1.5rem;
        }

        .prompt-input-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .prompt-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1rem;
          resize: vertical;
          backdrop-filter: blur(10px);
        }

        .prompt-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .prompt-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        }

        .controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .aspect-select {
          padding: 0.5rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          backdrop-filter: blur(10px);
        }

        .generate-btn {
          flex: 1;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, #ff6b6b, #feca57);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .generate-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .generate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .error-message {
          background: rgba(255, 0, 0, 0.2);
          border: 1px solid rgba(255, 0, 0, 0.5);
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .result-section {
          margin-bottom: 1.5rem;
        }

        .image-container {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 1rem;
          backdrop-filter: blur(10px);
        }

        .generated-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }

        .image-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .download-btn, .copy-btn {
          flex: 1;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          text-align: center;
          transition: all 0.3s;
          cursor: pointer;
        }

        .download-btn:hover, .copy-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .tips-section {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 1rem;
          backdrop-filter: blur(10px);
        }

        .tips-section h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
        }

        .tips-section ul {
          margin: 0;
          padding-left: 1.2rem;
        }

        .tips-section li {
          margin: 0.3rem 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .controls {
            flex-direction: column;
            align-items: stretch;
          }

          .image-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}