import React, { useEffect, useRef } from 'react';
import { useWeather } from '../../contexts/WeatherContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

/**
 * 小时预报组件 - 使用液体玻璃效果和3D动画展示未来24小时天气预报
 */
const HourlyForecast = () => {
  const { hourlyForecast } = useWeather();
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  
  // 安全获取预报数据，避免undefined错误
  const safeHourlyForecast = hourlyForecast || Array(24).fill().map((_, index) => ({
    time: new Date(Date.now() + index * 60 * 60 * 1000).getHours(),
    temperature: Math.floor(Math.random() * 10) + 15,
    condition: 'sunny',
    precipitation: Math.floor(Math.random() * 30),
    windSpeed: Math.floor(Math.random() * 5) + 1
  }));
  
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
        const elevation = Math.max(0, 20 - (distance / maxDistance) * 20);
        
        // 应用变换
        item.style.transform = `scale(${scale}) translateZ(${elevation}px)`;
        item.style.opacity = opacity;
      });
    };
    
    container.addEventListener('scroll', handleScroll);
    // 初始触发一次
    handleScroll();
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [safeHourlyForecast]);
  
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
  
  // 3D天气图标组件
  const WeatherIcon = ({ condition }) => {
    const meshRef = useRef();
    
    // 确保condition有默认值
    const safeCondition = condition || 'sunny';
    
    // 动画帧更新
    useFrame((state, delta) => {
      if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.5;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      }
    });
    
    // 根据天气状况返回不同的3D模型
    const renderWeatherModel = () => {
      switch(safeCondition) {
        case 'sunny':
        case 'clear':
          return (
            <group ref={meshRef}>
              <mesh>
                <sphereGeometry args={[0.7, 32, 32]} />
                <meshStandardMaterial 
                  color="#ffaa44" 
                  emissive="#ffaa44"
                  emissiveIntensity={0.5}
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
              <pointLight intensity={3} distance={5} color="#ffaa44" />
            </group>
          );
        case 'partly-cloudy':
          return (
            <group ref={meshRef}>
              <mesh position={[0.3, 0, 0]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial 
                  color="#ffaa44" 
                  emissive="#ffaa44"
                  emissiveIntensity={0.3}
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
              <mesh position={[-0.3, 0, 0.3]}>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshStandardMaterial 
                  color="white" 
                  roughness={0.2}
                  metalness={0.1}
                />
              </mesh>
            </group>
          );
        case 'cloudy':
          return (
            <group ref={meshRef}>
              {[0, 0.5, -0.5].map((x, i) => (
                <mesh key={i} position={[x, Math.sin(i) * 0.2, 0]}>
                  <sphereGeometry args={[0.5, 32, 32]} />
                  <meshStandardMaterial 
                    color="white" 
                    roughness={0.2}
                    metalness={0.1}
                  />
                </mesh>
              ))}
            </group>
          );
        case 'rainy':
        case 'drizzle':
          return (
            <group ref={meshRef}>
              <mesh position={[0, 0.2, 0]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial 
                  color="white" 
                  roughness={0.2}
                  metalness={0.1}
                />
              </mesh>
              {[0, 0.3, -0.3].map((x, i) => (
                <mesh key={i} position={[x, -0.3, 0]} rotation={[0.5, 0, 0]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.5, 16]} />
                  <meshStandardMaterial 
                    color="#88ccff" 
                    roughness={0.1}
                    metalness={0.8}
                    transparent
                    opacity={0.8}
                  />
                </mesh>
              ))}
            </group>
          );
        case 'thunderstorm':
          return (
            <group ref={meshRef}>
              <mesh position={[0, 0.2, 0]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial 
                  color="#444444" 
                  roughness={0.2}
                  metalness={0.3}
                />
              </mesh>
              <mesh position={[0, -0.3, 0]}>
                <tetrahedronGeometry args={[0.3, 0]} />
                <meshStandardMaterial 
                  color="#ffff00" 
                  emissive="#ffff00"
                  emissiveIntensity={0.5}
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
              <pointLight position={[0, -0.3, 0]} intensity={2} distance={3} color="#ffff00" />
            </group>
          );
        case 'snow':
          return (
            <group ref={meshRef}>
              <mesh position={[0, 0.3, 0]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial 
                  color="white" 
                  roughness={0.2}
                  metalness={0.1}
                />
              </mesh>
              {[0, 0.3, -0.3].map((x, i) => (
                <mesh key={i} position={[x, -0.3, 0]}>
                  <octahedronGeometry args={[0.15, 0]} />
                  <meshStandardMaterial 
                    color="white" 
                    roughness={0.1}
                    metalness={0.2}
                  />
                </mesh>
              ))}
            </group>
          );
        default:
          return (
            <mesh ref={meshRef}>
              <sphereGeometry args={[0.7, 32, 32]} />
              <meshStandardMaterial 
                color="#88ccff" 
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
          );
      }
    };
    
    return (
      <>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        {renderWeatherModel()}
      </>
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
      <div className="liquid-card-header flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white/90">{t('hourlyForecast')}</h3>
        
        {/* 滚动控制按钮 */}
        <div className="flex space-x-2">
          <motion.button 
            onClick={scrollLeft}
            className="liquid-button p-1 rounded-full"
            aria-label={t('scrollLeft')}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
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
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
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
              delay: index * 0.05,
              duration: 0.5,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.15)"
            }}
          >
            <div className="text-white/70 text-sm mb-2">{item.time}</div>
            
            {/* 3D天气图标 */}
            <div className="weather-icon-3d mb-2" style={{ width: '60px', height: '60px' }}>
              <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <WeatherIcon condition={item.condition} />
              </Canvas>
            </div>
            
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
                    transition={{ duration: 1, delay: index * 0.05 + 0.5 }}
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
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform-style: preserve-3d;
          min-width: 80px;
        }
        
        .precipitation-indicator {
          opacity: 0.9;
          transition: opacity 0.3s ease;
        }
        
        .hourly-item:hover .precipitation-indicator {
          opacity: 1;
        }
      `}</style>
    </motion.div>
  );
};

export default HourlyForecast;
