import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import LanguageSwitcher from '../settings/LanguageSwitcher';
import ThemeSwitcher from '../settings/ThemeSwitcher';

/**
 * 应用容器组件 - 提供全局液体玻璃效果和响应式布局
 */
const AppContainer = ({ children }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const containerRef = useRef(null);
  
  // 根据时间设置背景类
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const hour = new Date().getHours();
    
    // 移除所有时间相关类
    container.classList.remove('time-morning', 'time-noon', 'time-afternoon', 'time-night');
    
    // 根据时间添加相应类
    if (hour >= 5 && hour < 10) {
      container.classList.add('time-morning');
    } else if (hour >= 10 && hour < 15) {
      container.classList.add('time-noon');
    } else if (hour >= 15 && hour < 19) {
      container.classList.add('time-afternoon');
    } else {
      container.classList.add('time-night');
    }
  }, []);
  
  // 添加鼠标移动光影效果
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // 计算鼠标位置的百分比
      const x = clientX / innerWidth;
      const y = clientY / innerHeight;
      
      // 更新CSS变量
      container.style.setProperty('--mouse-x', x.toFixed(2));
      container.style.setProperty('--mouse-y', y.toFixed(2));
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`app-container ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}
    >
      {/* 全局光影效果 */}
      <div className="global-lighting" />
      
      {/* 顶部工具栏 */}
      <header className="app-header liquid-glass">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white/90">{t('appName')}</h1>
          
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      
      {/* 主内容区域 */}
      <main className="app-content">
        {children}
      </main>
      
      <style jsx>{`
        .app-container {
          min-height: 100vh;
          transition: background 1s ease;
          position: relative;
          overflow-x: hidden;
        }
        
        .global-lighting {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
          background: radial-gradient(
            circle at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%),
            rgba(255, 255, 255, 0.1),
            transparent 40%
          );
          opacity: 0;
          transition: opacity 1s ease;
        }
        
        .app-container:hover .global-lighting {
          opacity: 1;
        }
        
        .app-header {
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(var(--glass-blur-medium));
          -webkit-backdrop-filter: blur(var(--glass-blur-medium));
          background: rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .app-content {
          position: relative;
          z-index: 10;
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        /* 深色模式调整 */
        .dark-mode {
          --glass-opacity: var(--glass-dark-bg-opacity);
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
          .app-content {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AppContainer;
