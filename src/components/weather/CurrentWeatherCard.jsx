import React, { useEffect, useRef, useState } from 'react';
import { useWeather } from '../../contexts/WeatherContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

/**
 * 当前天气卡片组件 - 使用液体玻璃效果和3D动画展示当前天气信息
 */
const CurrentWeatherCard = () => {
  const { weather } = useWeather();
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  
  // 3D倾斜效果
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      
      // 计算鼠标相对于卡片的位置 (-1 到 1)
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      
      // 更新旋转状态
      setRotation({
        x: y * -10, // 反转Y轴使倾斜方向更自然
        y: x * 10
      });
      
      // 更新CSS变量
      card.style.setProperty('--mouse-x', (x * 0.5 + 0.5).toFixed(2));
      card.style.setProperty('--mouse-y', (y * 0.5 + 0.5).toFixed(2));
    };
    
    const handleMouseLeave = () => {
      // 重置旋转
      setRotation({ x: 0, y: 0 });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    cardRef.current?.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cardRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
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

  // 3D天气图标组件
  const WeatherIcon = () => {
    const meshRef = useRef();
    
    // 动画帧更新
    useFrame((state, delta) => {
      if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.5;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      }
    });
    
    // 根据天气状况返回不同的3D模型
    const renderWeatherModel = () => {
      switch(weather.condition) {
        case 'sunny':
        case 'clear':
          return (
            <group ref={meshRef}>
              <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial 
                  color="#ffaa44" 
                  emissive="#ffaa44"
                  emissiveIntensity={0.5}
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
              <pointLight intensity={5} distance={10} color="#ffaa44" />
            </group>
          );
        case 'partly-cloudy':
          return (
            <group ref={meshRef}>
              <mesh position={[0.5, 0, 0]}>
                <sphereGeometry args={[0.7, 32, 32]} />
                <meshStandardMaterial 
                  color="#ffaa44" 
                  emissive="#ffaa44"
                  emissiveIntensity={0.3}
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
              <mesh position={[-0.5, 0, 0.5]}>
                <sphereGeometry args={[0.8, 32, 32]} />
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
              {[0, 0.8, -0.8].map((x, i) => (
                <mesh key={i} position={[x, Math.sin(i) * 0.3, 0]}>
                  <sphereGeometry args={[0.7, 32, 32]} />
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
              <mesh position={[0, 0.3, 0]}>
                <sphereGeometry args={[0.7, 32, 32]} />
                <meshStandardMaterial 
                  color="white" 
                  roughness={0.2}
                  metalness={0.1}
                />
              </mesh>
              {[0, 0.4, -0.4].map((x, i) => (
                <mesh key={i} position={[x, -0.5, 0]} rotation={[0.5, 0, 0]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.7, 16]} />
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
              <mesh position={[0, 0.3, 0]}>
                <sphereGeometry args={[0.7, 32, 32]} />
                <meshStandardMaterial 
                  color="#444444" 
                  roughness={0.2}
                  metalness={0.3}
                />
              </mesh>
              <mesh position={[0, -0.5, 0]}>
                <tetrahedronGeometry args={[0.5, 0]} />
                <meshStandardMaterial 
                  color="#ffff00" 
                  emissive="#ffff00"
                  emissiveIntensity={0.5}
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
              <pointLight position={[0, -0.5, 0]} intensity={3} distance={5} color="#ffff00" />
            </group>
          );
        case 'snow':
          return (
            <group ref={meshRef}>
              <mesh position={[0, 0.5, 0]}>
                <sphereGeometry args={[0.7, 32, 32]} />
                <meshStandardMaterial 
                  color="white" 
                  roughness={0.2}
                  metalness={0.1}
                />
              </mesh>
              {[0, 0.4, -0.4].map((x, i) => (
                <mesh key={i} position={[x, -0.5, 0]}>
                  <octahedronGeometry args={[0.2, 0]} />
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
              <sphereGeometry args={[1, 32, 32]} />
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
        stiffness: 300,
        damping: 30
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
        {/* 3D天气图标 */}
        <div className="weather-icon-3d mb-4" style={{ width: '120px', height: '120px' }}>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <WeatherIcon />
          </Canvas>
        </div>
        
        {/* 温度 - 添加发光效果 */}
        <motion.div 
          className="temperature-value mb-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        >
          {weather.temperature}°
        </motion.div>
        
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
        
        .raindrop-on-card {
          position: absolute;
          background: radial-gradient(circle at center, rgba(255,255,255,0.9), rgba(255,255,255,0.5));
          border-radius: 50%;
          box-shadow: 0 0 5px rgba(255,255,255,0.5);
          transition: transform 1s ease, opacity 1s ease;
        }
      `}</style>
    </motion.div>
  );
};

export default CurrentWeatherCard;
