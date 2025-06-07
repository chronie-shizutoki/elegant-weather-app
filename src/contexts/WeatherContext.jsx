import { createContext, useContext, useEffect, useReducer } from 'react';

// 创建天气上下文
const WeatherContext = createContext();

// 天气类型枚举
export const WeatherType = {
  SUNNY: 'sunny',
  CLOUDY: 'cloudy',
  OVERCAST: 'overcast',
  RAIN: 'rain',
  HEAVY_RAIN: 'heavy_rain',
  THUNDERSTORM: 'thunderstorm',
  SNOW: 'snow',
  FOG: 'fog',
  DUST: 'dust',
};

// 初始状态
const initialState = {
  currentWeather: {
    location: null,
    temperature: null,
    weatherType: null,
    humidity: null,
    windSpeed: null,
    windDirection: null,
    pressure: null,
    uvIndex: null,
    feelsLike: null,
    visibility: null,
    airQuality: null,
    updatedAt: null,
  },
  hourlyForecast: [],
  dailyForecast: [],
  weatherAlerts: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// 动作类型
const ActionType = {
  FETCH_WEATHER_START: 'FETCH_WEATHER_START',
  FETCH_WEATHER_SUCCESS: 'FETCH_WEATHER_SUCCESS',
  FETCH_WEATHER_FAILURE: 'FETCH_WEATHER_FAILURE',
  SET_LOCATION: 'SET_LOCATION',
};

// Reducer 函数
function weatherReducer(state, action) {
  switch (action.type) {
    case ActionType.FETCH_WEATHER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case ActionType.FETCH_WEATHER_SUCCESS:
      return {
        ...state,
        currentWeather: action.payload.currentWeather,
        hourlyForecast: action.payload.hourlyForecast,
        dailyForecast: action.payload.dailyForecast,
        weatherAlerts: action.payload.weatherAlerts,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      };
    case ActionType.FETCH_WEATHER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case ActionType.SET_LOCATION:
      return {
        ...state,
        currentWeather: {
          ...state.currentWeather,
          location: action.payload,
        },
      };
    default:
      return state;
  }
}

// 天气提供者组件
export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  // 获取天气数据
  const fetchWeatherData = async (location) => {
    dispatch({ type: ActionType.FETCH_WEATHER_START });
    
    try {
      // 这里将来会实现实际的API调用
      // 目前使用模拟数据
      const mockData = generateMockWeatherData(location);
      
      dispatch({
        type: ActionType.FETCH_WEATHER_SUCCESS,
        payload: mockData,
      });
    } catch (error) {
      dispatch({
        type: ActionType.FETCH_WEATHER_FAILURE,
        payload: error.message,
      });
    }
  };

  // 设置位置
  const setLocation = (location) => {
    dispatch({
      type: ActionType.SET_LOCATION,
      payload: location,
    });
    
    // 获取新位置的天气数据
    fetchWeatherData(location);
  };

  // 刷新天气数据
  const refreshWeather = () => {
    if (state.currentWeather.location) {
      fetchWeatherData(state.currentWeather.location);
    }
  };

  // 生成模拟天气数据（开发阶段使用）
  const generateMockWeatherData = (location) => {
    const now = new Date();
    const weatherTypes = Object.values(WeatherType);
    const randomWeatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    
    // 生成当前天气
    const currentWeather = {
      location: location || {
        name: '虎丘区 娄门路',
        latitude: 31.3,
        longitude: 120.6,
      },
      temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
      weatherType: randomWeatherType,
      humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
      windSpeed: Math.floor(Math.random() * 10) + 1, // 1-11 m/s
      windDirection: Math.floor(Math.random() * 360), // 0-360 degrees
      pressure: Math.floor(Math.random() * 50) + 980, // 980-1030 hPa
      uvIndex: Math.floor(Math.random() * 11), // 0-10
      feelsLike: Math.floor(Math.random() * 15) + 15, // 15-30°C
      visibility: Math.floor(Math.random() * 5) + 5, // 5-10 km
      airQuality: Math.floor(Math.random() * 150) + 50, // 50-200
      updatedAt: now,
    };
    
    // 生成小时预报
    const hourlyForecast = Array.from({ length: 24 }, (_, i) => {
      const forecastTime = new Date(now);
      forecastTime.setHours(now.getHours() + i);
      
      return {
        time: forecastTime,
        temperature: currentWeather.temperature + Math.floor(Math.random() * 5) - 2, // -2 to +2°C
        weatherType: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
        precipitation: Math.random() < 0.3 ? Math.random() * 5 : 0, // 30% chance of rain
        windSpeed: Math.floor(Math.random() * 10) + 1,
      };
    });
    
    // 生成每日预报
    const dailyForecast = Array.from({ length: 14 }, (_, i) => {
      const forecastDate = new Date(now);
      forecastDate.setDate(now.getDate() + i);
      
      return {
        date: forecastDate,
        maxTemperature: currentWeather.temperature + Math.floor(Math.random() * 5),
        minTemperature: currentWeather.temperature - Math.floor(Math.random() * 8),
        weatherType: {
          day: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
          night: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
        },
        precipitation: Math.random() < 0.3 ? Math.random() * 10 : 0,
        humidity: Math.floor(Math.random() * 50) + 30,
        sunrise: new Date(forecastDate).setHours(6, Math.floor(Math.random() * 30), 0),
        sunset: new Date(forecastDate).setHours(18, Math.floor(Math.random() * 30), 0),
        moonPhase: Math.random(),
        airQuality: Math.floor(Math.random() * 150) + 50,
      };
    });
    
    // 生成天气预警
    const weatherAlerts = [];
    if (Math.random() < 0.3) { // 30% chance of having an alert
      weatherAlerts.push({
        id: Math.random().toString(36).substring(2, 11),
        type: ['高温', '暴雨', '台风', '大雾', '雷电'][Math.floor(Math.random() * 5)],
        severity: ['黄色', '橙色', '红色'][Math.floor(Math.random() * 3)],
        title: '高温黄色预警：预计6-8日徐州、宿迁、淮安北部和准安北部将继续发布高温',
        description: '江苏省气象台2025年06月05日16时08分继续发布高温黄色预警：预计6-8日徐州、宿迁、淮安北部和准安北部将继续出现35℃以上的高温天气。',
        startTime: now,
        endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days later
        issuedBy: '江苏省气象台',
        issuedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      });
    }
    
    return {
      currentWeather,
      hourlyForecast,
      dailyForecast,
      weatherAlerts,
    };
  };

  // 提供的上下文值
  const value = {
    ...state,
    setLocation,
    refreshWeather,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

// 自定义钩子，用于访问天气上下文
export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}

