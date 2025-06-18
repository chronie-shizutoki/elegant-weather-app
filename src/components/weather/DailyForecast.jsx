import React, { useEffect, useRef } from 'react';
import { useWeather } from '../../contexts/WeatherContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

/**
 * 每日预报组件 - 使用液体玻璃效果和3D动画展示未来14天天气预报
 */
const DailyForecast = () => {
  const { dailyForecast } = useWeather();
  const { t } = useTranslation();
  const containerRef = useRef(null);
  
  // 安全获取预报数据，避免undefined错误
  const safeDailyForecast = dailyForecast || Array(7).fill().map((_, index) => {
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
  
  // 添加交互动画效果
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const items = container.querySelectorAll('.daily-forecast-item');
    
    // 为每个项目添加悬停效果
    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        // 高亮当前项
        item.classList.add('active');
        
        // 淡化其他项
        items.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.add('inactive');
          }
        });
      });
      
      item.addEventListener('mouseleave', () => {
        // 恢复所有项
        item.classList.remove('active');
        items.forEach(otherItem => {
          otherItem.classList.remove('inactive');
        });
      });
    });
  }, [safeDailyForecast]);
  
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
              delay: index * 0.05,
              duration: 0.5,
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
            
            {/* 3D天气图标 */}
            <div className="weather-icon-3d flex-shrink-0" style={{ width: '50px', height: '50px' }}>
              <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <WeatherIcon condition={day.condition} />
              </Canvas>
            </div>
            
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
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${calculateTempPercentage(day.lowTemp, day.highTemp)}%`,
                    left: `${calculateTempOffset(day.lowTemp)}%`
                  }}
                  transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
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

// 计算温度条的百分比宽度
function calculateTempPercentage(low, high) {
  // 假设温度范围在-20°C到50°C之间
  const totalRange = 70; // 50 - (-20)
  const range = high - low;
  return (range / totalRange) * 100;
}

// 计算温度条的偏移量
function calculateTempOffset(low) {
  // 假设温度范围在-20°C到50°C之间
  const minTemp = -20;
  const totalRange = 70; // 50 - (-20)
  return ((low - minTemp) / totalRange) * 100;
}

export default DailyForecast;
