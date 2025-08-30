import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useWeather } from '../../contexts/WeatherContext';
import { useTheme } from '../../contexts/ThemeContext';
import * as THREE from 'three';
import { Sparkles, Cloud, Environment } from '@react-three/drei';

/**
 * 3D天气背景组件 - 性能优化版本
 * 解决性能瓶颈，减少不必要的计算和渲染，实现高效的动画节流
 */
const WeatherBackground = () => {
  const { weather, timeOfDay } = useWeather();
  const { theme } = useTheme();
  const { scene } = useThree();
  
  // 引用对象
  const cloudsRef = useRef();
  const rainRef = useRef();
  const snowRef = useRef();
  const sunRef = useRef();
  const moonRef = useRef();
  const skyRef = useRef();
  
  // 性能优化：动画节流控制
  const lastUpdateTime = useRef(0);
  const animationSpeed = useRef(1);
  const frameCount = useRef(0);
  const skipFrames = useRef(0);
  
  // 性能优化：缓存计算结果
  const cachedTimePosition = useRef(new Map());
  const cachedWeatherChecks = useRef({});
  const lastWeatherCondition = useRef(weather.condition);
  const lastTimeOfDay = useRef(timeOfDay);
  
  // 性能监控
  const performanceStats = useRef({
    frameTime: 0,
    lastFrameStart: 0,
    avgFrameTime: 0,
    frameCount: 0
  });
  
  // 性能优化：使用useMemo缓存天空颜色计算，减少重复计算
  const skyColor = useMemo(() => {
    const colors = {
      morning: { light: 0x88b6e0, dark: 0x1a3c6e },
      noon: { light: 0x4a9be8, dark: 0x2a5ca8 },
      afternoon: { light: 0x7a97d0, dark: 0x4a3c78 },
      night: { light: 0x1a2535, dark: 0x0a1525 }
    };
    
    const colorSet = colors[timeOfDay] || colors.noon;
    return new THREE.Color(theme === 'dark' ? colorSet.dark : colorSet.light);
  }, [timeOfDay, theme]);
  
  // 性能优化：缓存时间位置计算
  const getTimePosition = useCallback((time) => {
    if (cachedTimePosition.current.has(time)) {
      return cachedTimePosition.current.get(time);
    }
    
    const positions = {
      morning: Math.PI * 0.75,
      noon: Math.PI * 0.5,
      afternoon: Math.PI * 0.25,
      night: Math.PI * 0
    };
    
    const position = positions[time] || positions.noon;
    cachedTimePosition.current.set(time, position);
    return position;
  }, []);
  
  // 初始化场景 - 优化为只在必要时更新
  useEffect(() => {
    if (scene) {
      // 使用更轻量的雾效果
      scene.fog = new THREE.FogExp2(skyColor, 0.005);
      scene.background = skyColor;
    }
    
    return () => {
      if (scene) {
        scene.fog = null;
      }
    };
  }, [scene, skyColor]);
  
  // 性能优化：极简化的帧率控制和动画节流
  useFrame((state, delta) => {
    // 性能监控
    const frameStart = performance.now();
    
    // 激进的跳帧策略 - 每5帧才更新一次，大幅减少CPU负载
    skipFrames.current++;
    if (skipFrames.current < 5) {
      return;
    }
    skipFrames.current = 0;
    
    // 固定delta值，避免每帧计算
    const fixedDelta = 0.016 * 5; // 5帧的累积时间
    
    // 简化的动画更新 - 移除复杂的性能检测
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += fixedDelta * 0.01;
    }
    
    // 缓存天气条件检查，避免每帧重复计算
    if (weather.condition !== lastWeatherCondition.current) {
      cachedWeatherChecks.current = {
        isRainy: ['rainy', 'drizzle', 'thunderstorm'].includes(weather.condition),
        isSnowy: weather.condition === 'snow',
        isSunny: ['sunny', 'clear', 'partly-cloudy'].includes(weather.condition)
      };
      lastWeatherCondition.current = weather.condition;
    }
    
    // 使用缓存的条件检查
    if (rainRef.current && cachedWeatherChecks.current.isRainy) {
      rainRef.current.rotation.y += fixedDelta * 0.03;
    }
    
    if (snowRef.current && cachedWeatherChecks.current.isSnowy) {
      snowRef.current.rotation.y += fixedDelta * 0.02;
    }
    
    // 太阳位置更新 - 只在时间变化时更新
    if (sunRef.current && cachedWeatherChecks.current.isSunny && timeOfDay !== 'night') {
      if (timeOfDay !== lastTimeOfDay.current) {
        const timePosition = getTimePosition(timeOfDay);
        sunRef.current.position.x = Math.sin(timePosition) * 12;
        sunRef.current.position.y = Math.cos(timePosition) * 12 + 5;
        lastTimeOfDay.current = timeOfDay;
      }
    }
    
    // 月亮动画 - 极简化
    if (moonRef.current && timeOfDay === 'night') {
      moonRef.current.rotation.y += fixedDelta * 0.003;
    }
    
    // 性能监控 - 记录帧时间
    const frameEnd = performance.now();
    const frameTime = frameEnd - frameStart;
    performanceStats.current.frameTime = frameTime;
    performanceStats.current.frameCount++;
    
    // 每100帧输出一次性能统计
    if (performanceStats.current.frameCount % 100 === 0) {
      performanceStats.current.avgFrameTime = 
        (performanceStats.current.avgFrameTime + frameTime) / 2;
      
      if (performanceStats.current.avgFrameTime > 5) {
        console.warn(`WeatherBackground frame time: ${performanceStats.current.avgFrameTime.toFixed(2)}ms`);
      }
    }
  });
  
  // 性能优化：极简化粒子效果，大幅减少粒子数量
  const weatherEffect = useMemo(() => {
    const effects = {
      rainy: {
        count: 30, // 极大幅减少粒子数量
        size: 1.2,
        speed: 4,
        color: "#88ccff",
        scale: [10, 10, 10]
      },
      drizzle: {
        count: 20,
        size: 0.8,
        speed: 3,
        color: "#aaccff",
        scale: [8, 8, 8]
      },
      thunderstorm: {
        count: 40,
        size: 1.5,
        speed: 6,
        color: "#88ccff",
        scale: [12, 12, 12]
      },
      snow: {
        count: 25,
        size: 2,
        speed: 0.5,
        color: "#ffffff",
        scale: [10, 10, 10]
      }
    };
    
    const effect = effects[weather.condition];
    if (!effect) return null;
    
    return (
      <group ref={weather.condition === 'snow' ? snowRef : rainRef}>
        <Sparkles 
          count={effect.count}
          size={effect.size}
          speed={effect.speed}
          opacity={0.5}
          scale={effect.scale}
          noise={[1, 1, 1]} // 极简化噪声复杂度
          color={effect.color}
        />
        {weather.condition === 'thunderstorm' && (
          <pointLight 
            position={[0, 8, 0]} 
            intensity={3} // 降低光照强度
            color="#ffffff"
            distance={15}
            decay={1.5}
          />
        )}
      </group>
    );
  }, [weather.condition]);
  
  // 性能优化：极简化云层渲染，大幅减少云朵数量
  const clouds = useMemo(() => {
    const cloudConfigs = {
      cloudy: { count: 3, opacity: 0.6 },
      'partly-cloudy': { count: 2, opacity: 0.4 },
      rainy: { count: 3, opacity: 0.7 },
      drizzle: { count: 2, opacity: 0.5 },
      thunderstorm: { count: 4, opacity: 0.8 },
      snow: { count: 2, opacity: 0.5 }
    };
    
    const config = cloudConfigs[weather.condition];
    if (!config) return null;
    
    // 预计算云朵位置，避免每次渲染时重新计算
    const cloudPositions = Array.from({ length: config.count }, (_, i) => {
      const angle = (i / config.count) * Math.PI * 2;
      return [
        Math.cos(angle) * (8 + Math.random() * 4),
        3 + Math.random() * 3,
        Math.sin(angle) * (8 + Math.random() * 4)
      ];
    });
    
    return (
      <group ref={cloudsRef}>
        {cloudPositions.map((position, i) => (
          <Cloud 
            key={i}
            position={position}
            opacity={config.opacity}
            speed={0.1} // 极大减慢云朵内部动画
            width={4} // 进一步减小云朵尺寸
            depth={0.5}
            segments={3} // 极简化几何体复杂度
          />
        ))}
      </group>
    );
  }, [weather.condition]);
  
  // 性能优化：使用useMemo缓存天体渲染，避免重复创建
  const celestialBodies = useMemo(() => {
    if (timeOfDay === 'night') {
      return (
        <group ref={moonRef} position={[8, 6, -8]}>
          <mesh>
            <sphereGeometry args={[1.5, 8, 8]} /> {/* 极简化几何体复杂度 */}
            <meshStandardMaterial 
              color="#e8e8ff" 
              emissive="#666688"
              emissiveIntensity={0.3}
              roughness={0.8}
              metalness={0}
            />
          </mesh>
        </group>
      );
    } else if (['sunny', 'clear', 'partly-cloudy'].includes(weather.condition)) {
      const sunColor = timeOfDay === 'afternoon' ? '#ffaa44' : '#ffffff';
      return (
        <group ref={sunRef} position={[0, 12, 0]}>
          <pointLight 
            intensity={3} // 降低光照强度
            distance={40} 
            decay={1.5}
            color={sunColor}
          />
          <mesh>
            <sphereGeometry args={[1.2, 8, 8]} /> {/* 极简化几何体复杂度 */}
            <meshBasicMaterial 
              color={sunColor} 
              toneMapped={false}
            />
          </mesh>
          <Sparkles 
            count={3} // 极简化粒子数量
            size={4}
            scale={[2, 2, 2]}
            speed={0.1}
            color={sunColor}
          />
        </group>
      );
    }
    return null;
  }, [timeOfDay, weather.condition]);
  
  return (
    <group>
      {/* 环境光照 - 优化强度 */}
      <ambientLight intensity={timeOfDay === 'night' ? 0.15 : 0.4} />
      
      {/* 方向光 - 简化配置 */}
      <directionalLight 
        position={[3, 8, 3]} 
        intensity={timeOfDay === 'night' ? 0.05 : 0.8} 
        castShadow={false} // 禁用阴影以提高性能
      />
      
      {/* 天空背景 - 极简化几何体 */}
      <mesh ref={skyRef} position={[0, 0, -15]}>
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial 
          color={skyColor} 
          side={THREE.FrontSide}
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* 使用缓存的渲染结果 */}
      {clouds}
      {weatherEffect}
      {celestialBodies}
      
      {/* 环境HDRI - 使用性能友好的预设 */}
      <Environment 
        preset={timeOfDay === 'night' ? 'night' : 'dawn'} 
        background={false} // 不使用环境作为背景，减少渲染负载
      />
    </group>
  );
};

export default WeatherBackground;

