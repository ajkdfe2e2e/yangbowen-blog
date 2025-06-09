import React, { useState, useEffect } from 'react'

interface WeatherData {
  city: string
  weather: string
  temperature: string
  temperatureFloat: string
  windDirection: string
  windPower: string
  humidity: string
  humidityFloat: string
  reportTime: string
  updateTime: string
}

interface WeatherWidgetProps {
  defaultCity?: string
}

// 高德天气API配置
const AMAP_API_KEY = '49b043168b080824e7b78081cf8d350c'

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ defaultCity = '北京' }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [city, setCity] = useState(defaultCity)
  const [inputCity, setInputCity] = useState('')

  const fetchWeather = async (targetCity: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(targetCity)}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        setWeatherData(result.data)
        setCity(targetCity)
      } else {
        setError(result.error || '获取天气信息失败')
      }
    } catch (error) {
      console.error('Weather fetch error:', error)
      setError('网络连接错误，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather(city)
  }, [city])

  const handleSearch = () => {
    if (inputCity.trim()) {
      fetchWeather(inputCity.trim())
      setInputCity('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getWeatherIcon = (weather: string) => {
    const weatherIcons: { [key: string]: string } = {
      '晴': '☀️',
      '多云': '⛅',
      '阴': '☁️',
      '小雨': '🌦️',
      '中雨': '🌧️',
      '大雨': '⛈️',
      '雷阵雨': '⛈️',
      '雪': '❄️',
      '雾': '🌫️',
      '霾': '😷'
    }
    
    return weatherIcons[weather] || '🌤️'
  }

  const getTemperatureColor = (temp: number) => {
    if (temp <= 0) return '#87CEEB' // 冰蓝
    if (temp <= 10) return '#4169E1' // 蓝色
    if (temp <= 20) return '#32CD32' // 绿色
    if (temp <= 30) return '#FFD700' // 金色
    return '#FF6347' // 红色
  }

  if (loading) {
    return (
      <div className="weather-widget loading">
        <div className="loading-spinner">🌍</div>
        <p>获取天气信息中...</p>
        
        <style jsx>{`
          .weather-widget.loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2rem;
            background: linear-gradient(135deg, #74b9ff, #0984e3);
            border-radius: 15px;
            color: white;
            text-align: center;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          }
          
          .loading-spinner {
            font-size: 2rem;
            animation: spin 2s linear infinite;
            margin-bottom: 1rem;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div className="weather-widget error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={() => fetchWeather(city)} className="retry-btn">
          重试
        </button>
        
        <style jsx>{`
          .weather-widget.error {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2rem;
            background: linear-gradient(135deg, #ff7675, #d63031);
            border-radius: 15px;
            color: white;
            text-align: center;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          }
          
          .error-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          
          .retry-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 0.5rem 1rem;
            border-radius: 25px;
            cursor: pointer;
            margin-top: 1rem;
            transition: all 0.3s;
          }
          
          .retry-btn:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </div>
    )
  }

  if (!weatherData) return null

  const temperature = parseInt(weatherData.temperature)

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h3>🌤️ 天气信息</h3>
        <div className="city-search">
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入城市名..."
            className="city-input"
          />
          <button onClick={handleSearch} className="search-btn">
            🔍
          </button>
        </div>
      </div>
      
      <div className="weather-content">
        <div className="weather-main">
          <div className="weather-icon">
            {getWeatherIcon(weatherData.weather)}
          </div>
          <div className="weather-info">
            <h4 className="city-name">{weatherData.city}</h4>
            <div className="weather-desc">{weatherData.weather}</div>
            <div 
              className="temperature"
              style={{ color: getTemperatureColor(temperature) }}
            >
              {weatherData.temperature}°C
            </div>
          </div>
        </div>
        
        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-icon">💨</span>
            <span className="detail-text">
              {weatherData.windDirection}风 {weatherData.windPower}级
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">💧</span>
            <span className="detail-text">
              湿度 {weatherData.humidity}%
            </span>
          </div>
        </div>
        
        <div className="weather-footer">
          <small>
            更新时间: {new Date(weatherData.reportTime).toLocaleString('zh-CN')}
          </small>
        </div>
      </div>
      
      <style jsx>{`
        .weather-widget {
          background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
          border-radius: 15px;
          padding: 1.5rem;
          color: white;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .weather-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .weather-header h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
        }
        
        .city-search {
          display: flex;
          gap: 0.5rem;
        }
        
        .city-input {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 0.5rem 1rem;
          color: white;
          font-size: 0.9rem;
          width: 120px;
        }
        
        .city-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .city-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.3);
        }
        
        .search-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          width: 35px;
          height: 35px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .search-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }
        
        .weather-main {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .weather-icon {
          font-size: 3rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .weather-info {
          flex: 1;
        }
        
        .city-name {
          margin: 0 0 0.5rem 0;
          font-size: 1.3rem;
          font-weight: 600;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        .weather-desc {
          font-size: 1rem;
          opacity: 0.9;
          margin-bottom: 0.5rem;
        }
        
        .temperature {
          font-size: 2rem;
          font-weight: 700;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .weather-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.75rem;
          border-radius: 10px;
          backdrop-filter: blur(5px);
        }
        
        .detail-icon {
          font-size: 1.2rem;
        }
        
        .detail-text {
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .weather-footer {
          text-align: center;
          opacity: 0.8;
        }
        
        .weather-footer small {
          font-size: 0.8rem;
        }
        
        @media (max-width: 768px) {
          .weather-header {
            flex-direction: column;
            gap: 1rem;
          }
          
          .weather-details {
            grid-template-columns: 1fr;
          }
          
          .city-input {
            width: 150px;
          }
        }
      `}</style>
    </div>
  )
}