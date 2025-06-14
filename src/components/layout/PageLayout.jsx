import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 页面布局组件 - 使用液体玻璃效果实现响应式布局，适配多平台
 * 集成3D渲染和动画效果，提供流畅的导航交互
 */
const PageLayout = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('/');
  
  // 同步路由和激活标签
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);
  
  // 导航项配置
  const navItems = [
    { path: '/', icon: '🏠', label: t('nav.home') },
    { path: '/forecast', icon: '📊', label: t('nav.forecast') },
    { path: '/cities', icon: '🌍', label: t('nav.cities') },
    { path: '/settings', icon: '⚙️', label: t('nav.settings') }
  ];
  
  // 处理导航点击
  const handleNavClick = (path) => {
    navigate(path);
  };
  
  return (
    <div className="page-layout">
      {/* 主内容区域 - 使用AnimatePresence实现页面切换动画 */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.5 
            }}
            className="page-container"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* 底部导航栏 - 仅在移动设备显示 */}
      <nav className="bottom-nav liquid-glass md:hidden">
        <div className="container mx-auto flex justify-around items-center h-full">
          {navItems.map((item) => (
            <NavItem 
              key={item.path}
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.path} 
              onClick={() => handleNavClick(item.path)}
            />
          ))}
        </div>
      </nav>
      
      {/* 侧边导航栏 - 仅在桌面设备显示 */}
      <nav className="side-nav liquid-glass hidden md:flex">
        <div className="flex flex-col items-center justify-center h-full py-8 space-y-8">
          {navItems.map((item) => (
            <NavItem 
              key={item.path}
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.path} 
              vertical={true}
              onClick={() => handleNavClick(item.path)}
            />
          ))}
        </div>
      </nav>
      
      <style jsx>{`
        .page-layout {
          position: relative;
          min-height: 100vh;
          padding-bottom: 70px; /* 为底部导航留出空间 */
        }
        
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          z-index: 10;
          position: relative;
        }
        
        .page-container {
          width: 100%;
          height: 100%;
        }
        
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 70px;
          z-index: 100;
          backdrop-filter: blur(var(--glass-blur-medium));
          -webkit-backdrop-filter: blur(var(--glass-blur-medium));
          background: rgba(255, 255, 255, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
        }
        
        .side-nav {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          right: 20px;
          width: 70px;
          border-radius: 35px;
          z-index: 100;
          backdrop-filter: blur(var(--glass-blur-medium));
          -webkit-backdrop-filter: blur(var(--glass-blur-medium));
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        
        @media (min-width: 768px) {
          .page-layout {
            padding-bottom: 0;
            padding-right: 90px; /* 为侧边导航留出空间 */
          }
        }
      `}</style>
    </div>
  );
};

// 导航项组件 - 使用Framer Motion实现流畅动画
const NavItem = ({ icon, label, active = false, vertical = false, onClick }) => {
  return (
    <motion.button 
      className={`nav-item ${active ? 'active' : ''} ${vertical ? 'vertical' : ''}`}
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.95 }}
      whileHover={{ 
        scale: 1.05,
        backgroundColor: 'rgba(255, 255, 255, 0.15)' 
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      <span className="icon">{icon}</span>
      {!vertical && <span className="label">{label}</span>}
      
      <style jsx>{`
        .nav-item {
          display: flex;
          flex-direction: ${vertical ? 'column' : 'row'};
          align-items: center;
          justify-content: center;
          padding: ${vertical ? '12px 0' : '8px 12px'};
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          border-radius: ${vertical ? '50%' : '16px'};
          width: ${vertical ? '50px' : 'auto'};
          height: ${vertical ? '50px' : 'auto'};
          overflow: hidden;
        }
        
        .nav-item:hover {
          color: rgba(255, 255, 255, 1);
        }
        
        .nav-item.active {
          color: rgba(255, 255, 255, 1);
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .nav-item.active::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.2),
            transparent 70%
          );
          opacity: 0.8;
          z-index: -1;
        }
        
        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: ${vertical ? '0' : '-5px'};
          left: ${vertical ? '50%' : 'auto'};
          right: ${vertical ? 'auto' : '50%'};
          transform: ${vertical ? 'translateX(-50%)' : 'translateX(50%)'};
          width: 5px;
          height: 5px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          animation: nav-pulse 2s infinite;
        }
        
        .icon {
          font-size: 1.5rem;
          margin-right: ${vertical ? '0' : '8px'};
          margin-bottom: ${vertical ? '4px' : '0'};
          filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
          transition: transform 0.3s ease;
        }
        
        .nav-item:hover .icon {
          transform: scale(1.1);
        }
        
        .label {
          font-size: 0.875rem;
        }
        
        @keyframes nav-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: ${vertical ? 'translateX(-50%) scale(1)' : 'translateX(50%) scale(1)'};
          }
          50% {
            opacity: 1;
            transform: ${vertical ? 'translateX(-50%) scale(1.5)' : 'translateX(50%) scale(1.5)'};
          }
        }
      `}</style>
    </motion.button>
  );
};

export default PageLayout;
