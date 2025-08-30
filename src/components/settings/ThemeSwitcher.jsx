import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * 主题切换组件 - 使用液体玻璃效果实现优雅的深色/浅色模式切换
 */
const ThemeSwitcher = ({ className }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 切换主题
  const toggleTheme = () => {
    setIsAnimating(true);
    toggleDarkMode();
    
    // 动画结束后重置状态
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };
  
  return (
    <div className={`theme-switcher ${className}`}>
      <button 
        className={`liquid-glass liquid-button rounded-full p-2 flex items-center justify-center ${isAnimating ? 'animating' : ''}`}
        onClick={toggleTheme}
        aria-label={t('switchTheme')}
      >
        <span className="theme-icon">
          {isDarkMode ? '☀️' : '🌙'}
        </span>
      </button>
      
      <style jsx>{`
        .theme-switcher button {
          position: relative;
          overflow: hidden;
        }
        
        .theme-icon {
          display: inline-block;
          font-size: 1.25rem;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .animating .theme-icon {
          transform: rotate(360deg);
        }
        
        .theme-switcher button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0) 70%
          );
          transform: translate(-50%, -50%);
          border-radius: 50%;
          opacity: 0;
          z-index: -1;
          transition: width 0.6s ease-out, height 0.6s ease-out, opacity 0.6s ease-out;
        }
        
        .animating::before {
          width: 150px;
          height: 150px;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default ThemeSwitcher;
