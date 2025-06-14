import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * 页面布局组件 - 使用液体玻璃效果实现响应式布局，适配多平台
 */
const PageLayout = ({ children }) => {
  const { t } = useTranslation();
  
  return (
    <div className="page-layout">
      {/* 主内容区域 */}
      <main className="main-content">
        {children}
      </main>
      
      {/* 底部导航栏 - 仅在移动设备显示 */}
      <nav className="bottom-nav liquid-glass md:hidden">
        <div className="container mx-auto flex justify-around items-center h-full">
          <NavItem icon="🏠" label={t('nav.home')} active={true} />
          <NavItem icon="📊" label={t('nav.forecast')} />
          <NavItem icon="🌍" label={t('nav.cities')} />
          <NavItem icon="⚙️" label={t('nav.settings')} />
        </div>
      </nav>
      
      {/* 侧边导航栏 - 仅在桌面设备显示 */}
      <nav className="side-nav liquid-glass hidden md:flex">
        <div className="flex flex-col items-center justify-center h-full py-8 space-y-8">
          <NavItem icon="🏠" label={t('nav.home')} active={true} vertical={true} />
          <NavItem icon="📊" label={t('nav.forecast')} vertical={true} />
          <NavItem icon="🌍" label={t('nav.cities')} vertical={true} />
          <NavItem icon="⚙️" label={t('nav.settings')} vertical={true} />
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

// 导航项组件
const NavItem = ({ icon, label, active = false, vertical = false }) => {
  return (
    <button 
      className={`nav-item ${active ? 'active' : ''} ${vertical ? 'vertical' : ''}`}
      aria-label={label}
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
          transition: all 0.3s ease;
          position: relative;
          border-radius: ${vertical ? '50%' : '16px'};
          width: ${vertical ? '50px' : 'auto'};
          height: ${vertical ? '50px' : 'auto'};
        }
        
        .nav-item:hover {
          color: rgba(255, 255, 255, 1);
          background: rgba(255, 255, 255, 0.1);
        }
        
        .nav-item.active {
          color: rgba(255, 255, 255, 1);
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
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
    </button>
  );
};

export default PageLayout;
