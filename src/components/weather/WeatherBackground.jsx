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
  
  // 性能优化：缓存计算结果
  const cachedTimePosition = useRef(new Map());
  
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
  
  // 性能优化：智能帧率控制和动画节流
  useFrame((state, delta) => {
    frameCount.current++;
    const currentTime = state.clock.elapsedTime;
    
    // 动态调整更新频率 - 每3帧更新一次动画，减少CPU负载
    if (frameCount.current % 3 !== 0) {
      return;
    }
    
    // 限制delta值，防止大幅跳跃
    const throttledDelta = Math.min(delta, 0.016); // 限制为60fps的delta
    
    // 动态调整动画速度基于性能
    const fps = 1 / delta;
    if (fps < 30) {
      animationSpeed.current = Math.max(0.5, animationSpeed.current * 0.95);
    } else if (fps > 50) {
      animationSpeed.current = Math.min(1, animationSpeed.current * 1.02);
    }
    
    const adjustedDelta = throttledDelta * animationSpeed.current;
    
    // 云朵动画 - 简化计算
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += adjustedDelta * 0.02; // 减慢动画速度
    }
    
    // 条件性动画更新 - 只在相关天气时执行
    const isRainy = ['rainy', 'drizzle', 'thunderstorm'].includes(weather.condition);
    if (rainRef.current && isRainy) {
      rainRef.current.rotation.y += adjustedDelta * 0.05;
    }
    
    const isSnowy = weather.condition === 'snow';
    if (snowRef.current && isSnowy) {
      snowRef.current.rotation.y += adjustedDelta * 0.03;
    }
    
    // 太阳位置更新 - 使用缓存的计算结果
    const isSunny = ['sunny', 'clear', 'partly-cloudy'].includes(weather.condition);
    if (sunRef.current && isSunny && timeOfDay !== 'night') {
      const timePosition = getTimePosition(timeOfDay);
      // 使用更简单的位置计算
      sunRef.current.position.x = Math.sin(timePosition) * 12;
      sunRef.current.position.y = Math.cos(timePosition) * 12 + 5;
    }
    
    // 月亮动画 - 只在夜晚时执行
    if (moonRef.current && timeOfDay === 'night') {
      moonRef.current.rotation.y += adjustedDelta * 0.005; // 非常缓慢的旋转
    }
  });
  
  // 性能优化：使用useMemo缓存天气效果渲染，减少重复创建
  const weatherEffect = useMemo(() => {
    const effects = {
      rainy: {
        count: 100, // 大幅减少粒子数量
        size: 0.8,
        speed: 8,
        color: "#88ccff",
        scale: [15, 15, 15]
      },
      drizzle: {
        count: 60,
        size: 0.5,
        speed: 5,
        color: "#aaccff",
        scale: [12, 12, 12]
      },
      thunderstorm: {
        count: 120,
        size: 1,
        speed: 12,
        color: "#88ccff",
        scale: [18, 18, 18]
      },
      snow: {
        count: 80,
        size: 1.5,
        speed: 1,
        color: "#ffffff",
        scale: [15, 15, 15]
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
          opacity={0.6}
          scale={effect.scale}
          noise={[2, 2, 2]} // 减少噪声复杂度
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
  
  // 性能优化：使用useMemo缓存云层渲染，减少重复计算
  const clouds = useMemo(() => {
    const cloudConfigs = {
      cloudy: { count: 6, opacity: 0.6 },
      'partly-cloudy': { count: 3, opacity: 0.4 },
      rainy: { count: 5, opacity: 0.7 },
      drizzle: { count: 4, opacity: 0.5 },
      thunderstorm: { count: 7, opacity: 0.8 },
      snow: { count: 4, opacity: 0.5 }
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
            speed={0.2} // 减慢云朵内部动画
            width={6} // 减小云朵尺寸
            depth={1}
            segments={6} // 大幅减少几何体复杂度
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
            <sphereGeometry args={[1.5, 12, 12]} /> {/* 减少几何体复杂度 */}
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
            <sphereGeometry args={[1.2, 12, 12]} /> {/* 减少几何体复杂度 */}
            <meshBasicMaterial 
              color={sunColor} 
              toneMapped={false}
            />
          </mesh>
          <Sparkles 
            count={6} // 大幅减少粒子数量
            size={3}
            scale={[3, 3, 3]}
            speed={0.2}
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
      
      {/* 天空背景 - 简化几何体 */}
      <mesh ref={skyRef} position={[0, 0, -15]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial 
          color={skyColor} 
          side={THREE.DoubleSide}
          transparent
          opacity={0.3}
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

