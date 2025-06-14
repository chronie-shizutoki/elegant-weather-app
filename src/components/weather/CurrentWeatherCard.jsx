import React, { useEffect, useRef } from 'react';
import { useWeather } from '../../contexts/WeatherContext';
import { useTranslation } from 'react-i18next';

/**
 * 当前天气卡片组件 - 使用液体玻璃效果展示当前天气信息
 */
const CurrentWeatherCard = () => {
  const { weather } = useWeather();
  const { t } = useTranslation();
  const cardRef = useRef(null);
  
  // 添加卡片上的雨滴/雪花效果
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    let effectCleanup = null;
    
    // 根据天气状况添加特效
    if (['rainy', 'drizzle', 'thunderstorm'].includes(weather.condition)) {
      // 在卡片上添加少量雨滴效果
      const addRaindrops = () => {
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop-on-card';
        
        // 随机位置和大小
        const size = Math.random() * 6 + 3;
        raindrop.style.width = `${size}px`;
        raindrop.style.height = `${size}px`;
        raindrop.style.left = `${Math.random() * 100}%`;
        raindrop.style.top = `${Math.random() * 100}%`;
        
        card.appendChild(raindrop);
        
        // 雨滴消失动画
        setTimeout(() => {
          raindrop.style.transform = 'scale(1.5)';
          raindrop.style.opacity = '0';
          
          // 移除元素
          setTimeout(() => {
            raindrop.remove();
          }, 1000);
        }, Math.random() * 3000 + 2000);
      };
      
      // 初始添加几个雨滴
      for (let i = 0; i < 5; i++) {
        setTimeout(addRaindrops, Math.random() * 1000);
      }
      
      // 定期添加新雨滴
      const interval = setInterval(addRaindrops, 2000);
      
      effectCleanup = () => clearInterval(interval);
    }
    
    return () => {
      if (effectCleanup) effectCleanup();
    };
  }, [weather.condition]);

  // 添加光影效果
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      
      // 计算鼠标相对于卡片的位置 (0-1)
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      // 更新CSS变量
      card.style.setProperty('--mouse-x', x.toFixed(2));
      card.style.setProperty('--mouse-y', y.toFixed(2));
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div 
      ref={cardRef}
      className="liquid-glass liquid-card weather-card current-weather-card"
      style={{
        '--card-highlight-x': 'calc(var(--mouse-x, 0.5) * 100%)',
        '--card-highlight-y': 'calc(var(--mouse-y, 0.5) * 100%)'
      }}
    >
      {/* 动态高光效果 */}
      <div className="card-highlight" />
      
      <div className="liquid-card-header">
        <h2 className="text-2xl font-bold text-white/90 flex items-center">
          <span className="mr-2">{t('currentWeather')}</span>
          <span className="text-sm font-normal text-white/70">{weather.location}</span>
        </h2>
      </div>
      
      <div className="liquid-card-content flex flex-col items-center py-6">
        {/* 天气图标 - 添加浮动动画 */}
        <div className="weather-icon text-7xl mb-4">
          {getWeatherIcon(weather.condition)}
        </div>
        
        {/* 温度 - 添加发光效果 */}
        <div className="temperature-value mb-2">
          {weather.temperature}°
        </div>
        
        {/* 天气状况 */}
        <div className="text-white/80 mb-4 text-xl">
          {t(`weather.${weather.condition}`)}
        </div>
        
        {/* 最高/最低温度 */}
        <div className="flex justify-between w-full text-white/70 text-sm">
          <span>{t('highTemp')}: {weather.highTemp}°</span>
          <span>{t('lowTemp')}: {weather.lowTemp}°</span>
        </div>
      </div>
      
      <div className="liquid-card-footer">
        <div className="flex justify-between text-white/60 text-sm">
          <span>{t('feelsLike')}: {weather.feelsLike}°</span>
          <span>{t('updated')}: {weather.updatedTime}</span>
        </div>
      </div>
      
      <style jsx>{`
        .current-weather-card {
          position: relative;
          overflow: hidden;
        }
        
        .card-highlight {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          background: radial-gradient(
            circle at var(--card-highlight-x) var(--card-highlight-y),
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0) 50%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .current-weather-card:hover .card-highlight {
          opacity: 1;
        }
        
        .temperature-value {
          font-size: 4rem;
          font-weight: 700;
          background: linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.6));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 10px rgba(255,255,255,0.3);
          animation: pulse 2s infinite alternate ease-in-out;
        }
        
        .weather-icon {
          animation: float 3s ease-in-out infinite;
        }
        
        .raindrop-on-card {
          position: absolute;
          background: radial-gradient(circle at center, rgba(255,255,255,0.9), rgba(255,255,255,0.5));
          border-radius: 50%;
          box-shadow: 0 0 5px rgba(255,255,255,0.5);
          transition: transform 1s ease, opacity 1s ease;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.9;
          }
          100% {
            opacity: 1;
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

export default CurrentWeatherCard;
