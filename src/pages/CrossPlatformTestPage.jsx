import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * 多端兼容性测试页面 - 验证不同设备上的UI和动画效果
 */
const CrossPlatformTestPage = () => {
  const { t } = useTranslation();
  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: '',
    platform: '',
    screenWidth: 0,
    screenHeight: 0,
    devicePixelRatio: 1,
    touchSupported: false
  });
  
  // 获取设备信息
  useEffect(() => {
    setDeviceInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      devicePixelRatio: window.devicePixelRatio,
      touchSupported: 'ontouchstart' in window
    });
  }, []);
  
  // 性能测试
  const [fps, setFps] = useState(0);
  const [isTestingPerformance, setIsTestingPerformance] = useState(false);
  
  const startPerformanceTest = () => {
    if (isTestingPerformance) return;
    
    setIsTestingPerformance(true);
    let frameCount = 0;
    let lastTime = performance.now();
    
    const countFrames = (time) => {
      frameCount++;
      
      if (time - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = time;
      }
      
      if (isTestingPerformance) {
        requestAnimationFrame(countFrames);
      }
    };
    
    requestAnimationFrame(countFrames);
    
    // 10秒后自动停止测试
    setTimeout(() => {
      setIsTestingPerformance(false);
    }, 10000);
  };
  
  // 3D渲染测试
  const [is3DTestActive, setIs3DTestActive] = useState(false);
  
  const toggle3DTest = () => {
    setIs3DTestActive(!is3DTestActive);
  };
  
  // 触摸手势测试
  const [touchEvents, setTouchEvents] = useState([]);
  
  const handleTouchEvent = (eventType, e) => {
    e.preventDefault();
    const touch = e.touches[0] || e.changedTouches[0];
    const newEvent = {
      type: eventType,
      x: touch ? touch.clientX : 0,
      y: touch ? touch.clientY : 0,
      time: new Date().toLocaleTimeString()
    };
    
    setTouchEvents(prev => [newEvent, ...prev.slice(0, 4)]);
  };
  
  return (
    <div className="cross-platform-test-page">
      <motion.div 
        className="liquid-glass liquid-card mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white/90 mb-4">{t('deviceInfo')}</h2>
        <div className="device-info text-white/80">
          <p className="mb-2"><span className="font-semibold">Platform:</span> {deviceInfo.platform}</p>
          <p className="mb-2"><span className="font-semibold">Screen:</span> {deviceInfo.screenWidth} x {deviceInfo.screenHeight} (Ratio: {deviceInfo.devicePixelRatio})</p>
          <p className="mb-2"><span className="font-semibold">Touch:</span> {deviceInfo.touchSupported ? 'Supported' : 'Not Supported'}</p>
          <p className="text-xs opacity-70 truncate">{deviceInfo.userAgent}</p>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 性能测试卡片 */}
        <motion.div 
          className="liquid-glass liquid-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-xl font-semibold text-white/90 mb-4">{t('performanceTest')}</h3>
          <div className="performance-test">
            <div className="fps-display text-center mb-4">
              <div className="text-4xl font-bold text-white">{fps}</div>
              <div className="text-white/70">FPS</div>
            </div>
            
            <div className="animation-container h-40 relative overflow-hidden rounded-lg mb-4">
              {isTestingPerformance && Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-6 h-6 rounded-full bg-white/50"
                  initial={{ 
                    x: Math.random() * 100 + '%', 
                    y: Math.random() * 100 + '%',
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{ 
                    x: Math.random() * 100 + '%', 
                    y: Math.random() * 100 + '%',
                    scale: Math.random() * 0.5 + 0.5,
                    opacity: Math.random() * 0.5 + 0.5
                  }}
                  transition={{ 
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </div>
            
            <motion.button 
              className="liquid-button w-full"
              onClick={startPerformanceTest}
              disabled={isTestingPerformance}
              whileTap={{ scale: 0.95 }}
            >
              {isTestingPerformance ? t('testingPerformance') : t('startPerformanceTest')}
            </motion.button>
          </div>
        </motion.div>
        
        {/* 3D效果测试卡片 */}
        <motion.div 
          className="liquid-glass liquid-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-white/90 mb-4">{t('3dEffectsTest')}</h3>
          <div className="effects-test">
            <div className="test-container h-40 flex items-center justify-center mb-4">
              <motion.div 
                className="liquid-glass w-32 h-32 flex items-center justify-center text-white font-bold text-xl"
                animate={is3DTestActive ? {
                  rotateY: [0, 360],
                  rotateX: [0, 360],
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    "0 5px 15px rgba(0,0,0,0.1)",
                    "0 15px 35px rgba(0,0,0,0.3)",
                    "0 5px 15px rgba(0,0,0,0.1)"
                  ]
                } : {}}
                transition={is3DTestActive ? {
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "loop"
                } : {}}
                style={{ 
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                3D
              </motion.div>
            </div>
            
            <motion.button 
              className="liquid-button w-full"
              onClick={toggle3DTest}
              whileTap={{ scale: 0.95 }}
            >
              {is3DTestActive ? t('stop3DTest') : t('start3DTest')}
            </motion.button>
          </div>
        </motion.div>
        
        {/* 触摸手势测试卡片 */}
        <motion.div 
          className="liquid-glass liquid-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white/90 mb-4">{t('touchGestureTest')}</h3>
          <div className="touch-test">
            <div 
              className="touch-area liquid-glass h-40 mb-4 flex items-center justify-center text-white/80"
              onTouchStart={(e) => handleTouchEvent('touchstart', e)}
              onTouchMove={(e) => handleTouchEvent('touchmove', e)}
              onTouchEnd={(e) => handleTouchEvent('touchend', e)}
            >
              {deviceInfo.touchSupported ? t('touchHere') : t('touchNotSupported')}
            </div>
            
            <div className="touch-events">
              <h4 className="text-white/90 font-medium mb-2">{t('recentTouchEvents')}</h4>
              {touchEvents.length > 0 ? (
                <ul className="text-white/70 text-sm">
                  {touchEvents.map((event, i) => (
                    <li key={i} className="mb-1">
                      {event.time}: {event.type} at ({event.x}, {event.y})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/50 text-sm">{t('noTouchEvents')}</p>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* 响应式布局测试卡片 */}
        <motion.div 
          className="liquid-glass liquid-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-white/90 mb-4">{t('responsiveLayoutTest')}</h3>
          <div className="layout-test">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
              {[1, 2, 3, 4, 5, 6].map(num => (
                <div 
                  key={num}
                  className="liquid-glass aspect-square flex items-center justify-center text-white font-bold"
                >
                  {num}
                </div>
              ))}
            </div>
            
            <p className="text-white/70 text-sm">
              {t('responsiveLayoutDescription')}
            </p>
          </div>
        </motion.div>
      </div>
      
      <style jsx>{`
        .cross-platform-test-page {
          padding-bottom: 30px;
        }
        
        .touch-area {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
};

export default CrossPlatformTestPage;
