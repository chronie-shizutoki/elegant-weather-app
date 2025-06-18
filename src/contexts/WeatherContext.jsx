import { createContext, useContext, useReducer, useEffect } from 'react';

// 天气类型枚举
export const WeatherType = {
  SUNNY: 'sunny',
  CLOUDY: 'cloudy',
  PARTLY_CLOUDY: 'partly-cloudy',
  OVERCAST: 'overcast',
  RAIN: 'rainy',
  DRIZZLE: 'drizzle',
  HEAVY_RAIN: 'heavy_rain',
  THUNDERSTORM: 'thunderstorm',
  SNOW: 'snow',
  FOG: 'fog',
  HAZE: 'haze'
};

// 天气图标映射
export const WeatherIcons = {
  [WeatherType.SUNNY]: '☀️',
  [WeatherType.CLOUDY]: '⛅',
  [WeatherType.PARTLY_CLOUDY]: '⛅',
  [WeatherType.OVERCAST]: '☁️',
  [WeatherType.RAIN]: '🌧️',
  [WeatherType.DRIZZLE]: '🌦️',
  [WeatherType.HEAVY_RAIN]: '⛈️',
  [WeatherType.THUNDERSTORM]: '⚡',
  [WeatherType.SNOW]: '❄️',
  [WeatherType.FOG]: '🌫️',
  [WeatherType.HAZE]: '😶‍🌫️'
};

// 初始状态
const initialState = {
  currentWeather: null,
  hourlyForecast: [],
  dailyForecast: [],
  isLoading: false,
  error: null,
  selectedCity: '北京市',
  cities: ['北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市'],
  weather: {
    location: '北京市',
    temperature: 25,
    feelsLike: 27,
    condition: 'sunny',
    description: '晴朗',
    humidity: 60,
    windSpeed: 3,
    windDirection: 180,
    pressure: 1013,
    visibility: 10,
    uvIndex: 5,
    airQuality: {
      aqi: 75,
      level: '良',
      pm25: 35,
      pm10: 50
    },
    highTemp: 30,
    lowTemp: 20,
    maxTemp: 30,
    minTemp: 20,
    sunrise: '06:30',
    sunset: '18:45',
    updatedTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
};

// Action 类型
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_CURRENT_WEATHER: 'SET_CURRENT_WEATHER',
  SET_HOURLY_FORECAST: 'SET_HOURLY_FORECAST',
  SET_DAILY_FORECAST: 'SET_DAILY_FORECAST',
  SET_ERROR: 'SET_ERROR',
  SET_SELECTED_CITY: 'SET_SELECTED_CITY',
  ADD_CITY: 'ADD_CITY',
  REMOVE_CITY: 'REMOVE_CITY',
  SET_WEATHER: 'SET_WEATHER'
};

// Reducer
function weatherReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ActionTypes.SET_CURRENT_WEATHER:
      return { ...state, currentWeather: action.payload, isLoading: false };
    case ActionTypes.SET_HOURLY_FORECAST:
      return { ...state, hourlyForecast: action.payload };
    case ActionTypes.SET_DAILY_FORECAST:
      return { ...state, dailyForecast: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ActionTypes.SET_SELECTED_CITY:
      return { ...state, selectedCity: action.payload };
    case ActionTypes.ADD_CITY:
      return { 
        ...state, 
        cities: [...state.cities, action.payload].filter((city, index, arr) => arr.indexOf(city) === index)
      };
    case ActionTypes.REMOVE_CITY:
      return { 
        ...state, 
        cities: state.cities.filter(city => city !== action.payload)
      };
    case ActionTypes.SET_WEATHER:
      return {
        ...state,
        weather: action.payload
      };
    default:
      return state;
  }
}

// 创建上下文
const WeatherContext = createContext();

// 模拟天气数据生成
function generateMockWeatherData(city) {
  const weatherTypes = Object.values(WeatherType);
  const randomWeatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  
  const baseTemp = Math.floor(Math.random() * 30) + 5; // 5-35度
  
  return {
    location: city,
    temperature: baseTemp,
    feelsLike: baseTemp + Math.floor(Math.random() * 6) - 3,
    condition: randomWeatherType,
    description: getWeatherDescription(randomWeatherType),
    humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
    windSpeed: Math.floor(Math.random() * 8) + 1, // 1-8级
    windDirection: Math.floor(Math.random() * 360), // 0-359度
    pressure: Math.floor(Math.random() * 100) + 1000, // 1000-1100 hPa
    visibility: Math.floor(Math.random() * 15) + 5, // 5-20 km
    uvIndex: Math.floor(Math.random() * 11), // 0-10
    airQuality: {
      aqi: Math.floor(Math.random() * 200) + 50, // 50-250
      level: getAQILevel(Math.floor(Math.random() * 200) + 50),
      pm25: Math.floor(Math.random() * 150) + 10,
      pm10: Math.floor(Math.random() * 200) + 20
    },
    highTemp: baseTemp + Math.floor(Math.random() * 8) + 2,
    lowTemp: baseTemp - Math.floor(Math.random() * 8) - 2,
    maxTemp: baseTemp + Math.floor(Math.random() * 8) + 2,
    minTemp: baseTemp - Math.floor(Math.random() * 8) - 2,
    sunrise: '06:30',
    sunset: '18:45',
    updatedTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  };
}

