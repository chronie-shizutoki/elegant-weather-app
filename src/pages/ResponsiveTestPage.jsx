import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

/**
 * 响应式测试页面 - 验证多端UI和动画效果
 */
const ResponsiveTestPage = () => {
  const { t } = useTranslation();
  const [deviceType, setDeviceType] = useState('desktop');
  
  // 响应式检测
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  
  // 更新设备类型
  useEffect(() => {
    if (isMobile) setDeviceType('mobile');
    else if (isTablet) setDeviceType('tablet');
    else setDeviceType('desktop');
  }, [isMobile, isTablet, isDesktop]);
  
  // 测试卡片组件
  const TestCard = ({ title, children }) => (
    <motion.div 
      className="liquid-glass liquid-card test-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
      }}
    >
      <h3 className="text-xl font-semibold text-white/90 mb-4">{title}</h3>
      {children}
    </motion.div>
  );
  
  // 3D动画测试组件
  const AnimationTest = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    
    const startAnimation = () => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    };
    
    return (
      <div className="animation-test">
        <motion.div 
          className="animation-object liquid-glass"
          animate={isAnimating ? {
            rotateY: 360,
            scale: [1, 1.2, 1],
            backgroundColor: ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)"]
          } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        <motion.button 
          className="liquid-button mt-4"
          onClick={startAnimation}
          whileTap={{ scale: 0.95 }}
        >
          {t('testAnimation')}
        </motion.button>
      </div>
    );
  };
  
  return (
    <div className="responsive-test-page">
      <motion.div 
        className="liquid-glass liquid-card mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white/90 mb-4">{t('responsiveTest')}</h2>
        <div className="device-info">
          <p className="text-white/80 mb-2">
            {t('currentDevice')}: <span className="font-semibold">{deviceType}</span>
          </p>
          <p className="text-white/80">
            {t('viewport')}: <span className="font-semibold">{window.innerWidth} x {window.innerHeight}</span>
          </p>
        </div>
      </motion.div>
      
      <div className={`test-grid grid gap-6 ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'}`}>
        <TestCard title={t('layoutTest')}>
          <div className="layout-test">
            <div className="flex flex-wrap gap-2">
              {['A', 'B', 'C'].map(item => (
                <div key={item} className="liquid-glass p-4 flex-1 text-center text-white font-bold">
                  {item}
                </div>
              ))}
            </div>
            
            <div className="mt-4 liquid-glass p-4 text-white/80">
              {t('responsiveLayout')}
            </div>
          </div>
        </TestCard>
        
        <TestCard title={t('animationTest')}>
          <AnimationTest />
        </TestCard>
        
        <TestCard title={t('touchTest')}>
          <div className="touch-test">
            <div 
              className="touch-area liquid-glass p-6 text-center text-white/80"
              onTouchStart={() => console.log('Touch started')}
              onTouchMove={() => console.log('Touch moved')}
              onTouchEnd={() => console.log('Touch ended')}
            >
              {t('touchHere')}
            </div>
          </div>
        </TestCard>
        
        <TestCard title={t('fontTest')}>
          <div className="font-test">
            <p className="text-white text-xs mb-2">Extra Small</p>
            <p className="text-white text-sm mb-2">Small</p>
            <p className="text-white text-base mb-2">Base</p>
            <p className="text-white text-lg mb-2">Large</p>
            <p className="text-white text-xl mb-2">Extra Large</p>
            <p className="text-white text-2xl">2XL</p>
          </div>
        </TestCard>
        
        <TestCard title={t('glassEffectTest')}>
          <div className="glass-test">
            <div className="relative h-40">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
              <div className="absolute inset-0 liquid-glass rounded-lg flex items-center justify-center">
                <p className="text-white font-semibold">{t('glassEffect')}</p>
              </div>
            </div>
          </div>
        </TestCard>
        
        <TestCard title={t('performanceTest')}>
          <div className="performance-test">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.div 
                  key={i}
                  className="liquid-glass aspect-square flex items-center justify-center text-white"
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 20, 
                    ease: "linear", 
                    repeat: Infinity 
                  }}
                >
                  {i + 1}
                </motion.div>
              ))}
            </div>
          </div>
        </TestCard>
      </div>
      
      <style jsx>{`
        .responsive-test-page {
          padding-bottom: 30px;
        }
        
        .test-card {
          height: 100%;
        }
        
        .animation-object {
          width: 100px;
          height: 100px;
          border-radius: 16px;
          margin: 0 auto;
        }
        
        .touch-area {
          min-height: 150px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default ResponsiveTestPage;
