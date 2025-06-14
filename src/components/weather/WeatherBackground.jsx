import React, { useEffect, useRef, useState } from 'react';
import { useWeather } from '../../contexts/WeatherContext';

/**
 * 天气背景组件 - 提供基于天气状况和时间的动态背景和动画效果
 */
const WeatherBackground = () => {
  const containerRef = useRef(null);
  const { weather, timeOfDay } = useWeather();
  const [effects, setEffects] = useState({});
  
  // 根据时间设置背景类
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // 移除所有时间相关类
    container.classList.remove('time-morning', 'time-noon', 'time-afternoon', 'time-night');
    
    // 添加当前时间类
    container.classList.add(`time-${timeOfDay}`);
  }, [timeOfDay]);
  
  // 根据天气状况添加动态效果
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // 清除现有效果
    Object.values(effects).forEach(effect => {
      if (effect && effect.stop) effect.stop();
    });
    
    const newEffects = {};
    
    // 根据天气状况添加效果
    switch(weather.condition) {
      case 'rainy':
      case 'drizzle':
      case 'thunderstorm':
        newEffects.rain = createRainEffect(container, {
          density: weather.condition === 'thunderstorm' ? 60 : 30,
          speed: weather.condition === 'thunderstorm' ? 2 : 1.5
        });
        break;
      case 'snow':
        newEffects.snow = createSnowEffect(container);
        break;
      case 'sunny':
      case 'clear':
        newEffects.sunshine = createSunshineEffect(container, {
          positionX: timeOfDay === 'morning' ? 25 : 
                     timeOfDay === 'noon' ? 50 : 
                     timeOfDay === 'afternoon' ? 75 : 85,
          intensity: timeOfDay === 'night' ? 0.1 : 
                     timeOfDay === 'morning' ? 0.6 : 
                     timeOfDay === 'noon' ? 1 : 0.8
        });
        break;
      case 'cloudy':
      case 'partly-cloudy':
        newEffects.clouds = createCloudEffect(container, {
          count: weather.condition === 'cloudy' ? 7 : 3,
          opacity: timeOfDay === 'night' ? 0.4 : 0.7
        });
        break;
      default:
        break;
    }
    
    setEffects(newEffects);
    
    // 清理函数
    return () => {
      Object.values(newEffects).forEach(effect => {
        if (effect && effect.stop) effect.stop();
      });
    };
  }, [weather.condition, timeOfDay]);
  
  return (
    <div 
      ref={containerRef} 
      className="app-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        transition: 'background 1s ease'
      }}
    />
  );
};

// 创建雨滴效果
function createRainEffect(container, options = {}) {
  const defaults = {
    density: 30,      // 雨滴密度
    speed: 1.5,       // 下落速度倍数
    size: { min: 2, max: 6 }, // 雨滴大小范围
    splashEnabled: true // 是否启用溅落效果
  };
  
  const settings = { ...defaults, ...options };
  const rainEffect = document.createElement('div');
  rainEffect.className = 'rain-effect';
  container.appendChild(rainEffect);
  
  function createRaindrop() {
    const raindrop = document.createElement('div');
    raindrop.className = 'raindrop';
    
    // 随机大小和位置
    const size = Math.random() * (settings.size.max - settings.size.min) + settings.size.min;
    const posX = Math.random() * 100;
    const duration = (Math.random() * 1.5 + 1) / settings.speed;
    
    raindrop.style.width = `${size}px`;
    raindrop.style.height = `${size * 3}px`;
    raindrop.style.left = `${posX}%`;
    raindrop.style.animationDuration = `${duration}s`;
    
    rainEffect.appendChild(raindrop);
    
    // 雨滴溅落效果
    if (settings.splashEnabled) {
      raindrop.addEventListener('animationend', () => {
        createSplash(posX);
        raindrop.remove();
      });
    } else {
      setTimeout(() => raindrop.remove(), duration * 1000);
    }
  }
  
  function createSplash(posX) {
    if (!settings.splashEnabled) return;
    
    const splash = document.createElement('div');
    splash.className = 'raindrop-splash';
    
    const size = Math.random() * 4 + 2;
    const posY = Math.random() * 20 + 80; // 主要在底部区域
    
    splash.style.width = `${size}px`;
    splash.style.height = `${size}px`;
    splash.style.left = `${posX}%`;
    splash.style.top = `${posY}%`;
    
    rainEffect.appendChild(splash);
    
    // 动画结束后移除
    splash.addEventListener('animationend', () => {
      splash.remove();
    });
  }
  
  // 初始化雨滴
  let interval = setInterval(() => {
    createRaindrop();
  }, 100 / (settings.density / 30));
  
  // 返回控制函数
  return {
    stop: () => {
      clearInterval(interval);
      rainEffect.remove();
    },
    updateSettings: (newOptions) => {
      Object.assign(settings, newOptions);
      clearInterval(interval);
      interval = setInterval(() => {
        createRaindrop();
      }, 100 / (settings.density / 30));
    }
  };
}

