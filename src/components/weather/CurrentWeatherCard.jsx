import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useWeather } from '../../contexts/WeatherContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * 当前天气卡片组件 - 性能优化版本
 * 移除内部Canvas以避免额外的WebGL上下文，优化鼠标事件处理
 */
const CurrentWeatherCard = () => {
  const { weather } = useWeather();
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const lastUpdateTime = useRef(0);
  const animationFrameId = useRef(null);
  
  // 安全获取天气数据，避免undefined错误
  const safeWeather = useMemo(() => ({
    location: weather?.location || '北京市',
    temperature: weather?.temperature || 25,
    feelsLike: weather?.feelsLike || 27,
    condition: weather?.condition || 'sunny',
    description: weather?.description || '晴朗',
    highTemp: weather?.highTemp || 30,
    lowTemp: weather?.lowTemp || 20,
    updatedTime: weather?.updatedTime || new Date().toLocaleString('zh-CN')
  }), [weather]);
  
  // 性能优化：节流的鼠标移动处理
  const throttledMouseMove = useCallback((e) => {
    const now = performance.now();
    if (now - lastUpdateTime.current < 16) { // 限制为60fps
      return;
    }
    lastUpdateTime.current = now;
    
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // 计算鼠标相对于卡片的位置 (-1 到 1)
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    
    // 使用requestAnimationFrame来更新状态，避免阻塞主线程
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    animationFrameId.current = requestAnimationFrame(() => {
      setRotation({
        x: y * -5, // 减小倾斜角度，减少视觉干扰
        y: x * 5
      });
      
      // 更新CSS变量
      card.style.setProperty('--mouse-x', (x * 0.5 + 0.5).toFixed(2));
      card.style.setProperty('--mouse-y', (y * 0.5 + 0.5).toFixed(2));
    });
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    // 重置旋转
    setRotation({ x: 0, y: 0 });
    if (cardRef.current) {
      cardRef.current.style.setProperty('--mouse-x', '0.5');
      cardRef.current.style.setProperty('--mouse-y', '0.5');
    }
  }, []);
  
  // 优化的3D倾斜效果 - 只在卡片上监听，而不是全局
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    card.addEventListener('mousemove', throttledMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', throttledMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [throttledMouseMove, handleMouseLeave]);
  
  // 性能优化：简化的天气特效，使用CSS动画代替JavaScript
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    // 移除之前的特效类
    card.classList.remove('rain-effect', 'snow-effect', 'thunder-effect');
    
    // 根据天气状况添加CSS特效类
    if (['rainy', 'drizzle', 'thunderstorm'].includes(safeWeather.condition)) {
      card.classList.add('rain-effect');
    } else if (safeWeather.condition === 'snow') {
      card.classList.add('snow-effect');
    } else if (safeWeather.condition === 'thunderstorm') {
      card.classList.add('thunder-effect');
    }
    
    return () => {
      card.classList.remove('rain-effect', 'snow-effect', 'thunder-effect');
    };
  }, [safeWeather.condition]);

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
      ref={cardRef}
      className="liquid-glass liquid-card weather-card current-weather-card liquid-3d"
      style={{
        '--card-highlight-x': 'calc(var(--mouse-x, 0.5) * 100%)',
        '--card-highlight-y': 'calc(var(--mouse-y, 0.5) * 100%)'
      }}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y
      }}
      transition={{
        type: "spring",
        stiffness: 200, // 降低弹性，减少计算
        damping: 25
      }}
    >
      {/* 动态高光效果 */}
      <div className="card-highlight" />
      
      <div className="liquid-card-header">
        <h2 className="text-2xl font-bold text-white/90 flex items-center">
          <span className="mr-2">{t('currentWeather')}</span>
          <span className="text-sm font-normal text-white/70">{safeWeather.location}</span>
        </h2>
      </div>
      
      <div className="liquid-card-content flex flex-col items-center py-6">
        {/* 优化的天气图标 - 使用CSS动画代替3D Canvas */}
        <motion.div 
          className="weather-icon-emoji mb-4"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: "easeInOut"
          }}
        >
          {getWeatherIcon(safeWeather.condition)}
        </motion.div>
        
        {/* 温度 - 添加发光效果 */}
        <motion.div 
          className="temperature-value mb-2"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        >
          {safeWeather.temperature}°
        </motion.div>
        
        {/* 天气状况 */}
        <div className="text-white/80 mb-4 text-xl">
          {t(`weather.${safeWeather.condition}`)}
        </div>
        
        {/* 最高/最低温度 */}
        <div className="flex justify-between w-full text-white/70 text-sm">
          <span>{t('highTemp')}: {safeWeather.highTemp}°</span>
          <span>{t('lowTemp')}: {safeWeather.lowTemp}°</span>
        </div>
      </div>
      
      <div className="liquid-card-footer">
        <div className="flex justify-between text-white/60 text-sm">
          <span>{t('feelsLike')}: {safeWeather.feelsLike}°</span>
          <span>{t('updated')}: {safeWeather.updatedTime}</span>
        </div>
      </div>
      
      <style jsx>{`
        .current-weather-card {
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
          perspective: 1000px;
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
        }
        
        .weather-icon-emoji {
          font-size: 4rem;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }
        
        /* CSS特效动画 - 性能友好的替代方案 */
        .rain-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            transparent 0%,
            rgba(135, 206, 250, 0.1) 50%,
            transparent 100%
          );
          animation: rain-animation 2s infinite linear;
          pointer-events: none;
        }
        
        .snow-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at 20% 20%, rgba(255,255,255,0.3) 2px, transparent 2px
          ),
          radial-gradient(
            circle at 80% 40%, rgba(255,255,255,0.2) 1px, transparent 1px
          ),
          radial-gradient(
            circle at 40% 80%, rgba(255,255,255,0.3) 2px, transparent 2px
          );
          animation: snow-animation 3s infinite linear;
          pointer-events: none;
        }
        
        .thunder-effect {
          animation: thunder-flash 0.5s infinite alternate;
        }
        
        @keyframes rain-animation {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes snow-animation {
          0% { transform: translateY(-100%) rotate(0deg); }
          100% { transform: translateY(100%) rotate(360deg); }
        }
        
        @keyframes thunder-flash {
          0% { box-shadow: inset 0 0 20px rgba(255,255,0,0.1); }
          100% { box-shadow: inset 0 0 20px rgba(255,255,0,0.3); }
        }
      `}</style>
    </motion.div>
  );
};

export default CurrentWeatherCard;

