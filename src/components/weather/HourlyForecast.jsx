import { useRef, useEffect } from 'react';
import { useWeather, WeatherType } from '@/contexts/WeatherContext';
import { useTheme, TimeOfDay } from '@/contexts/ThemeContext';
import { 
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog
} from 'lucide-react';

// 获取天气图标
const getWeatherIcon = (weatherType, size = 24) => {
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
    case WeatherType.DUST:
      return <CloudFog {...iconProps} className="text-gray-400" />;
    default:
      return <Cloud {...iconProps} className="text-gray-400" />;
  }
};

// 获取时间段图标
const getTimeIcon = (hour, size = 24) => {
  const iconProps = { size, strokeWidth: 1.5 };
  
  if (hour >= 6 && hour < 18) {
    return <Sun {...iconProps} className="text-yellow-400" />;
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-300">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
      </svg>
    );
  }
};

// 小时天气预报组件
export default function HourlyForecast() {
  const { hourlyForecast, isLoading } = useWeather();
  const { timeOfDay } = useTheme();
  const scrollContainerRef = useRef(null);
  
  // 滚动到当前时间
  useEffect(() => {
    if (scrollContainerRef.current && hourlyForecast.length > 0) {
      // 找到当前时间最接近的预报项
      const now = new Date();
      let closestIndex = 0;
      let minDiff = Infinity;
      
      hourlyForecast.forEach((forecast, index) => {
        const forecastTime = new Date(forecast.time);
        const diff = Math.abs(forecastTime - now);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });
      
      // 滚动到当前时间
      const itemWidth = 80; // 每个预报项的宽度
      const scrollPosition = Math.max(0, closestIndex * itemWidth - 100);
      scrollContainerRef.current.scrollLeft = scrollPosition;
    }
  }, [hourlyForecast]);

  // 卡片样式根据时间变化
  let cardStyle = 'bg-white/20 dark:bg-gray-800/40';
  if (timeOfDay === TimeOfDay.NIGHT) {
    cardStyle = 'bg-gray-800/40 text-white';
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className={`${cardStyle} backdrop-blur-md rounded-xl p-4 shadow-lg animate-pulse mt-4`}>
        <h3 className="text-lg font-semibold mb-3">未来短时内无降水</h3>
        <div className="flex space-x-6 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center min-w-[60px]">
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-12 mb-2"></div>
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full mb-2"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 无数据状态
  if (!hourlyForecast || hourlyForecast.length === 0) {
    return (
      <div className={`${cardStyle} backdrop-blur-md rounded-xl p-4 shadow-lg mt-4`}>
        <p className="text-gray-600 dark:text-gray-300">暂无小时预报数据</p>
      </div>
    );
  }

  // 检查是否有降水
  const hasRain = hourlyForecast.some(forecast => 
    forecast.precipitation > 0 || 
    [WeatherType.RAIN, WeatherType.HEAVY_RAIN, WeatherType.THUNDERSTORM].includes(forecast.weatherType)
  );

  return (
    <div className={`${cardStyle} backdrop-blur-md rounded-xl p-4 shadow-lg mt-4 slide-up`}>
      <h3 className="text-lg font-semibold mb-3">
        {hasRain ? '未来短时可能有降水' : '未来短时内无降水'}
      </h3>
      
      <div 
        ref={scrollContainerRef}
        className="flex space-x-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
      >
        {hourlyForecast.map((forecast, index) => {
          const forecastTime = new Date(forecast.time);
          const hour = forecastTime.getHours();
          const isNow = index === 0;
          
          return (
            <div key={index} className="flex flex-col items-center min-w-[60px]">
              <div className="text-sm mb-1">
                {isNow ? '现在' : `${hour}:00`}
              </div>
              
              {getWeatherIcon(forecast.weatherType)}
              
              <div className="text-lg font-semibold mt-1">
                {forecast.temperature}°
              </div>
              
              {forecast.precipitation > 0 && (
                <div className="text-xs text-blue-500 dark:text-blue-300 mt-1">
                  {Math.round(forecast.precipitation * 10) / 10}mm
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* 温度曲线图 - 简化版 */}
      <div className="mt-4 h-16 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-[2px] bg-gray-300 dark:bg-gray-600"></div>
        </div>
        
        <div className="relative h-full flex items-center">
          {hourlyForecast.map((forecast, index) => {
            // 计算温度点的相对位置
            const min = Math.min(...hourlyForecast.map(f => f.temperature)) - 2;
            const max = Math.max(...hourlyForecast.map(f => f.temperature)) + 2;
            const range = max - min;
            const position = range > 0 ? ((forecast.temperature - min) / range) : 0.5;
            const top = `${(1 - position) * 100}%`;
            
            return (
              <div 
                key={index}
                className="absolute h-2 w-2 bg-blue-500 rounded-full"
                style={{ 
                  left: `${(index / (hourlyForecast.length - 1)) * 100}%`, 
                  top 
                }}
              ></div>
            );
          })}
          
          {/* 连接线 */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <polyline
              points={hourlyForecast.map((forecast, index) => {
                const min = Math.min(...hourlyForecast.map(f => f.temperature)) - 2;
                const max = Math.max(...hourlyForecast.map(f => f.temperature)) + 2;
                const range = max - min;
                const position = range > 0 ? ((forecast.temperature - min) / range) : 0.5;
                const x = `${(index / (hourlyForecast.length - 1)) * 100}%`;
                const y = `${(1 - position) * 100}%`;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

