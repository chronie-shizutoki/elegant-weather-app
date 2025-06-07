import { useEffect } from 'react';
import { useWeather, WeatherType } from '@/contexts/WeatherContext';
import { useTheme, TimeOfDay } from '@/contexts/ThemeContext';
import { 
  Droplets, 
  Wind, 
  Thermometer,
  Gauge,
  Sun,
  CloudRain,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudSnow,
  CloudDrizzle
} from 'lucide-react';

// 获取天气图标
const getWeatherIcon = (weatherType, size = 48) => {
  const iconProps = { size, strokeWidth: 1.5 };
  
  switch (weatherType) {
    case WeatherType.SUNNY:
      return <Sun {...iconProps} className="text-yellow-400" />;
    case WeatherType.CLOUDY:
      return <Cloud {...iconProps} className="text-gray-400" />;
    case WeatherType.OVERCAST:
      return <Cloud {...iconProps} className="text-gray-500" />;
    case WeatherType.RAIN:
      return <CloudRain {...iconProps} className="text-blue-400" />;
    case WeatherType.HEAVY_RAIN:
      return <CloudRain {...iconProps} className="text-blue-600" />;
    case WeatherType.THUNDERSTORM:
      return <CloudLightning {...iconProps} className="text-purple-500" />;
    case WeatherType.SNOW:
      return <CloudSnow {...iconProps} className="text-blue-200" />;
    case WeatherType.FOG:
      return <CloudFog {...iconProps} className="text-gray-400" />;
    case WeatherType.DUST:
      return <CloudFog {...iconProps} className="text-yellow-600" />;
    default:
      return <Cloud {...iconProps} className="text-gray-400" />;
  }
};

// 获取风向文字
const getWindDirection = (degrees) => {
  const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

// 获取空气质量等级
const getAirQualityLevel = (aqi) => {
  if (aqi <= 50) return { level: '优', color: 'text-green-500' };
  if (aqi <= 100) return { level: '良', color: 'text-yellow-500' };
  if (aqi <= 150) return { level: '轻度污染', color: 'text-orange-500' };
  if (aqi <= 200) return { level: '中度污染', color: 'text-red-500' };
  if (aqi <= 300) return { level: '重度污染', color: 'text-purple-500' };
  return { level: '严重污染', color: 'text-purple-800' };
};

// 当前天气卡片组件
export default function CurrentWeatherCard() {
  const { currentWeather, isLoading, error, setLocation } = useWeather();
  const { timeOfDay } = useTheme();
  
  // 获取用户位置
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            latitude,
            longitude,
            name: '当前位置', // 这里应该通过反向地理编码获取实际位置名称
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // 使用默认位置
          setLocation({
            latitude: 31.3,
            longitude: 120.6,
            name: '虎丘区 娄门路',
          });
        }
      );
    } else {
      // 浏览器不支持地理位置
      console.error('Geolocation is not supported by this browser.');
      // 使用默认位置
      setLocation({
        latitude: 31.3,
        longitude: 120.6,
        name: '虎丘区 娄门路',
      });
    }
  }, [setLocation]);

  // 加载状态
  if (isLoading) {
    return (
      <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-6 shadow-lg animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 backdrop-blur-md rounded-xl p-6 shadow-lg">
        <h3 className="text-red-600 dark:text-red-400 font-semibold mb-2">获取天气数据失败</h3>
        <p className="text-red-500 dark:text-red-300">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          onClick={() => setLocation(currentWeather.location)}
        >
          重试
        </button>
      </div>
    );
  }

  // 无数据状态
  if (!currentWeather || !currentWeather.temperature) {
    return (
      <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-6 shadow-lg">
        <p className="text-gray-600 dark:text-gray-300">暂无天气数据</p>
      </div>
    );
  }

  // 获取空气质量信息
  const airQuality = getAirQualityLevel(currentWeather.airQuality);

  // 卡片样式根据时间和天气变化
  let cardStyle = 'bg-white/20 dark:bg-gray-800/40';
  if (timeOfDay === TimeOfDay.NIGHT) {
    cardStyle = 'bg-gray-800/40 text-white';
  }

  return (
    <div className={`${cardStyle} backdrop-blur-md rounded-xl p-6 shadow-lg transition-all duration-500 fade-in`}>
      {/* 位置信息 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {currentWeather.location?.name || '未知位置'}
        </h2>
        <span className="text-sm opacity-70">
          {currentWeather.updatedAt ? new Date(currentWeather.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </span>
      </div>
      
      {/* 温度和天气图标 */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-7xl font-light">
          {currentWeather.temperature}°
        </div>
        <div className="flex flex-col items-center">
          {getWeatherIcon(currentWeather.weatherType)}
          <span className="mt-2 text-lg">
            {(() => {
              switch (currentWeather.weatherType) {
                case WeatherType.SUNNY: return '晴';
                case WeatherType.CLOUDY: return '多云';
                case WeatherType.OVERCAST: return '阴';
                case WeatherType.RAIN: return '小雨';
                case WeatherType.HEAVY_RAIN: return '大雨';
                case WeatherType.THUNDERSTORM: return '雷雨';
                case WeatherType.SNOW: return '雪';
                case WeatherType.FOG: return '雾';
                case WeatherType.DUST: return '沙尘';
                default: return '未知';
              }
            })()}
          </span>
        </div>
      </div>
      
      {/* 最高最低温度 */}
      <div className="flex items-center mb-6">
        <span className="text-lg">最高32° 最低24°</span>
        <div className="ml-4 flex items-center">
          <span className={`px-3 py-1 rounded-full text-sm ${airQuality.color} bg-white/30 dark:bg-gray-700/30`}>
            空气{airQuality.level} {currentWeather.airQuality}
          </span>
        </div>
      </div>
      
      {/* 详细信息 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center p-3 bg-white/10 dark:bg-gray-700/20 rounded-lg">
          <Droplets className="mr-3 text-blue-500" size={24} />
          <div>
            <div className="text-sm opacity-70">湿度</div>
            <div className="font-semibold">{currentWeather.humidity}%</div>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-white/10 dark:bg-gray-700/20 rounded-lg">
          <Wind className="mr-3 text-blue-400" size={24} />
          <div>
            <div className="text-sm opacity-70">风速</div>
            <div className="font-semibold">
              {getWindDirection(currentWeather.windDirection)}风 {currentWeather.windSpeed}级
            </div>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-white/10 dark:bg-gray-700/20 rounded-lg">
          <Thermometer className="mr-3 text-red-400" size={24} />
          <div>
            <div className="text-sm opacity-70">体感温度</div>
            <div className="font-semibold">{currentWeather.feelsLike}°</div>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-white/10 dark:bg-gray-700/20 rounded-lg">
          <Gauge className="mr-3 text-purple-400" size={24} />
          <div>
            <div className="text-sm opacity-70">气压</div>
            <div className="font-semibold">{currentWeather.pressure} hPa</div>
          </div>
        </div>
      </div>
      
      {/* 天气预警信息 */}
      {currentWeather.weatherAlerts && currentWeather.weatherAlerts.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-500/20 dark:bg-yellow-600/20 rounded-lg border-l-4 border-yellow-500 dark:border-yellow-600">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 dark:text-yellow-400 mr-2">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <h4 className="font-semibold text-yellow-700 dark:text-yellow-400">
              {currentWeather.weatherAlerts[0].type}{currentWeather.weatherAlerts[0].severity}预警
            </h4>
          </div>
          <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            {currentWeather.weatherAlerts[0].description}
          </p>
        </div>
      )}
    </div>
  );
}