// 创建雪花效果
function createSnowEffect(container, options = {}) {
  const defaults = {
    density: 40,      // 雪花密度
    speed: 1,         // 下落速度倍数
    size: { min: 3, max: 8 }, // 雪花大小范围
    wind: 20          // 风力大小，影响水平漂移
  };
  
  const settings = { ...defaults, ...options };
  const snowEffect = document.createElement('div');
  snowEffect.className = 'snow-effect';
  container.appendChild(snowEffect);
  
  function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    
    // 随机大小和位置
    const size = Math.random() * (settings.size.max - settings.size.min) + settings.size.min;
    const posX = Math.random() * 100;
    const duration = (Math.random() * 5 + 10) / settings.speed;
    const delay = Math.random() * 5;
    
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    snowflake.style.left = `${posX}%`;
    snowflake.style.animationDuration = `${duration}s`;
    snowflake.style.animationDelay = `${delay}s`;
    
    // 添加随机水平漂移
    const keyframesName = `snowflake-fall-${Math.floor(Math.random() * 1000)}`;
    const drift = (Math.random() - 0.5) * settings.wind;
    
    const keyframes = `
      @keyframes ${keyframesName} {
        0% {
          transform: translateY(-5%) rotate(0deg) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: 0.8;
        }
        90% {
          opacity: 0.8;
        }
        100% {
          transform: translateY(100vh) rotate(360deg) translateX(${drift}px);
          opacity: 0;
        }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    
    snowflake.style.animation = `${keyframesName} ${duration}s linear infinite`;
    
    snowEffect.appendChild(snowflake);
    
    // 动画结束后移除样式表和雪花
    setTimeout(() => {
      document.head.removeChild(styleSheet);
      snowflake.remove();
    }, (duration + delay) * 1000);
  }
  
  // 初始化雪花
  for (let i = 0; i < settings.density; i++) {
    setTimeout(() => {
      createSnowflake();
    }, Math.random() * 5000);
  }
  
  // 持续创建雪花
  let interval = setInterval(() => {
    createSnowflake();
  }, 300 / (settings.density / 40));
  
  // 返回控制函数
  return {
    stop: () => {
      clearInterval(interval);
      snowEffect.remove();
    },
    updateSettings: (newOptions) => {
      Object.assign(settings, newOptions);
      clearInterval(interval);
      interval = setInterval(() => {
        createSnowflake();
      }, 300 / (settings.density / 40));
    }
  };
}

// 创建阳光效果
function createSunshineEffect(container, options = {}) {
  const defaults = {
    positionX: 50,    // 太阳水平位置 (%)
    positionY: 10,    // 太阳垂直位置 (%)
    intensity: 0.7,   // 阳光强度
    rays: 12          // 光线数量
  };
  
  const settings = { ...defaults, ...options };
  
  // 创建阳光基础效果
  const sunshineEffect = document.createElement('div');
  sunshineEffect.className = 'sunshine-effect';
  sunshineEffect.style.setProperty('--sun-position-x', `${settings.positionX}%`);
  sunshineEffect.style.setProperty('--sun-position-y', `${settings.positionY}%`);
  sunshineEffect.style.setProperty('--sun-intensity', settings.intensity);
  container.appendChild(sunshineEffect);
  
  // 创建太阳光芒
  const sunRays = document.createElement('div');
  sunRays.className = 'sun-rays';
  sunRays.style.setProperty('--sun-position-x', `${settings.positionX}%`);
  sunRays.style.setProperty('--sun-position-y', `${settings.positionY}%`);
  container.appendChild(sunRays);
  
  // 返回控制函数
  return {
    stop: () => {
      sunshineEffect.remove();
      sunRays.remove();
    },
    updateSettings: (newOptions) => {
      Object.assign(settings, newOptions);
      sunshineEffect.style.setProperty('--sun-position-x', `${settings.positionX}%`);
      sunshineEffect.style.setProperty('--sun-position-y', `${settings.positionY}%`);
      sunshineEffect.style.setProperty('--sun-intensity', settings.intensity);
      sunRays.style.setProperty('--sun-position-x', `${settings.positionX}%`);
      sunRays.style.setProperty('--sun-position-y', `${settings.positionY}%`);
    }
  };
}

// 创建云朵效果
function createCloudEffect(container, options = {}) {
  const defaults = {
    count: 5,         // 云朵数量
    opacity: 0.7,     // 云朵不透明度
    speed: 1,         // 移动速度倍数
    size: { min: 100, max: 200 } // 云朵大小范围
  };
  
  const settings = { ...defaults, ...options };
  const cloudEffect = document.createElement('div');
  cloudEffect.className = 'cloud-effect';
  container.appendChild(cloudEffect);
  
  function createCloud() {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    
    // 随机大小和位置
    const size = Math.random() * (settings.size.max - settings.size.min) + settings.size.min;
    const posY = Math.random() * 50; // 主要在上半部分
    const duration = (Math.random() * 60 + 60) / settings.speed;
    const delay = Math.random() * 30;
    
    cloud.style.width = `${size}px`;
    cloud.style.height = `${size * 0.6}px`;
    cloud.style.top = `${posY}%`;
    cloud.style.opacity = settings.opacity;
    cloud.style.animationDuration = `${duration}s`;
    cloud.style.animationDelay = `${delay}s`;
    
    cloudEffect.appendChild(cloud);
    
    // 动画结束后重新创建
    setTimeout(() => {
      cloud.remove();
      createCloud();
    }, (duration + delay) * 1000);
  }
  
  // 初始化云朵
  for (let i = 0; i < settings.count; i++) {
    createCloud();
  }
  
  // 返回控制函数
  return {
    stop: () => {
      cloudEffect.remove();
    },
    updateSettings: (newOptions) => {
      Object.assign(settings, newOptions);
      // 更新现有云朵的不透明度
      const clouds = cloudEffect.querySelectorAll('.cloud');
      clouds.forEach(cloud => {
        cloud.style.opacity = settings.opacity;
      });
    }
  };
}

export default WeatherBackground;
