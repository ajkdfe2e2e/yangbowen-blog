import type { NextApiRequest, NextApiResponse } from 'next'

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

interface ApiResponse {
  success: boolean
  data?: WeatherData
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { city = '北京' } = req.query

  try {
    const API_KEY = '31280bbb46f491bd85df213f90d01f31'
    
    // 先获取城市编码
    const geocodeUrl = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(city as string)}&key=${API_KEY}`
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()

    if (!geocodeData.geocodes || geocodeData.geocodes.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: '未找到该城市信息' 
      })
    }

    const adcode = geocodeData.geocodes[0].adcode

    // 获取天气信息
    const weatherUrl = `https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=${API_KEY}`
    const weatherResponse = await fetch(weatherUrl)
    const weatherData = await weatherResponse.json()

    if (weatherData.status !== '1' || !weatherData.lives || weatherData.lives.length === 0) {
      return res.status(500).json({ 
        success: false, 
        error: '获取天气信息失败' 
      })
    }

    const live = weatherData.lives[0]
    
    const result: WeatherData = {
      city: live.city,
      weather: live.weather,
      temperature: live.temperature,
      temperatureFloat: live.temperature_float || live.temperature,
      windDirection: live.winddirection,
      windPower: live.windpower,
      humidity: live.humidity,
      humidityFloat: live.humidity_float || live.humidity,
      reportTime: live.reporttime,
      updateTime: new Date().toISOString()
    }

    res.status(200).json({ success: true, data: result })
  } catch (error) {
    console.error('Weather API error:', error)
    res.status(500).json({ 
      success: false, 
      error: '获取天气信息时发生错误' 
    })
  }
}