import React, { useEffect, useRef } from 'react';
import { useWeather } from '../../contexts/WeatherContext';
import { useTranslation } from 'react-i18next';

/**
 * 天气详情组件 - 使用液体玻璃效果展示详细天气数据
 */
const WeatherDetails = () => {
  const { weather } = useWeather();
  const { t } = useTranslation();
  const containerRef = useRef(null);
  
  // 添加进入动画效果
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const items = container.querySelectorAll('.weather-detail-item');
    
    // 为每个项目添加延迟动画
    items.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
    });
  }, []);
  
  // 获取空气质量指数的颜色和描述
  const getAqiInfo = (aqi) => {
    if (aqi <= 50) {
      return { color: 'from-green-300 to-green-500', description: t('aqi.good') };
    } else if (aqi <= 100) {
      return { color: 'from-yellow-300 to-yellow-500', description: t('aqi.moderate') };
    } else if (aqi <= 150) {
      return { color: 'from-orange-300 to-orange-500', description: t('aqi.unhealthySensitive') };
    } else if (aqi <= 200) {
      return { color: 'from-red-300 to-red-500', description: t('aqi.unhealthy') };
    } else if (aqi <= 300) {
      return { color: 'from-purple-300 to-purple-500', description: t('aqi.veryUnhealthy') };
    } else {
      return { color: 'from-rose-300 to-rose-500', description: t('aqi.hazardous') };
    }
  };
  
  // 获取紫外线指数的颜色和描述
  const getUvInfo = (uv) => {
    if (uv <= 2) {
      return { color: 'from-green-300 to-green-500', description: t('uv.low') };
    } else if (uv <= 5) {
      return { color: 'from-yellow-300 to-yellow-500', description: t('uv.moderate') };
    } else if (uv <= 7) {
      return { color: 'from-orange-300 to-orange-500', description: t('uv.high') };
    } else if (uv <= 10) {
      return { color: 'from-red-300 to-red-500', description: t('uv.veryHigh') };
    } else {
      return { color: 'from-purple-300 to-purple-500', description: t('uv.extreme') };
    }
  };
  
  const aqiInfo = getAqiInfo(weather.airQuality);
  const uvInfo = getUvInfo(weather.uvIndex);
  
  return (
    <div ref={containerRef} className="liquid-glass liquid-card weather-card">
      <div className="liquid-card-header">
        <h3 className="text-xl font-semibold text-white/90">{t('weatherDetails')}</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* 湿度 */}
        <div className="weather-detail-item text-center p-3">
          <div className="detail-icon text-2xl mb-2">💧</div>
          <div className="text-white/70 text-sm">{t('humidity')}</div>
          <div className="text-white font-semibold text-lg">{weather.humidity}%</div>
          <div className="liquid-progress mt-2">
            <div 
              className="liquid-progress-bar"
              style={{ width: `${weather.humidity}%` }}
            ></div>
          </div>
        </div>
        
        {/* 风速 */}
        <div className="weather-detail-item text-center p-3">
          <div className="detail-icon text-2xl mb-2">💨</div>
          <div className="text-white/70 text-sm">{t('windSpeed')}</div>
          <div className="text-white font-semibold text-lg">{weather.windSpeed} km/h</div>
          <div className="wind-direction mt-2">
            <div 
              className="wind-arrow"
              style={{ transform: `rotate(${weather.windDirection}deg)` }}
            >
              ↑
            </div>
          </div>
        </div>
        
        {/* 能见度 */}
        <div className="weather-detail-item text-center p-3">
          <div className="detail-icon text-2xl mb-2">👁️</div>
          <div className="text-white/70 text-sm">{t('visibility')}</div>
          <div className="text-white font-semibold text-lg">{weather.visibility} km</div>
          <div className="liquid-progress mt-2">
            <div 
              className="liquid-progress-bar"
              style={{ width: `${Math.min(weather.visibility / 10 * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {/* 气压 */}
        <div className="weather-detail-item text-center p-3">
          <div className="detail-icon text-2xl mb-2">🌡️</div>
          <div className="text-white/70 text-sm">{t('pressure')}</div>
          <div className="text-white font-semibold text-lg">{weather.pressure} hPa</div>
          <div className="pressure-indicator mt-2 text-xs text-white/60">
            {weather.pressure > 1013 ? t('pressure.high') : t('pressure.low')}
          </div>
        </div>
        
        {/* 空气质量 */}
        <div className="weather-detail-item text-center p-3 col-span-2">
          <div className="detail-icon text-2xl mb-2">🌬️</div>
          <div className="text-white/70 text-sm">{t('airQuality')}</div>
          <div className="text-white font-semibold text-lg flex items-center justify-center">
            <span className="mr-2">{weather.airQuality}</span>
            <span className="text-sm font-normal">({aqiInfo.description})</span>
          </div>
          <div className="liquid-progress mt-2">
            <div 
              className={`liquid-progress-bar bg-gradient-to-r ${aqiInfo.color}`}
              style={{ width: `${Math.min(weather.airQuality / 3)}%` }}
            ></div>
          </div>
        </div>
        
        {/* 紫外线指数 */}
        <div className="weather-detail-item text-center p-3 col-span-2">
          <div className="detail-icon text-2xl mb-2">☀️</div>
          <div className="text-white/70 text-sm">{t('uvIndex')}</div>
          <div className="text-white font-semibold text-lg flex items-center justify-center">
            <span className="mr-2">{weather.uvIndex}</span>
            <span className="text-sm font-normal">({uvInfo.description})</span>
          </div>
          <div className="liquid-progress mt-2">
            <div 
              className={`liquid-progress-bar bg-gradient-to-r ${uvInfo.color}`}
              style={{ width: `${Math.min(weather.uvIndex / 0.11, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {/* 日出日落 */}
        <div className="weather-detail-item text-center p-3 col-span-2 md:col-span-4">
          <div className="flex justify-between items-center">
            <div className="sunrise">
              <div className="detail-icon text-xl">🌅</div>
              <div className="text-white/70 text-xs">{t('sunrise')}</div>
              <div className="text-white font-semibold">{weather.sunrise}</div>
            </div>
            
            <div className="sun-path flex-grow mx-4 relative">
              <div className="sun-path-line h-1 bg-white/20 rounded-full"></div>
              <div 
                className="sun-position absolute top-0 transform -translate-y-1/2"
                style={{ 
                  left: `${calculateSunPosition(weather.sunrise, weather.sunset)}%`,
                  transition: 'left 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <div className="sun-indicator text-lg">☀️</div>
              </div>
            </div>
            
            <div className="sunset">
              <div className="detail-icon text-xl">🌇</div>
              <div className="text-white/70 text-xs">{t('sunset')}</div>
              <div className="text-white font-semibold">{weather.sunset}</div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .weather-detail-item {
          animation: scale-in 0.5s ease-out both;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .weather-detail-item:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        
        .detail-icon {
          transition: transform 0.3s ease;
        }
        
        .weather-detail-item:hover .detail-icon {
          transform: scale(1.2);
        }
        
        .wind-arrow {
          display: inline-block;
          font-size: 1.5rem;
          transition: transform 1s ease;
        }
        
        .sun-position {
          z-index: 1;
        }
        
        .sun-indicator {
          animation: pulse 2s infinite alternate ease-in-out;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
        }
        
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.8;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

// 计算太阳位置的百分比
function calculateSunPosition(sunrise, sunset) {
  const now = new Date();
  const sunriseTime = parseTimeString(sunrise);
  const sunsetTime = parseTimeString(sunset);
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  // 如果当前时间在日出前或日落后，返回边界值
  if (currentTime < sunriseTime) return 0;
  if (currentTime > sunsetTime) return 100;
  
  // 计算百分比位置
  const dayLength = sunsetTime - sunriseTime;
  const timeElapsed = currentTime - sunriseTime;
  return (timeElapsed / dayLength) * 100;
}

// 将时间字符串解析为分钟数
function parseTimeString(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export default WeatherDetails;
