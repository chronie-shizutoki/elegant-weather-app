import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useWeather, WeatherType } from '@/contexts/WeatherContext';
import { useTheme, TimeOfDay } from '@/contexts/ThemeContext';
import * as THREE from 'three';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { Clouds, Cloud, Stars, Sky } from '@react-three/drei';

// 雨滴粒子系统
function RainParticles({ count = 1000, intensity = 1 }) {
  const mesh = useRef();
  const { viewport } = useThree();
  
  // 创建雨滴几何体
  useEffect(() => {
    if (!mesh.current) return;
    
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // 随机位置
      positions[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2 + viewport.height;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      // 随机下落速度
      velocities[i] = (Math.random() + 0.5) * 0.1 * intensity;
      
      // 随机大小
      sizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    mesh.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    mesh.current.geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
    mesh.current.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  }, [count, viewport, intensity]);
  
  // 更新雨滴位置
  useFrame(() => {
    if (!mesh.current) return;
    
    const positions = mesh.current.geometry.attributes.position.array;
    const velocities = mesh.current.geometry.attributes.velocity.array;
    
    for (let i = 0; i < count; i++) {
      // 更新Y位置
      positions[i * 3 + 1] -= velocities[i];
      
      // 如果雨滴落到底部，重置到顶部
      if (positions[i * 3 + 1] < -viewport.height) {
        positions[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
        positions[i * 3 + 1] = viewport.height;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={mesh}>
      <bufferGeometry />
      <pointsMaterial 
        color="#aaccff" 
        size={0.1} 
        transparent 
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// 雪花粒子系统
function SnowParticles({ count = 1000 }) {
  const mesh = useRef();
  const { viewport } = useThree();
  
  // 创建雪花几何体
  useEffect(() => {
    if (!mesh.current) return;
    
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // 随机位置
      positions[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2 + viewport.height;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      // 随机速度（包括水平漂移）
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() + 0.5) * 0.05;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      
      // 随机大小
      sizes[i] = Math.random() * 0.2 + 0.1;
    }
    
    mesh.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    mesh.current.geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    mesh.current.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  }, [count, viewport]);
  
  // 更新雪花位置
  useFrame(() => {
    if (!mesh.current) return;
    
    const positions = mesh.current.geometry.attributes.position.array;
    const velocities = mesh.current.geometry.attributes.velocity.array;
    
    for (let i = 0; i < count; i++) {
      // 更新位置
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] -= velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];
      
      // 如果雪花落到底部，重置到顶部
      if (positions[i * 3 + 1] < -viewport.height) {
        positions[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
        positions[i * 3 + 1] = viewport.height;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
      
      // 如果雪花飘出左右边界，重置到另一侧
      if (positions[i * 3] < -viewport.width) {
        positions[i * 3] = viewport.width;
      } else if (positions[i * 3] > viewport.width) {
        positions[i * 3] = -viewport.width;
      }
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={mesh}>
      <bufferGeometry />
      <pointsMaterial 
        color="#ffffff" 
        size={0.2} 
        transparent 
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// 闪电效果
function Lightning() {
  const mesh = useRef();
  const { viewport } = useThree();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState([0, 0, 0]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // 随机决定是否显示闪电
      if (Math.random() < 0.1) {
        setVisible(true);
        setPosition([
          (Math.random() - 0.5) * viewport.width,
          (Math.random() - 0.5) * viewport.height,
          -5
        ]);
        
        // 闪电持续时间
        setTimeout(() => {
          setVisible(false);
        }, 100);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [viewport]);
  
  if (!visible) return null;
  
  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={[viewport.width / 4, viewport.height]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </mesh>
  );
}

// 天空背景
function SkyBackground({ timeOfDay, weatherType }) {
  const { scene } = useThree();
  
  useEffect(() => {
    // 根据时间和天气设置背景色
    let color;
    
    switch (timeOfDay) {
      case TimeOfDay.MORNING:
        color = new THREE.Color(weatherType === WeatherType.SUNNY ? '#87CEEB' : '#A9A9A9');
        break;
      case TimeOfDay.NOON:
        color = new THREE.Color(weatherType === WeatherType.SUNNY ? '#1E90FF' : '#708090');
        break;
      case TimeOfDay.AFTERNOON:
        color = new THREE.Color(weatherType === WeatherType.SUNNY ? '#FF7F50' : '#696969');
        break;
      case TimeOfDay.NIGHT:
        color = new THREE.Color('#0A1929');
        break;
      default:
        color = new THREE.Color('#87CEEB');
    }
    
    scene.background = color;
    scene.fog = new THREE.Fog(color, 1, 100);
  }, [scene, timeOfDay, weatherType]);
  
  return null;
}

// 主场景
function Scene() {
  const { currentWeather } = useWeather();
  const { timeOfDay } = useTheme();
  
  // 获取当前天气类型
  const weatherType = currentWeather?.weatherType || WeatherType.SUNNY;
  
  // 是否显示星星（夜间）
  const showStars = timeOfDay === TimeOfDay.NIGHT;
  
  // 是否显示云（多云、阴天、雨天等）
  const showClouds = [
    WeatherType.CLOUDY, 
    WeatherType.OVERCAST, 
    WeatherType.RAIN, 
    WeatherType.HEAVY_RAIN,
    WeatherType.THUNDERSTORM,
    WeatherType.SNOW
  ].includes(weatherType);
  
  // 云的密度和颜色
  const cloudDensity = weatherType === WeatherType.OVERCAST ? 0.5 : 0.3;
  const cloudColor = timeOfDay === TimeOfDay.NIGHT ? '#1a1a2e' : '#ffffff';
  
  // 是否显示雨
  const showRain = [WeatherType.RAIN, WeatherType.HEAVY_RAIN, WeatherType.THUNDERSTORM].includes(weatherType);
  
  // 雨的强度
  const rainIntensity = weatherType === WeatherType.HEAVY_RAIN ? 2 : 1;
  
  // 是否显示雪
  const showSnow = weatherType === WeatherType.SNOW;
  
  // 是否显示闪电
  const showLightning = weatherType === WeatherType.THUNDERSTORM;
  
  return (
    <>
      <SkyBackground timeOfDay={timeOfDay} weatherType={weatherType} />
      
      {/* 太阳/月亮和天空 */}
      <Sky 
        distance={450000} 
        sunPosition={[0, timeOfDay === TimeOfDay.NIGHT ? -1 : 1, 0]} 
        inclination={timeOfDay === TimeOfDay.NIGHT ? 0 : 0.5}
        azimuth={timeOfDay === TimeOfDay.AFTERNOON ? 0.25 : 0.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        rayleigh={timeOfDay === TimeOfDay.NIGHT ? 0.5 : 1}
        turbidity={timeOfDay === TimeOfDay.NIGHT ? 20 : 10}
      />
      
      {/* 星星（夜间） */}
      {showStars && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
      
      {/* 云 */}
      {showClouds && (
        <Clouds material={THREE.MeshBasicMaterial}>
          <Cloud 
            opacity={0.8} 
            speed={0.4} 
            width={10} 
            depth={1.5} 
            segments={20} 
            color={cloudColor}
          />
          <Cloud 
            opacity={0.7} 
            speed={0.2} 
            width={8} 
            depth={1} 
            segments={15} 
            color={cloudColor}
            position={[4, 2, 0]}
          />
          <Cloud 
            opacity={0.6} 
            speed={0.3} 
            width={12} 
            depth={1.2} 
            segments={18} 
            color={cloudColor}
            position={[-4, 3, 0]}
          />
        </Clouds>
      )}
      
      {/* 雨 */}
      {showRain && <RainParticles count={2000} intensity={rainIntensity} />}
      
      {/* 雪 */}
      {showSnow && <SnowParticles count={1500} />}
      
      {/* 闪电 */}
      {showLightning && <Lightning />}
      
      {/* 后期处理效果 */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
      </EffectComposer>
    </>
  );
}

// 3D背景组件
export default function WeatherBackground() {
  return (
    <div className="fixed inset-0 z-[-1]">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <Scene />
      </Canvas>
    </div>
  );
}

