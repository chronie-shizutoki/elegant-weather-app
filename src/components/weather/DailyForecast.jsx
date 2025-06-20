import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useWeather } from '../../contexts/WeatherContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * 每日预报组件 - 性能优化版本
 * 移除所有Canvas以避免WebGL上下文泄漏，使用CSS图标代替3D动画
 */
const DailyForecast = () => {
  const { dailyForecast } = useWeather();
  const { t } = useTranslation();
  const containerRef = useRef(null);
  
  // 安全获取预报数据，避免undefined错误
  const safeDailyForecast = useMemo(() => {
    return dailyForecast || Array(7).fill().map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const day = index === 0 ? '今天' : index === 1 ? '明天' : weekdays[date.getDay()];
      
      const maxTemp = Math.floor(Math.random() * 10) + 20;
      const minTemp = maxTemp - Math.floor(Math.random() * 10) - 5;
      
      return {
        date: date.toLocaleDateString('zh-CN'),
        day,
        condition: 'sunny',
        dayWeatherType: 'sunny',
        nightWeatherType: 'clear',
        highTemp: maxTemp,
        lowTemp: minTemp,
        maxTemp,
        minTemp,
        precipitation: Math.floor(Math.random() * 30),
        windSpeed: Math.floor(Math.random() * 5) + 1,
        airQuality: {
          level: '良'
        }
      };
    });
  }, [dailyForecast]);
  
  // 性能优化：简化的交互动画效果
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const items = container.querySelectorAll('.daily-forecast-item');
    
    // 为每个项目添加悬停效果
    const handleMouseEnter = (item) => () => {
      // 高亮当前项
      item.classList.add('active');
      
      // 淡化其他项
      items.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.add('inactive');
        }
      });
    };
    
    const handleMouseLeave = (item) => () => {
      // 恢复所有项
      item.classList.remove('active');
      items.forEach(otherItem => {
        otherItem.classList.remove('inactive');
      });
    };
    
    items.forEach(item => {
      const enterHandler = handleMouseEnter(item);
      const leaveHandler = handleMouseLeave(item);
      
      item.addEventListener('mouseenter', enterHandler);
      item.addEventListener('mouseleave', leaveHandler);
      
      // 存储处理器以便清理
      item._enterHandler = enterHandler;
      item._leaveHandler = leaveHandler;
    });
    
    return () => {
      items.forEach(item => {
        if (item._enterHandler) {
          item.removeEventListener('mouseenter', item._enterHandler);
        }
        if (item._leaveHandler) {
          item.removeEventListener('mouseleave', item._leaveHandler);
        }
      });
    };
  }, [safeDailyForecast]);
  
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
  
  // 计算温度条的百分比宽度
  const calculateTempPercentage = useCallback((low, high) => {
    // 假设温度范围在-20°C到50°C之间
    const totalRange = 70; // 50 - (-20)
    const range = high - low;
    return Math.max(10, (range / totalRange) * 100); // 最小10%宽度
  }, []);
  
  // 计算温度条的偏移量
  const calculateTempOffset = useCallback((low) => {
    // 假设温度范围在-20°C到50°C之间
    const minTemp = -20;
    const totalRange = 70; // 50 - (-20)
    return Math.max(0, Math.min(90, ((low - minTemp) / totalRange) * 100));
  }, []);
  
  return (
    <motion.div 
      ref={containerRef} 
      className="liquid-glass liquid-card weather-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="liquid-card-header">
        <h3 className="text-xl font-semibold text-white/90">{t('dailyForecast')}</h3>
      </div>
      
      <div className="daily-forecast-list space-y-3 py-2">
        {safeDailyForecast.map((day, index) => (
          <motion.div 
            key={index} 
            className="daily-forecast-item liquid-glass p-3 rounded-xl flex items-center justify-between liquid-3d-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: index * 0.03, // 减少延迟
              duration: 0.4, // 缩短动画时间
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.02,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              transition: { duration: 0.2 }
            }}
          >
            {/* 日期 */}
            <div className="day-info flex-shrink-0 w-20">
              <div className="text-white font-medium">{day.day}</div>
              <div className="text-white/70 text-sm">{day.date}</div>
            </div>
            
            {/* 优化的天气图标 - 使用CSS动画代替3D Canvas */}
            <motion.div 
              className="weather-icon-emoji flex-shrink-0"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4 + index * 0.2, // 错开动画时间
                ease: "easeInOut"
              }}
            >
              {getWeatherIcon(day.condition)}
            </motion.div>
            
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
                <motion.div 
                  className="absolute top-0 h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${calculateTempPercentage(day.lowTemp, day.highTemp)}%`,
                    left: `${calculateTempOffset(day.lowTemp)}%`
                  }}
                  transition={{ duration: 0.8, delay: index * 0.03 + 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <style jsx>{`
        .daily-forecast-item {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
          transform-origin: center left;
          will-change: transform, opacity; /* 优化渲染性能 */
        }
        
        .daily-forecast-item.active {
          transform: scale(1.03) translateZ(10px);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        
        .daily-forecast-item.inactive {
          opacity: 0.7;
          filter: saturate(0.8);
        }
        
        .weather-icon-emoji {
          font-size: 1.8rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
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
    </motion.div>
  );
};

export default DailyForecast;

