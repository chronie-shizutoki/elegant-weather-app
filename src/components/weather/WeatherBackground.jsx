import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useWeather } from '../../contexts/WeatherContext';
import { useTheme } from '../../contexts/ThemeContext';
import * as THREE from 'three';
import { Sparkles, Cloud, Environment, useTexture } from '@react-three/drei';

/**
 * 3D天气背景组件 - 使用Three.js和React Three Fiber实现真实3D天气效果
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
  
  // 加载纹理
  const cloudTexture = useTexture('/textures/cloud.png');
  const rainTexture = useTexture('/textures/raindrop.png');
  const snowTexture = useTexture('/textures/snowflake.png');
  
  // 初始化场景
  useEffect(() => {
    // 设置场景背景
    scene.fog = new THREE.FogExp2(0x88ccff, 0.01);
    
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  
  // 根据时间和天气更新场景
  useEffect(() => {
    // 根据时间设置天空颜色
    let skyColor;
    switch(timeOfDay) {
      case 'morning':
        skyColor = new THREE.Color(theme === 'dark' ? 0x1a3c6e : 0x88b6e0);
        break;
      case 'noon':
        skyColor = new THREE.Color(theme === 'dark' ? 0x2a5ca8 : 0x4a9be8);
        break;
      case 'afternoon':
        skyColor = new THREE.Color(theme === 'dark' ? 0x4a3c78 : 0x7a97d0);
        break;
      case 'night':
        skyColor = new THREE.Color(theme === 'dark' ? 0x0a1525 : 0x1a2535);
        break;
      default:
        skyColor = new THREE.Color(theme === 'dark' ? 0x2a5ca8 : 0x4a9be8);
    }
    
    scene.background = skyColor;
    if (scene.fog) {
      scene.fog.color = skyColor;
    }
  }, [timeOfDay, theme, scene]);
  
  // 动画帧更新
  useFrame((state, delta) => {
    // 云朵动画
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.05;
    }
    
    // 雨滴动画
    if (rainRef.current && ['rainy', 'drizzle', 'thunderstorm'].includes(weather.condition)) {
      rainRef.current.rotation.y += delta * 0.1;
    }
    
    // 雪花动画
    if (snowRef.current && weather.condition === 'snow') {
      snowRef.current.rotation.y += delta * 0.05;
    }
    
    // 太阳/月亮动画
    if (sunRef.current && ['sunny', 'clear', 'partly-cloudy'].includes(weather.condition)) {
      // 根据时间计算太阳位置
      const timePosition = getTimePosition(timeOfDay);
      sunRef.current.position.x = Math.sin(timePosition) * 15;
      sunRef.current.position.y = Math.cos(timePosition) * 15;
      sunRef.current.lookAt(0, 0, 0);
    }
    
    if (moonRef.current && timeOfDay === 'night') {
      moonRef.current.rotation.y += delta * 0.01;
    }
  });
  
  // 根据时间获取位置角度
  const getTimePosition = (time) => {
    switch(time) {
      case 'morning': return Math.PI * 0.75; // 日出
      case 'noon': return Math.PI * 0.5; // 正午
      case 'afternoon': return Math.PI * 0.25; // 下午
      case 'night': return Math.PI * 0; // 夜晚
      default: return Math.PI * 0.5;
    }
  };
  
  // 渲染天气效果
  const renderWeatherEffect = () => {
    switch(weather.condition) {
      case 'rainy':
      case 'drizzle':
      case 'thunderstorm':
        return (
          <group ref={rainRef}>
            <Sparkles 
              count={weather.condition === 'thunderstorm' ? 500 : 300}
              size={1}
              speed={10}
              opacity={0.7}
              scale={[20, 20, 20]}
              noise={[5, 5, 5]}
              color="#88ccff"
            />
            {weather.condition === 'thunderstorm' && (
              <pointLight 
                position={[0, 10, 0]} 
                intensity={10} 
                color="#ffffff"
                distance={20}
                decay={2}
              />
            )}
          </group>
        );
      case 'snow':
        return (
          <group ref={snowRef}>
            <Sparkles 
              count={200}
              size={2}
              speed={1}
              opacity={0.7}
              scale={[20, 20, 20]}
              noise={[1, 1, 1]}
              color="#ffffff"
            />
          </group>
        );
      default:
        return null;
    }
  };
  
  // 渲染云层
  const renderClouds = () => {
    // 根据天气状况决定云量
    let cloudCount = 0;
    switch(weather.condition) {
      case 'cloudy': cloudCount = 20; break;
      case 'partly-cloudy': cloudCount = 10; break;
      case 'rainy':
      case 'drizzle': cloudCount = 15; break;
      case 'thunderstorm': cloudCount = 25; break;
      case 'snow': cloudCount = 12; break;
      default: cloudCount = 5;
    }
    
    if (cloudCount === 0) return null;
    
    return (
      <group ref={cloudsRef}>
        {Array.from({ length: cloudCount }).map((_, i) => (
          <Cloud 
            key={i}
            position={[
              (Math.random() - 0.5) * 20,
              Math.random() * 5 + 5,
              (Math.random() - 0.5) * 20
            ]}
            opacity={0.5}
            speed={0.4}
            width={10}
            depth={1.5}
            segments={20}
          />
        ))}
      </group>
    );
  };
  
  // 渲染太阳/月亮
  const renderCelestialBodies = () => {
    if (timeOfDay === 'night') {
      return (
        <group ref={moonRef} position={[10, 8, -10]}>
          <mesh>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial 
              color="#f0f0ff" 
              emissive="#aaaacc"
              emissiveIntensity={0.5}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
        </group>
      );
    } else if (['sunny', 'clear', 'partly-cloudy'].includes(weather.condition)) {
      return (
        <group ref={sunRef} position={[0, 15, 0]}>
          <pointLight 
            intensity={10} 
            distance={50} 
            decay={2}
            color={timeOfDay === 'afternoon' ? '#ffaa44' : '#ffffff'}
          />
          <mesh>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshBasicMaterial 
              color={timeOfDay === 'afternoon' ? '#ffaa44' : '#ffffff'} 
              toneMapped={false}
            />
          </mesh>
          <Sparkles 
            count={20}
            size={5}
            scale={[4, 4, 4]}
            speed={0.3}
            color={timeOfDay === 'afternoon' ? '#ffaa44' : '#ffffff'}
          />
        </group>
      );
    }
    return null;
  };
  
  return (
    <group>
      {/* 环境光照 */}
      <ambientLight intensity={timeOfDay === 'night' ? 0.2 : 0.5} />
      
      {/* 方向光 - 模拟太阳/月亮光源 */}
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={timeOfDay === 'night' ? 0.1 : 1} 
        castShadow
      />
      
      {/* 天空背景 */}
      <mesh ref={skyRef} position={[0, 0, -20]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial 
          color={scene.background} 
          side={THREE.DoubleSide}
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* 云层 */}
      {renderClouds()}
      
      {/* 天气效果 */}
      {renderWeatherEffect()}
      
      {/* 太阳/月亮 */}
      {renderCelestialBodies()}
      
      {/* 环境HDRI */}
      <Environment preset={timeOfDay === 'night' ? 'night' : 'sunset'} />
    </group>
  );
};

export default WeatherBackground;
