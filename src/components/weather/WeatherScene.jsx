import React, { useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import WeatherBackground from './WeatherBackground';

/**
 * 3D天气场景管理器 - 修复版本
 * 解决WebGL上下文泄漏问题，确保只创建一个WebGL上下文并正确管理其生命周期
 */
const WeatherScene = () => {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const isInitialized = useRef(false);
  
  // WebGL上下文创建回调 - 确保只创建一次
  const onCreated = useCallback(({ gl, scene, camera }) => {
    if (!isInitialized.current) {
      glRef.current = gl;
      isInitialized.current = true;
      
      // 优化WebGL设置
      gl.setClearColor(0x000000, 0);
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比
      gl.outputEncoding = THREE.sRGBEncoding;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.0;
      
      // 启用性能优化
      gl.shadowMap.enabled = false; // 禁用阴影以提高性能
      gl.antialias = true;
      gl.powerPreference = "high-performance";
      
      console.log('WebGL context created successfully');
    }
  }, []);
  
  // 组件卸载时清理WebGL资源
  useEffect(() => {
    return () => {
      if (glRef.current && isInitialized.current) {
        try {
          // 清理WebGL资源
          const gl = glRef.current;
          
          // 清理所有纹理
          const textures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
          for (let i = 0; i < textures; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
          }
          
          // 清理缓冲区
          gl.bindBuffer(gl.ARRAY_BUFFER, null);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
          gl.bindRenderbuffer(gl.RENDERBUFFER, null);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          
          // 强制释放上下文
          const loseContext = gl.getExtension('WEBGL_lose_context');
          if (loseContext) {
            loseContext.loseContext();
          }
          
          glRef.current = null;
          isInitialized.current = false;
          
          console.log('WebGL context cleaned up successfully');
        } catch (error) {
          console.error('Error cleaning up WebGL context:', error);
        }
      }
    };
  }, []);
  
  // 监听WebGL上下文丢失事件
  useEffect(() => {
    const handleContextLost = (event) => {
      event.preventDefault();
      console.warn('WebGL context lost, attempting to restore...');
      isInitialized.current = false;
    };
    
    const handleContextRestored = () => {
      console.log('WebGL context restored');
      // 上下文恢复后重新初始化
      if (canvasRef.current) {
        isInitialized.current = false;
      }
    };
    
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);
      
      return () => {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      };
    }
  }, []);
  
  return (
    <div className="three-container">
      <Canvas 
        ref={canvasRef}
        onCreated={onCreated}
        shadows={false} // 禁用阴影以提高性能
        camera={{ 
          position: [0, 0, 10], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          powerPreference: "high-performance",
          antialias: true,
          stencil: false,
          depth: true,
          alpha: true,
          preserveDrawingBuffer: false, // 不保留绘图缓冲区以节省内存
          failIfMajorPerformanceCaveat: false
        }}
        // 性能优化配置
        dpr={[1, 2]} // 限制设备像素比，避免在高DPI设备上过度渲染
        performance={{ 
          min: 0.5, // 允许降低渲染质量以保持帧率
          max: 1.0,
          debounce: 200 // 防抖延迟
        }}
        frameloop="always" // 改为always以确保动画流畅，但会在WeatherBackground中控制渲染频率
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      >
        <Suspense fallback={null}>
          <WeatherBackground />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default WeatherScene;

