import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useWeather } from '../../contexts/WeatherContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * 小时预报组件 - 性能优化版本
 * 移除多个Canvas以避免WebGL上下文泄漏，优化滚动事件处理
 */
const HourlyForecast = () => {
  const { hourlyForecast } = useWeather();
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const lastScrollTime = useRef(0);
  const scrollAnimationFrame = useRef(null);
  
  // 安全获取预报数据，避免undefined错误
  const safeHourlyForecast = useMemo(() => {
    return hourlyForecast || Array(24).fill().map((_, index) => ({
      time: new Date(Date.now() + index * 60 * 60 * 1000).getHours(),
      temperature: Math.floor(Math.random() * 10) + 15,
      condition: 'sunny',
      precipitation: Math.floor(Math.random() * 30),
      windSpeed: Math.floor(Math.random() * 5) + 1
    }));
  }, [hourlyForecast]);
  
  // 性能优化：节流的滚动处理
  const throttledScrollHandler = useCallback(() => {
    const now = performance.now();
    if (now - lastScrollTime.current < 16) { // 限制为60fps
      return;
    }
    lastScrollTime.current = now;
    
    const container = scrollRef.current;
    if (!container) return;
    
    // 使用requestAnimationFrame来更新样式，避免阻塞主线程
    if (scrollAnimationFrame.current) {
      cancelAnimationFrame(scrollAnimationFrame.current);
    }
    
    scrollAnimationFrame.current = requestAnimationFrame(() => {
      const items = container.querySelectorAll('.hourly-item');
      const containerRect = container.getBoundingClientRect();
      const centerPosition = containerRect.left + containerRect.width / 2;
      
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance = Math.abs(centerPosition - itemCenter);
        const maxDistance = containerRect.width / 2;
        
        // 简化计算，减少性能开销
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        const scale = 0.9 + (1 - normalizedDistance) * 0.1;
        const opacity = 0.7 + (1 - normalizedDistance) * 0.3;
        
        // 批量更新样式
        item.style.cssText = `
          transform: scale(${scale.toFixed(2)});
          opacity: ${opacity.toFixed(2)};
          transition: transform 0.2s ease, opacity 0.2s ease;
        `;
      });
    });
  }, []);
  
  // 优化的滚动效果
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', throttledScrollHandler, { passive: true });
    // 初始触发一次
    throttledScrollHandler();
    
    return () => {
      container.removeEventListener('scroll', throttledScrollHandler);
      if (scrollAnimationFrame.current) {
        cancelAnimationFrame(scrollAnimationFrame.current);
      }
    };
  }, [throttledScrollHandler]);
  
  // 滚动按钮功能
  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }, []);
  
  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }, []);
  
  // 性能优化：使用CSS图标代替3D Canvas
  const getWeatherIcon = useCallback((condition) => {
    const icons = {
      'sunny': '☀️',
      'clear': '🌞',
      'partly-cloudy': '⛅',
      'cloudy': '☁️',
      'rainy': '🌧️',
      'drizzle': '🌦️',
      'thunderstorm': '⛈️',
      'snow': '❄️',
      'fog': '🌫️',
      'windy': '💨'
    };
    return icons[condition] || '🌤️';
  }, []);
  
  return (
    <motion.div 
      ref={containerRef} 
      className="liquid-glass liquid-card weather-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="liquid-card-header flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white/90">{t('hourlyForecast')}</h3>
        
        {/* 滚动控制按钮 */}
        <div className="flex space-x-2">
          <motion.button 
            onClick={scrollLeft}
            className="liquid-button p-1 rounded-full"
            aria-label={t('scrollLeft')}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </motion.button>
          <motion.button 
            onClick={scrollRight}
            className="liquid-button p-1 rounded-full"
            aria-label={t('scrollRight')}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </motion.button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="hourly-forecast-container flex space-x-4 overflow-x-auto py-4 px-2"
      >
        {safeHourlyForecast.map((item, index) => (
          <motion.div 
            key={index} 
            className="hourly-item flex-shrink-0 text-center liquid-glass p-4 rounded-2xl liquid-3d-item"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.02, // 减少延迟，加快动画
              duration: 0.3, // 缩短动画时间
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
              backgroundColor: "rgba(255, 255, 255, 0.1)"
            }}
          >
            <div className="text-white/70 text-sm mb-2">
              {typeof item.time === 'number' ? `${item.time}:00` : item.time}
            </div>
            
            {/* 优化的天气图标 - 使用CSS动画代替3D Canvas */}
            <motion.div 
              className="weather-icon-emoji mb-2"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3 + index * 0.1, // 错开动画时间
                ease: "easeInOut"
              }}
            >
              {getWeatherIcon(item.condition)}
            </motion.div>
            
            <div className="text-white font-semibold text-lg">{item.temperature}°</div>
            
            {/* 降水概率 */}
            {(item.precipitation > 0) && (
              <div className="precipitation-indicator mt-2">
                <div className="text-blue-300 text-xs">{item.precipitation}%</div>
                <div className="liquid-progress mt-1">
                  <motion.div 
                    className="liquid-progress-bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.precipitation}%` }}
                    transition={{ duration: 0.8, delay: index * 0.02 + 0.3 }}
                  ></motion.div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <style jsx>{`
        .hourly-forecast-container {
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          perspective: 1000px;
        }
        
        .hourly-forecast-container::-webkit-scrollbar {
          display: none;
        }
        
        .hourly-item {
          scroll-snap-align: center;
          transform-style: preserve-3d;
          min-width: 80px;
          will-change: transform, opacity; /* 优化渲染性能 */
        }
        
        .weather-icon-emoji {
          font-size: 2rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }
        
        .precipitation-indicator {
          opacity: 0.9;
          transition: opacity 0.2s ease;
        }
        
        .hourly-item:hover .precipitation-indicator {
          opacity: 1;
        }
        
        .liquid-progress {
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .liquid-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          border-radius: 2px;
          transition: width 0.3s ease;
        }
      `}</style>
    </motion.div>
  );
};

export default HourlyForecast;