// 生成小时预报数据
function generateHourlyForecast() {
  const forecast = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const weatherTypes = Object.values(WeatherType);
    const randomWeatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    
    forecast.push({
      time: time.getHours(),
      temperature: Math.floor(Math.random() * 20) + 10,
      weatherType: randomWeatherType,
      condition: randomWeatherType,
      precipitation: Math.floor(Math.random() * 100), // 降水概率
      windSpeed: Math.floor(Math.random() * 6) + 1
    });
  }
  
  return forecast;
}

// 生成每日预报数据
function generateDailyForecast() {
  const forecast = [];
  const today = new Date();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const weatherTypes = Object.values(WeatherType);
    const dayWeatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    const nightWeatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    
    const maxTemp = Math.floor(Math.random() * 20) + 15;
    const minTemp = maxTemp - Math.floor(Math.random() * 10) - 5;
    
    forecast.push({
      date: date.toLocaleDateString('zh-CN'),
      weekday: i === 0 ? '今天' : i === 1 ? '明天' : weekdays[date.getDay()],
      dayWeatherType,
      nightWeatherType,
      condition: dayWeatherType,
      maxTemp,
      minTemp,
      precipitation: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 6) + 1,
      airQuality: {
        level: getAQILevel(Math.floor(Math.random() * 200) + 50)
      }
    });
  }
  
  return forecast;
}

// 获取天气描述
function getWeatherDescription(weatherType) {
  const descriptions = {
    [WeatherType.SUNNY]: '晴朗',
    [WeatherType.CLOUDY]: '多云',
    [WeatherType.PARTLY_CLOUDY]: '局部多云',
    [WeatherType.OVERCAST]: '阴天',
    [WeatherType.RAIN]: '小雨',
    [WeatherType.DRIZZLE]: '毛毛雨',
    [WeatherType.HEAVY_RAIN]: '大雨',
    [WeatherType.THUNDERSTORM]: '雷阵雨',
    [WeatherType.SNOW]: '雪',
    [WeatherType.FOG]: '雾',
    [WeatherType.HAZE]: '霾'
  };
  return descriptions[weatherType] || '未知';
}

// 获取空气质量等级
function getAQILevel(aqi) {
  if (aqi <= 50) return '优';
  if (aqi <= 100) return '良';
  if (aqi <= 150) return '轻度污染';
  if (aqi <= 200) return '中度污染';
  if (aqi <= 300) return '重度污染';
  return '严重污染';
}

// Provider 组件
export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  // 获取天气数据
  const fetchWeatherData = async (city = state.selectedCity) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成模拟数据
      const currentWeather = generateMockWeatherData(city);
      const hourlyForecast = generateHourlyForecast();
      const dailyForecast = generateDailyForecast();
      
      dispatch({ type: ActionTypes.SET_CURRENT_WEATHER, payload: currentWeather });
      dispatch({ type: ActionTypes.SET_HOURLY_FORECAST, payload: hourlyForecast });
      dispatch({ type: ActionTypes.SET_DAILY_FORECAST, payload: dailyForecast });
      dispatch({ type: ActionTypes.SET_WEATHER, payload: currentWeather });
      
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  };

  // 切换城市
  const selectCity = (city) => {
    dispatch({ type: ActionTypes.SET_SELECTED_CITY, payload: city });
    fetchWeatherData(city);
  };

  // 添加城市
  const addCity = (city) => {
    dispatch({ type: ActionTypes.ADD_CITY, payload: city });
  };

  // 删除城市
  const removeCity = (city) => {
    dispatch({ type: ActionTypes.REMOVE_CITY, payload: city });
  };

  // 刷新数据
  const refreshWeatherData = () => {
    fetchWeatherData(state.selectedCity);
  };

  // 初始化数据
  useEffect(() => {
    fetchWeatherData();
  }, []);

  const value = {
    ...state,
    fetchWeatherData,
    selectCity,
    addCity,
    removeCity,
    refreshWeatherData
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

// Hook
export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}

export { WeatherType as default };
