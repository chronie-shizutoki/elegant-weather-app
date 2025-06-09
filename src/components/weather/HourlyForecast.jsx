import { useRef, useEffect } from 'react';
import { useWeather, WeatherIcons } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';
import { ChevronLeft, ChevronRight, Droplets } from 'lucide-react';

export default function HourlyForecast() {
  const { hourlyForecast, isLoading } = useWeather();
  const { getCardStyle, getTextColor } = useTheme();
  const { t } = useLang();
  const scrollRef = useRef(null);

  // 滚动到当前时间
  useEffect(() => {
    if (scrollRef.current && hourlyForecast.length > 0) {
      const currentHour = new Date().getHours();
      const currentIndex = hourlyForecast.findIndex(item => item.time === currentHour);
      if (currentIndex > 0) {
        const itemWidth = 80; // 每个项目的宽度
        scrollRef.current.scrollLeft = currentIndex * itemWidth;
      }
    }
  }, [hourlyForecast]);

  // 向左滚动
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  // 向右滚动
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  // 格式化时间显示
  const formatTime = (hour) => {
    const now = new Date().getHours();
    if (hour === now) {
      return t('time.now');
    }
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  // 获取降水概率颜色
  const getPrecipitationColor = (precipitation) => {
    if (precipitation >= 80) return 'text-blue-600';
    if (precipitation >= 60) return 'text-blue-500';
    if (precipitation >= 40) return 'text-blue-400';
    if (precipitation >= 20) return 'text-blue-300';
    return 'text-gray-400';
  };

  // 加载状态
  if (isLoading) {
    return (
      <div 
        className="p-4"
        style={getCardStyle(0.8)}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: getTextColor() }}>
          {t('forecast.hourly')}
        </h3>
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-16 animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-8 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 无数据状态
  if (!hourlyForecast || hourlyForecast.length === 0) {
    return (
      <div 
        className="p-4 text-center"
        style={getCardStyle(0.8)}
      >
        <h3 className="text-lg font-semibold mb-2" style={{ color: getTextColor() }}>
          {t('forecast.hourly')}
        </h3>
        <p style={{ color: getTextColor('secondary') }}>
          {t('no_data')}
        </p>
      </div>
    );
  }

  return (
    <div 
      className="p-4 relative"
      style={getCardStyle(0.8)}
    >
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: getTextColor() }}>
          {t('forecast.hourly')}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={scrollLeft}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            style={{ color: getTextColor('secondary') }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollRight}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            style={{ color: getTextColor('secondary') }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 小时预报列表 */}
      <div 
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {hourlyForecast.map((item, index) => {
          const isCurrentHour = item.time === new Date().getHours();
          
          return (
            <div
              key={index}
              className={`flex-shrink-0 text-center p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                isCurrentHour ? 'bg-white bg-opacity-20 ring-2 ring-white ring-opacity-30' : 'bg-white bg-opacity-10'
              }`}
              style={{ minWidth: '80px' }}
            >
              {/* 时间 */}
              <div 
                className={`text-sm mb-2 ${isCurrentHour ? 'font-semibold' : ''}`}
                style={{ color: isCurrentHour ? getTextColor() : getTextColor('secondary') }}
              >
                {formatTime(item.time)}
              </div>

              {/* 天气图标 */}
              <div className="text-2xl mb-2 animate-pulse">
                {WeatherIcons[item.weatherType]}
              </div>

              {/* 温度 */}
              <div 
                className={`text-lg font-semibold mb-2 ${isCurrentHour ? 'text-xl' : ''}`}
                style={{ color: getTextColor() }}
              >
                {item.temperature}°
              </div>

              {/* 降水概率 */}
              {item.precipitation > 0 && (
                <div className="flex items-center justify-center mb-1">
                  <Droplets 
                    size={12} 
                    className={getPrecipitationColor(item.precipitation)}
                  />
                  <span 
                    className={`text-xs ml-1 ${getPrecipitationColor(item.precipitation)}`}
                  >
                    {item.precipitation}%
                  </span>
                </div>
              )}

              {/* 风速 */}
              <div 
                className="text-xs"
                style={{ color: getTextColor('muted') }}
              >
                {item.windSpeed}级
              </div>

              {/* 当前时间指示器 */}
              {isCurrentHour && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 降水预报提示 */}
      <div className="mt-4 p-3 rounded-lg bg-white bg-opacity-10">
        <div className="flex items-center">
          <Droplets className="mr-2 text-blue-400" size={16} />
          <span className="text-sm" style={{ color: getTextColor('secondary') }}>
            {t('forecast.no_rain')}
          </span>
        </div>
        <div className="text-xs mt-1" style={{ color: getTextColor('muted') }}>
          {t('pull_to_refresh')}
        </div>
      </div>

      {/* 温度趋势线 */}
      <div className="mt-4 relative h-16">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 800 60"
          style={{ overflow: 'visible' }}
        >
          {/* 绘制温度趋势线 */}
          {hourlyForecast.length > 1 && (
            <polyline
              fill="none"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="2"
              points={hourlyForecast.slice(0, 12).map((item, index) => {
                const x = (index / 11) * 800;
                const minTemp = Math.min(...hourlyForecast.slice(0, 12).map(h => h.temperature));
                const maxTemp = Math.max(...hourlyForecast.slice(0, 12).map(h => h.temperature));
                const y = 50 - ((item.temperature - minTemp) / (maxTemp - minTemp)) * 40;
                return `${x},${y}`;
              }).join(' ')}
              className="animate-pulse"
            />
          )}
          
          {/* 绘制温度点 */}
          {hourlyForecast.slice(0, 12).map((item, index) => {
            const x = (index / 11) * 800;
            const minTemp = Math.min(...hourlyForecast.slice(0, 12).map(h => h.temperature));
            const maxTemp = Math.max(...hourlyForecast.slice(0, 12).map(h => h.temperature));
            const y = 50 - ((item.temperature - minTemp) / (maxTemp - minTemp)) * 40;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="rgba(255, 255, 255, 0.8)"
                className="animate-pulse"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

