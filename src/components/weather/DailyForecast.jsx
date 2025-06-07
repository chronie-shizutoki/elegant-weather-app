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

// 获取星期几
const getDayOfWeek = (date, isToday = false) => {
  if (isToday) return '今天';
  
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return days[date.getDay()];
};

// 获取日期
const getFormattedDate = (date) => {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 每日天气预报组件
export default function DailyForecast({ days = 7 }) {
  const { dailyForecast, isLoading } = useWeather();
  const { timeOfDay } = useTheme();
  
  // 卡片样式根据时间变化
  let cardStyle = 'bg-white/20 dark:bg-gray-800/40';
  if (timeOfDay === TimeOfDay.NIGHT) {
    cardStyle = 'bg-gray-800/40 text-white';
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className={`${cardStyle} backdrop-blur-md rounded-xl p-4 shadow-lg animate-pulse mt-4`}>
        <h3 className="text-lg font-semibold mb-3">14天天气预报</h3>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 无数据状态
  if (!dailyForecast || dailyForecast.length === 0) {
    return (
      <div className={`${cardStyle} backdrop-blur-md rounded-xl p-4 shadow-lg mt-4`}>
        <p className="text-gray-600 dark:text-gray-300">暂无每日预报数据</p>
      </div>
    );
  }

  // 限制显示的天数
  const limitedForecast = dailyForecast.slice(0, days);
  
  // 找出最高和最低温度，用于绘制温度曲线
  const maxTemps = limitedForecast.map(day => day.maxTemperature);
  const minTemps = limitedForecast.map(day => day.minTemperature);
  const overallMax = Math.max(...maxTemps) + 2;
  const overallMin = Math.min(...minTemps) - 2;
  const tempRange = overallMax - overallMin;

  return (
    <div className={`${cardStyle} backdrop-blur-md rounded-xl p-4 shadow-lg mt-4 slide-up`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">14天天气预报</h3>
        <button className="text-sm text-blue-500 dark:text-blue-400">
          查看详情
        </button>
      </div>
      
      {/* 温度曲线图 */}
      <div className="relative h-32 mb-4">
        {/* 温度曲线 */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* 最高温度曲线 */}
          <polyline
            points={limitedForecast.map((day, index) => {
              const x = `${(index / (limitedForecast.length - 1)) * 100}%`;
              const y = `${((overallMax - day.maxTemperature) / tempRange) * 70}%`;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="rgb(239, 68, 68)"
            strokeWidth="2"
          />
          
          {/* 最低温度曲线 */}
          <polyline
            points={limitedForecast.map((day, index) => {
              const x = `${(index / (limitedForecast.length - 1)) * 100}%`;
              const y = `${((overallMax - day.minTemperature) / tempRange) * 70 + 30}%`;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
          />
        </svg>
        
        {/* 温度点和标签 */}
        <div className="absolute inset-0 flex justify-between">
          {limitedForecast.map((day, index) => (
            <div key={index} className="flex flex-col items-center relative h-full">
              {/* 最高温度点 */}
              <div 
                className="absolute h-3 w-3 bg-red-500 rounded-full"
                style={{ 
                  top: `${((overallMax - day.maxTemperature) / tempRange) * 70}%`,
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
              
              {/* 最高温度标签 */}
              <div 
                className="absolute text-xs font-semibold text-red-500"
                style={{ 
                  top: `${((overallMax - day.maxTemperature) / tempRange) * 70 - 10}%`,
                  left: '50%',
                  transform: 'translate(-50%, -100%)'
                }}
              >
                {day.maxTemperature}°
              </div>
              
              {/* 最低温度点 */}
              <div 
                className="absolute h-3 w-3 bg-blue-500 rounded-full"
                style={{ 
                  top: `${((overallMax - day.minTemperature) / tempRange) * 70 + 30}%`,
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
              
              {/* 最低温度标签 */}
              <div 
                className="absolute text-xs font-semibold text-blue-500"
                style={{ 
                  top: `${((overallMax - day.minTemperature) / tempRange) * 70 + 30 + 5}%`,
                  left: '50%',
                  transform: 'translate(-50%, 0)'
                }}
              >
                {day.minTemperature}°
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 每日预报列表 */}
      <div className="space-y-4">
        {limitedForecast.map((day, index) => {
          const date = new Date(day.date);
          const isToday = index === 0;
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="w-16 text-sm">
                <div>{getDayOfWeek(date, isToday)}</div>
                <div className="text-xs opacity-70">{getFormattedDate(date)}</div>
              </div>
              
              <div className="flex items-center">
                {getWeatherIcon(day.weatherType.day)}
                <span className="ml-2 text-sm">
                  {(() => {
                    switch (day.weatherType.day) {
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
              
              <div className="flex items-center space-x-1">
                <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-600 dark:text-green-400">
                  {day.airQuality <= 50 ? '优' : day.airQuality <= 100 ? '良' : '污染'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold">{day.maxTemperature}°</span>
                <span className="text-xs opacity-70">/</span>
                <span className="text-sm">{day.minTemperature}°</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <button className="px-4 py-2 text-sm bg-white/20 dark:bg-gray-700/30 rounded-lg">
          查看近14日天气
        </button>
      </div>
    </div>
  );
}

