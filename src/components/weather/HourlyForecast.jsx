import React, { useEffect, useRef } from 'react';
import { useWeather } from '../../contexts/WeatherContext';
import { useTranslation } from 'react-i18next';

/**
 * 小时预报组件 - 使用液体玻璃效果展示未来24小时天气预报
 */
const HourlyForecast = () => {
  const { hourlyForecast } = useWeather();
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  
  // 添加滚动动画效果
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    
    // 滚动时添加视差效果
    const handleScroll = () => {
      const items = container.querySelectorAll('.hourly-item');
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const centerPosition = window.innerWidth / 2;
        const itemCenter = rect.left + rect.width / 2;
        const distance = Math.abs(centerPosition - itemCenter);
        const maxDistance = window.innerWidth / 2;
        
        // 计算基于距离的缩放和透明度
        const scale = Math.max(0.85, 1 - (distance / maxDistance) * 0.15);
        const opacity = Math.max(0.7, 1 - (distance / maxDistance) * 0.3);
        
        // 应用变换
        item.style.transform = `scale(${scale})`;
        item.style.opacity = opacity;
      });
    };
    
    container.addEventListener('scroll', handleScroll);
    // 初始触发一次
    handleScroll();
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [hourlyForecast]);
  
  // 添加滚动按钮功能
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  return (
    <div ref={containerRef} className="liquid-glass liquid-card weather-card">
      <div className="liquid-card-header flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white/90">{t('hourlyForecast')}</h3>
        
        {/* 滚动控制按钮 */}
        <div className="flex space-x-2">
          <button 
            onClick={scrollLeft}
            className="liquid-button p-1 rounded-full"
            aria-label={t('scrollLeft')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button 
            onClick={scrollRight}
            className="liquid-button p-1 rounded-full"
            aria-label={t('scrollRight')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="hourly-forecast-container flex space-x-4 overflow-x-auto py-4 px-2"
      >
        {hourlyForecast.map((item, index) => (
          <div 
            key={index} 
            className="hourly-item flex-shrink-0 text-center liquid-glass p-4 rounded-2xl"
            style={{
              animationDelay: `${index * 0.1}s`,
              minWidth: '80px'
            }}
          >
            <div className="text-white/70 text-sm mb-2">{item.time}</div>
            <div className="weather-icon text-2xl mb-2">{getWeatherIcon(item.condition)}</div>
            <div className="text-white font-semibold text-lg">{item.temperature}°</div>
            
            {/* 降水概率 */}
            {item.precipitation > 0 && (
              <div className="precipitation-indicator mt-2">
                <div className="text-blue-300 text-xs">{item.precipitation}%</div>
                <div className="liquid-progress mt-1">
                  <div 
                    className="liquid-progress-bar"
                    style={{ width: `${item.precipitation}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .hourly-forecast-container {
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .hourly-forecast-container::-webkit-scrollbar {
          display: none;
        }
        
        .hourly-item {
          scroll-snap-align: center;
          transition: transform 0.3s ease, opacity 0.3s ease;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .weather-icon {
          transition: transform 0.3s ease;
        }
        
        .hourly-item:hover .weather-icon {
          transform: scale(1.2);
        }
        
        .precipitation-indicator {
          opacity: 0.9;
          transition: opacity 0.3s ease;
        }
        
        .hourly-item:hover .precipitation-indicator {
          opacity: 1;
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

export default HourlyForecast;
