import React, { useEffect, useRef } from 'react';
import { useWeather } from '../../contexts/WeatherContext';
import { useTranslation } from 'react-i18next';

/**
 * 每日预报组件 - 使用液体玻璃效果展示未来14天天气预报
 */
const DailyForecast = () => {
  const { dailyForecast } = useWeather();
  const { t } = useTranslation();
  const containerRef = useRef(null);
  
  // 添加交互动画效果
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const items = container.querySelectorAll('.daily-forecast-item');
    
    // 为每个项目添加悬停效果
    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        // 高亮当前项
        item.classList.add('active');
        
        // 淡化其他项
        items.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.add('inactive');
          }
        });
      });
      
      item.addEventListener('mouseleave', () => {
        // 恢复所有项
        item.classList.remove('active');
        items.forEach(otherItem => {
          otherItem.classList.remove('inactive');
        });
      });
    });
  }, [dailyForecast]);
  
  return (
    <div ref={containerRef} className="liquid-glass liquid-card weather-card">
      <div className="liquid-card-header">
        <h3 className="text-xl font-semibold text-white/90">{t('dailyForecast')}</h3>
      </div>
      
      <div className="daily-forecast-list space-y-3 py-2">
        {dailyForecast.map((day, index) => (
          <div 
            key={index} 
            className="daily-forecast-item liquid-glass p-3 rounded-xl flex items-center justify-between"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* 日期 */}
            <div className="day-info flex-shrink-0 w-20">
              <div className="text-white font-medium">{day.day}</div>
              <div className="text-white/70 text-sm">{day.date}</div>
            </div>
            
            {/* 天气图标 */}
            <div className="weather-icon text-2xl flex-shrink-0">
              {getWeatherIcon(day.condition)}
            </div>
            
            {/* 降水概率 */}
            <div className="precipitation flex items-center flex-shrink-0 w-16">
              <span className="text-blue-300 mr-1">💧</span>
              <span className="text-white/80 text-sm">{day.precipitation}%</span>
            </div>
            
            {/* 温度范围和温度条 */}
            <div className="temperature-range flex flex-col flex-grow px-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/70">{day.lowTemp}°</span>
                <span className="text-white">{day.highTemp}°</span>
              </div>
              <div className="temperature-bar relative h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"
                  style={{ 
                    width: `${calculateTempPercentage(day.lowTemp, day.highTemp)}%`,
                    left: `${calculateTempOffset(day.lowTemp)}%`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .daily-forecast-item {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: center left;
        }
        
        .daily-forecast-item.active {
          transform: scale(1.03);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        
        .daily-forecast-item.inactive {
          opacity: 0.7;
          filter: saturate(0.8);
        }
        
        .weather-icon {
          transition: transform 0.3s ease;
        }
        
        .daily-forecast-item:hover .weather-icon {
          transform: scale(1.2) rotate(5deg);
        }
        
        .temperature-bar {
          position: relative;
          height: 6px;
          transition: height 0.3s ease;
        }
        
        .daily-forecast-item:hover .temperature-bar {
          height: 8px;
        }
        
        .temperature-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shine 2s infinite linear;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .daily-forecast-item:hover .temperature-bar::before {
          opacity: 1;
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

// 根据天气状况返回对应的图标
function getWeatherIcon(condition) {
  switch(condition) {
    case 'sunny':
    case 'clear':
      return '☀️';
    case 'partly-cloudy':
      return '⛅';
    case 'cloudy':
      return '☁️';
    case 'rainy':
      return '🌧️';
    case 'drizzle':
      return '🌦️';
    case 'thunderstorm':
      return '⛈️';
    case 'snow':
      return '❄️';
    case 'fog':
      return '🌫️';
    default:
      return '🌤️';
  }
}

// 计算温度条的百分比宽度
function calculateTempPercentage(low, high) {
  // 假设温度范围在-20°C到50°C之间
  const totalRange = 70; // 50 - (-20)
  const range = high - low;
  return (range / totalRange) * 100;
}

// 计算温度条的偏移量
function calculateTempOffset(low) {
  // 假设温度范围在-20°C到50°C之间
  const minTemp = -20;
  const totalRange = 70; // 50 - (-20)
  return ((low - minTemp) / totalRange) * 100;
}

export default DailyForecast;
