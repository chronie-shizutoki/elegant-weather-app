import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useWeather } from '../../contexts/WeatherContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * 天气详情组件 - 性能优化版本
 * 移除所有Canvas以避免WebGL上下文泄漏，使用CSS动画代替3D效果
 */
const WeatherDetails = () => {
  const { weather } = useWeather();
  const { t } = useTranslation();
  const containerRef = useRef(null);
  
  // 安全获取天气数据，避免undefined错误
  const safeWeather = useMemo(() => ({
    humidity: weather?.humidity || 50,
    windSpeed: weather?.windSpeed || 0,
    windDirection: weather?.windDirection || 0,
    visibility: weather?.visibility || 10,
    pressure: weather?.pressure || 1013,
    airQuality: {
      aqi: weather?.airQuality?.aqi || 50,
      level: weather?.airQuality?.level || '良',
      pm25: weather?.airQuality?.pm25 || 25,
      pm10: weather?.airQuality?.pm10 || 50
    },
    uvIndex: weather?.uvIndex || 5,
    sunrise: weather?.sunrise || '06:30',
    sunset: weather?.sunset || '18:45'
  }), [weather]);
  
  // 获取空气质量指数的颜色和描述
  const getAqiInfo = useCallback((aqi) => {
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
  }, [t]);
  
  // 获取紫外线指数的颜色和描述
  const getUvInfo = useCallback((uv) => {
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
  }, [t]);
  
  // 计算太阳位置百分比
  const calculateSunPosition = useCallback((sunrise, sunset) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [sunriseHour, sunriseMin] = sunrise.split(':').map(Number);
    const [sunsetHour, sunsetMin] = sunset.split(':').map(Number);
    
    const sunriseTime = sunriseHour * 60 + sunriseMin;
    const sunsetTime = sunsetHour * 60 + sunsetMin;
    
    if (currentTime < sunriseTime || currentTime > sunsetTime) {
      return 0; // 夜晚
    }
    
    return (currentTime - sunriseTime) / (sunsetTime - sunriseTime);
  }, []);
  
  const aqiInfo = getAqiInfo(safeWeather.airQuality.aqi);
  const uvInfo = getUvInfo(safeWeather.uvIndex);
  const sunPosition = calculateSunPosition(safeWeather.sunrise, safeWeather.sunset);
  
  return (
    <motion.div 
      ref={containerRef} 
      className="liquid-glass liquid-card weather-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="liquid-card-header">
        <h3 className="text-xl font-semibold text-white/90">{t('weatherDetails')}</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* 湿度 */}
        <motion.div 
          className="weather-detail-item text-center p-3 liquid-glass liquid-3d-item"
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            transition: { duration: 0.2 }
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <motion.div 
            className="detail-icon text-2xl mb-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            💧
          </motion.div>
          <div className="text-white/70 text-sm">{t('humidity')}</div>
          <div className="text-white font-semibold text-lg">{safeWeather.humidity}%</div>
          <div className="liquid-progress mt-2">
            <motion.div 
              className="liquid-progress-bar bg-gradient-to-r from-blue-400 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${safeWeather.humidity}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            ></motion.div>
          </div>
        </motion.div>
        
        {/* 风速 */}
        <motion.div 
          className="weather-detail-item text-center p-3 liquid-glass liquid-3d-item"
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            transition: { duration: 0.2 }
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div 
            className="detail-icon text-2xl mb-2"
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            💨
          </motion.div>
          <div className="text-white/70 text-sm">{t('windSpeed')}</div>
          <div className="text-white font-semibold text-lg">{safeWeather.windSpeed} km/h</div>
          <div className="wind-direction mt-2">
            <motion.div 
              className="wind-arrow"
              animate={{ rotate: safeWeather.windDirection }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              ↑
            </motion.div>
          </div>
        </motion.div>
        
        {/* 能见度 */}
        <motion.div 
          className="weather-detail-item text-center p-3 liquid-glass liquid-3d-item"
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            transition: { duration: 0.2 }
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div 
            className="detail-icon text-2xl mb-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            👁️
          </motion.div>
          <div className="text-white/70 text-sm">{t('visibility')}</div>
          <div className="text-white font-semibold text-lg">{safeWeather.visibility} km</div>
          <div className="liquid-progress mt-2">
            <motion.div 
              className="liquid-progress-bar bg-gradient-to-r from-gray-400 to-gray-600"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(safeWeather.visibility / 10 * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            ></motion.div>
          </div>
        </motion.div>
        
        {/* 气压 */}
        <motion.div 
          className="weather-detail-item text-center p-3 liquid-glass liquid-3d-item"
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            transition: { duration: 0.2 }
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.div 
            className="detail-icon text-2xl mb-2"
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            🌡️
          </motion.div>
          <div className="text-white/70 text-sm">{t('pressure')}</div>
          <div className="text-white font-semibold text-lg">{safeWeather.pressure} hPa</div>
          <div className="pressure-indicator mt-2 text-xs text-white/60">
            {safeWeather.pressure > 1013 ? t('pressure.high') : t('pressure.low')}
          </div>
        </motion.div>
        
        {/* 空气质量 */}
        <motion.div 
          className="weather-detail-item text-center p-3 liquid-glass liquid-3d-item col-span-2"
          whileHover={{ 
            scale: 1.03,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            transition: { duration: 0.2 }
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div 
            className="detail-icon text-2xl mb-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            🌬️
          </motion.div>
          <div className="text-white/70 text-sm">{t('airQuality')}</div>
          <div className="text-white font-semibold text-lg flex items-center justify-center">
            <span className="mr-2">{safeWeather.airQuality.aqi}</span>
            <span className="text-sm font-normal">({safeWeather.airQuality.level})</span>
          </div>
          <div className="aqi-indicator mt-2">
            <motion.div 
              className={`aqi-circle bg-gradient-to-r ${aqiInfo.color}`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              {safeWeather.airQuality.aqi}
            </motion.div>
          </div>
        </motion.div>
        
        {/* 紫外线指数 */}
        <motion.div 
          className="weather-detail-item text-center p-3 liquid-glass liquid-3d-item col-span-2"
          whileHover={{ 
            scale: 1.03,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            transition: { duration: 0.2 }
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.div 
            className="detail-icon text-2xl mb-2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            ☀️
          </motion.div>
          <div className="text-white/70 text-sm">{t('uvIndex')}</div>
          <div className="text-white font-semibold text-lg flex items-center justify-center">
            <span className="mr-2">{safeWeather.uvIndex}</span>
            <span className="text-sm font-normal">({uvInfo.description})</span>
          </div>
          <div className="uv-indicator mt-2">
            <motion.div 
              className={`uv-bar bg-gradient-to-r ${uvInfo.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${(safeWeather.uvIndex / 11) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            ></motion.div>
          </div>
        </motion.div>
        
        {/* 日出日落 */}
        <motion.div 
          className="weather-detail-item text-center p-3 liquid-glass liquid-3d-item col-span-2 md:col-span-4"
          whileHover={{ 
            scale: 1.02,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            transition: { duration: 0.2 }
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <div className="sunrise">
              <motion.div 
                className="detail-icon text-xl"
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                🌅
              </motion.div>
              <div className="text-white/70 text-xs">{t('sunrise')}</div>
              <div className="text-white font-semibold">{safeWeather.sunrise}</div>
            </div>
            
            <div className="sun-path flex-grow mx-4 relative">
              <div className="sun-track"></div>
              <motion.div 
                className="sun-position"
                animate={{ left: `${sunPosition * 100}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                ☀️
              </motion.div>
            </div>
            
            <div className="sunset">
              <motion.div 
                className="detail-icon text-xl"
                animate={{ y: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                🌇
              </motion.div>
              <div className="text-white/70 text-xs">{t('sunset')}</div>
              <div className="text-white font-semibold">{safeWeather.sunset}</div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <style jsx>{`
        .weather-detail-item {
          border-radius: 16px;
          transition: all 0.3s ease;
          transform-style: preserve-3d;
          will-change: transform, opacity; /* 优化渲染性能 */
        }
        
        .detail-icon {
          transition: transform 0.3s ease;
        }
        
        .weather-detail-item:hover .detail-icon {
          transform: scale(1.2);
        }
        
        .liquid-progress {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .liquid-progress-bar {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        
        .wind-arrow {
          font-size: 1.5rem;
          color: #88ccff;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        
        .aqi-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          font-weight: bold;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        
        .uv-bar {
          height: 6px;
          border-radius: 3px;
          transition: width 0.3s ease;
        }
        
        .sun-path {
          height: 40px;
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .sun-track {
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #ff6b35, #f7931e, #ffcc02);
          border-radius: 1px;
          position: relative;
        }
        
        .sun-track::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          border-radius: 2px;
          animation: sun-shine 3s infinite linear;
        }
        
        .sun-position {
          position: absolute;
          top: 50%;
          transform: translateY(-50%) translateX(-50%);
          font-size: 1.2rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          z-index: 1;
        }
        
        @keyframes sun-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
};

export default WeatherDetails;

