import React, { useEffect, useRef, useState } from 'react';
import { useWeather } from '../../contexts/WeatherContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

/**
 * 天气详情组件 - 使用液体玻璃效果和3D动画展示详细天气数据
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
  
  // 安全获取天气数据，避免undefined错误
  const safeWeather = {
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
  };
  
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
  
  const aqiInfo = getAqiInfo(safeWeather.airQuality.aqi);
  const uvInfo = getUvInfo(safeWeather.uvIndex);
  
  // 3D指示器组件
  const Indicator3D = ({ value, maxValue, color }) => {
    const meshRef = useRef();
    const percentage = Math.min(value / maxValue, 1);
    
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        meshRef.current.scale.x = 0.5 + percentage * 0.5;
        meshRef.current.scale.y = 0.5 + percentage * 0.5;
        meshRef.current.scale.z = 0.5 + percentage * 0.5;
      }
    });
    
    return (
      <mesh ref={meshRef}>
        <torusGeometry args={[1, 0.3, 16, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    );
  };
  
  // 风向指示器组件
  const WindDirectionIndicator = ({ direction }) => {
    const meshRef = useRef();
    
    useFrame((state) => {
      if (meshRef.current) {
        // 平滑旋转到目标方向
        const targetRotation = THREE.MathUtils.degToRad(direction);
        meshRef.current.rotation.z = THREE.MathUtils.lerp(
          meshRef.current.rotation.z,
          targetRotation,
          0.05
        );
      }
    });
    
    return (
      <group ref={meshRef}>
        <mesh position={[0, 0.8, 0]}>
          <coneGeometry args={[0.5, 1, 16]} />
          <meshStandardMaterial 
            color="#88ccff" 
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1, 16]} />
          <meshStandardMaterial 
            color="#88ccff" 
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      </group>
    );
  };
  
  // 日出日落指示器组件
  const SunPositionIndicator = ({ sunrise, sunset }) => {
    const meshRef = useRef();
    const sunRef = useRef();
    const percentage = calculateSunPosition(sunrise, sunset);
    
    useFrame((state) => {
      if (sunRef.current) {
        // 计算太阳在路径上的位置
        const angle = Math.PI * percentage;
        const x = Math.cos(angle) * 2;
        const y = Math.sin(angle) * 1.5;
        
        sunRef.current.position.x = x;
        sunRef.current.position.y = y;
        
        // 添加轻微的浮动效果
        sunRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.05;
      }
    });
    
    return (
      <group ref={meshRef}>
        {/* 太阳路径 */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2, 0.05, 16, 32, Math.PI]} />
          <meshStandardMaterial 
            color="#ffaa44" 
            opacity={0.3}
            transparent
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
        
        {/* 太阳 */}
        <mesh ref={sunRef} position={[2, 0, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color="#ffaa44" 
            emissive="#ffaa44"
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.8}
          />
          <pointLight intensity={2} distance={5} color="#ffaa44" />
        </mesh>
      </group>
    );
  };
  
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
          <div className="detail-icon text-2xl mb-2">💧</div>
          <div className="text-white/70 text-sm">{t('humidity')}</div>
          <div className="text-white font-semibold text-lg">{safeWeather.humidity}%</div>
          <div className="liquid-progress mt-2">
            <motion.div 
              className="liquid-progress-bar"
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
          <div className="detail-icon text-2xl mb-2">💨</div>
          <div className="text-white/70 text-sm">{t('windSpeed')}</div>
          <div className="text-white font-semibold text-lg">{safeWeather.windSpeed} km/h</div>
          <div className="wind-direction mt-2" style={{ height: '60px' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <WindDirectionIndicator direction={safeWeather.windDirection} />
            </Canvas>
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
          <div className="detail-icon text-2xl mb-2">👁️</div>
          <div className="text-white/70 text-sm">{t('visibility')}</div>
          <div className="text-white font-semibold text-lg">{safeWeather.visibility} km</div>
          <div className="liquid-progress mt-2">
            <motion.div 
              className="liquid-progress-bar"
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
          <div className="detail-icon text-2xl mb-2">🌡️</div>
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
          <div className="detail-icon text-2xl mb-2">🌬️</div>
          <div className="text-white/70 text-sm">{t('airQuality')}</div>
          <div className="text-white font-semibold text-lg flex items-center justify-center">
            <span className="mr-2">{safeWeather.airQuality.aqi}</span>
            <span className="text-sm font-normal">({safeWeather.airQuality.level})</span>
          </div>
          <div style={{ height: '60px' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <Indicator3D 
                value={safeWeather.airQuality.aqi} 
                maxValue={300} 
                color={safeWeather.airQuality.aqi <= 50 ? "#4ade80" : 
                       safeWeather.airQuality.aqi <= 100 ? "#facc15" : 
                       safeWeather.airQuality.aqi <= 150 ? "#fb923c" : 
                       safeWeather.airQuality.aqi <= 200 ? "#f87171" : 
                       safeWeather.airQuality.aqi <= 300 ? "#c084fc" : "#fb7185"} 
              />
            </Canvas>
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
          <div className="detail-icon text-2xl mb-2">☀️</div>
          <div className="text-white/70 text-sm">{t('uvIndex')}</div>
          <div className="text-white font-semibold text-lg flex items-center justify-center">
            <span className="mr-2">{safeWeather.uvIndex}</span>
            <span className="text-sm font-normal">({uvInfo.description})</span>
          </div>
          <div style={{ height: '60px' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <Indicator3D 
                value={safeWeather.uvIndex} 
                maxValue={11} 
                color={safeWeather.uvIndex <= 2 ? "#4ade80" : 
                       safeWeather.uvIndex <= 5 ? "#facc15" : 
                       safeWeather.uvIndex <= 7 ? "#fb923c" : 
                       safeWeather.uvIndex <= 10 ? "#f87171" : "#c084fc"} 
              />
            </Canvas>
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
              <div className="detail-icon text-xl">🌅</div>
              <div className="text-white/70 text-xs">{t('sunrise')}</div>
              <div className="text-white font-semibold">{safeWeather.sunrise}</div>
            </div>
            
            <div className="sun-path flex-grow mx-4 relative" style={{ height: '100px' }}>
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <SunPositionIndicator sunrise={safeWeather.sunrise} sunset={safeWeather.sunset} />
              </Canvas>
            </div>
            
            <div className="sunset">
              <div className="detail-icon text-xl">🌇</div>
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
        }
        
        .detail-icon {
          transition: transform 0.3s ease;
        }
        
        .weather-detail-item:hover .detail-icon {
          transform: scale(1.2);
        }
      `}</style>
    </motion.div>
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
  if (currentTime > sunsetTime) return 1;
  
  // 计算百分比位置
  const dayLength = sunsetTime - sunriseTime;
  const timeElapsed = currentTime - sunriseTime;
  return timeElapsed / dayLength;
}

// 将时间字符串解析为分钟数
function parseTimeString(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export default WeatherDetails;
