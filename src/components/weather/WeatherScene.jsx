import React, { useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import WeatherBackground from './WeatherBackground';
import WeatherErrorBoundary from './WeatherErrorBoundary';

/**
 * 3D天气场景管理器 - 修复版本
 * 解决WebGL上下文泄漏问题，确保只创建一个WebGL上下文并正确管理其生命周期
 */
const WeatherScene = () => {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const isInitialized = useRef(false);
  
  // 内存清理函数
  const performMemoryCleanup = useCallback(() => {
    const now = Date.now();
    
    if (now - memoryMonitor.current.lastCleanup < memoryMonitor.current.cleanupInterval) {
      return;
    }
    
    try {
      // 清理THREE.js缓存
      if (THREE.Cache) {
        THREE.Cache.clear();
      }
      
      // 强制垃圾回收（如果可用）
      if (now - memoryMonitor.current.lastCleanup > memoryMonitor.current.forceGCInterval) {
        if (window.gc) {
          window.gc();
        }
      }
      
      memoryMonitor.current.lastCleanup = now;
      console.log('Memory cleanup performed');
      
    } catch (error) {
      console.warn('Memory cleanup error:', error);
    }
  }, []);
  
  // WebGL上下文创建回调 - 确保只创建一次
  const onCreated = useCallback(({ gl, scene, camera }) => {
    if (!isInitialized.current) {
      glRef.current = gl;
      isInitialized.current = true;
      
      // 优化WebGL设置
      gl.setClearColor(0x000000, 0);
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.0;
      
      // 启用性能优化
      gl.shadowMap.enabled = false; // 禁用阴影以提高性能
      gl.antialias = true;
      gl.powerPreference = "high-performance";
      
      // 安全地设置内存管理
      try {
        gl.getExtension('WEBGL_lose_context'); // 预加载扩展
      } catch (error) {
        console.warn('Could not get WEBGL_lose_context extension:', error);
      }
      
      // 启动内存监控
      const memoryInterval = setInterval(() => {
        performMemoryCleanup();
      }, memoryMonitor.current.cleanupInterval);
      
      // 保存清理函数引用
      gl._memoryInterval = memoryInterval;
      
      console.log('WebGL context created successfully with memory monitoring');
    }
  }, [performMemoryCleanup]);
  
  // 安全的资源清理函数
  const cleanupResources = useCallback(() => {
    if (!glRef.current || !isInitialized.current) {
      return;
    }
    
    try {
      const gl = glRef.current;
      
      // 检查WebGL上下文是否仍然有效
      if (gl.isContextLost && gl.isContextLost()) {
        console.log('WebGL context already lost, skipping cleanup');
        glRef.current = null;
        isInitialized.current = false;
        return;
      }
      
      // 完全跳过WebGL清理，因为上下文可能已经失效
      console.log('Skipping WebGL cleanup - context may be invalid');
      
      // 清理内存监控
      if (gl._memoryInterval) {
        clearInterval(gl._memoryInterval);
        gl._memoryInterval = null;
      }
      
      // 安全地尝试释放上下文
      try {
        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext && typeof loseContext.loseContext === 'function') {
          loseContext.loseContext();
        }
      } catch (error) {
        console.warn('Could not force context loss:', error);
      }
      
      console.log('WebGL context cleaned up successfully');
      
    } catch (error) {
      console.error('Error during WebGL cleanup:', error);
    } finally {
      // 无论如何都要重置引用
      glRef.current = null;
      isInitialized.current = false;
    }
  }, []);
  
  // 组件卸载时清理WebGL资源
  useEffect(() => {
    return cleanupResources;
  }, [cleanupResources]);
  
  // 上下文丢失恢复状态
  const contextLostCount = useRef(0);
  const maxContextLossRetries = 3;
  
  // 内存监控和自动清理
  const memoryMonitor = useRef({
    lastCleanup: 0,
    cleanupInterval: 30000, // 30秒清理一次
    forceGCInterval: 60000   // 60秒强制垃圾回收一次
  });
  
  // 监听WebGL上下文丢失事件
  useEffect(() => {
    const handleContextLost = (event) => {
      event.preventDefault();
      contextLostCount.current++;
      
      console.warn(`WebGL context lost (${contextLostCount.current}/${maxContextLossRetries})`);
      
      // 清理当前状态
      isInitialized.current = false;
      glRef.current = null;
      
      // 如果上下文丢失次数过多，停止尝试恢复
      if (contextLostCount.current >= maxContextLossRetries) {
        console.error('WebGL context lost too many times, giving up recovery');
        return;
      }
    };
    
    const handleContextRestored = () => {
      console.log('WebGL context restored successfully');
      // 重置计数器
      contextLostCount.current = 0;
      // 标记需要重新初始化
      isInitialized.current = false;
    };
    
    // 获取canvas元素 - 可能来自Canvas组件内部
    const getCanvas = () => {
      if (canvasRef.current) {
        // 如果canvasRef直接指向canvas元素
        if (canvasRef.current.tagName === 'CANVAS') {
          return canvasRef.current;
        }
        // 如果canvasRef指向包装元素，查找内部的canvas
        const canvas = canvasRef.current.querySelector('canvas');
        return canvas;
      }
      return null;
    };
    
    const canvas = getCanvas();
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);
      
      return () => {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      };
    }
  }, []);
  
  return (
    <WeatherErrorBoundary>
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
            antialias: false, // 禁用抗锯齿以节省内存
            stencil: false,
            depth: true,
            alpha: false, // 禁用alpha通道以节省内存
            preserveDrawingBuffer: false, // 不保留绘图缓冲区以节省内存
            failIfMajorPerformanceCaveat: false,
            premultipliedAlpha: false // 禁用预乘alpha以节省计算
          }}
          // 性能优化配置 - 更激进的内存节省
          dpr={1} // 固定像素比为1，避免高DPI设备的内存消耗
          performance={{ 
            min: 0.3, // 允许更大幅度降低渲染质量
            max: 0.8, // 限制最大渲染质量以节省内存
            debounce: 100 // 减少防抖延迟以更快响应性能问题
          }}
          frameloop="always" // 改为always以确保动画流畅，但会在WeatherBackground中控制渲染频率
          resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        >
          <Suspense fallback={null}>
            <WeatherBackground />
          </Suspense>
        </Canvas>
      </div>
    </WeatherErrorBoundary>
  );
};

export default WeatherScene;

