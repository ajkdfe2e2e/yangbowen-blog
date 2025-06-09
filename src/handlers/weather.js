// 天气API处理器 - Worker适配版本

export async function handleWeather(request, env) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Method not allowed' 
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const url = new URL(request.url)
  const city = url.searchParams.get('city') || '北京'

  try {
    // 从环境变量获取API Key
    const API_KEY = env.AMAP_API_KEY || '31280bbb46f491bd85df213f90d01f31'
    
    // 先获取城市编码
    const geocodeUrl = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(city)}&key=${API_KEY}`
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()

    if (!geocodeData.geocodes || geocodeData.geocodes.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '未找到该城市信息' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const adcode = geocodeData.geocodes[0].adcode

    // 获取天气信息
    const weatherUrl = `https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=${API_KEY}`
    const weatherResponse = await fetch(weatherUrl)
    const weatherData = await weatherResponse.json()

    if (weatherData.status !== '1' || !weatherData.lives || weatherData.lives.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '获取天气信息失败' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const live = weatherData.lives[0]
    
    const result = {
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

    return new Response(JSON.stringify({ 
      success: true, 
      data: result 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Weather API error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: '获取天气信息时发生错误' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}