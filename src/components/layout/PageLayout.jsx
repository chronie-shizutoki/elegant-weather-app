import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';

const PageLayout = ({ children, currentPage, onPageChange }) => {
  const { theme, isDarkMode, toggleDarkMode } = useTheme();
  const { t, currentLang, changeLang, supportedLanguages } = useLang();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const navigationItems = [
    { id: 'weather', label: t('currentWeather'), icon: '🌤️' },
    { id: 'forecast', label: t('forecast'), icon: '📊' },
    { id: 'cities', label: t('cities'), icon: '🏙️' },
    { id: 'settings', label: t('settings'), icon: '⚙️' }
  ];

  const handleLanguageChange = (langCode) => {
    changeLang(langCode);
    setShowLangMenu(false);
  };

  return (
    <div 
      className="min-h-screen transition-all duration-1000"
      style={{ background: theme.background }}
    >
      {/* 顶部导航栏 */}
      <header 
        className={`sticky top-0 z-50 ${theme.blur} ${theme.shadow} transition-all duration-300`}
        style={{ 
          background: theme.cardBackground,
          border: `1px solid ${theme.borderColor}`,
          borderRadius: '0 0 24px 24px'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 左侧 - Logo和标题 */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-float">
                <span className="text-white text-xl">🌤️</span>
              </div>
              <h1 className={`text-xl font-bold ${theme.textColor} hidden sm:block`}>
                {t('appTitle')}
              </h1>
            </div>

            {/* 中间 - 桌面端导航 */}
            {!isMobile && (
              <nav className="flex space-x-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                      currentPage === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : `${theme.textColor} hover:bg-white/10 hover:scale-105`
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            )}

            {/* 右侧 - 控制按钮 */}
            <div className="flex items-center space-x-3">
              {/* 语言切换 */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className={`p-3 rounded-xl ${theme.blur} transition-all duration-300 hover:scale-110 hover:rotate-12 ${theme.shadow}`}
                  style={{ 
                    background: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                    border: `1px solid ${theme.borderColor}`
                  }}
                >
                  <span className="text-xl">🌍</span>
                </button>

                {/* 语言菜单 */}
                {showLangMenu && (
                  <div 
                    className={`absolute right-0 mt-2 py-2 w-48 ${theme.blur} ${theme.shadow} rounded-2xl z-50 animate-slideInUp`}
                    style={{ 
                      background: theme.cardBackground,
                      border: `1px solid ${theme.borderColor}`
                    }}
                  >
                    {Object.entries(supportedLanguages).map(([code, name]) => (
                      <button
                        key={code}
                        onClick={() => handleLanguageChange(code)}
                        className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between ${
                          currentLang === code 
                            ? `${theme.textColor} bg-gradient-to-r from-blue-500/20 to-purple-600/20` 
                            : `${theme.textColor} hover:bg-white/10`
                        }`}
                      >
                        <span>{name}</span>
                        {currentLang === code && <span className="text-green-400">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 主题切换 */}
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl ${theme.blur} transition-all duration-300 hover:scale-110 hover:rotate-12 ${theme.shadow}`}
                style={{ 
                  background: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                  border: `1px solid ${theme.borderColor}`
                }}
              >
                <span className="text-xl">{isDarkMode ? '🌙' : '☀️'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* 移动端底部导航 */}
      {isMobile && (
        <nav 
          className={`fixed bottom-0 left-0 right-0 ${theme.blur} ${theme.shadow} z-50`}
          style={{ 
            background: theme.cardBackground,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: '24px 24px 0 0'
          }}
        >
          <div className="flex items-center justify-around py-3 px-4">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-110'
                    : `${theme.textColor} hover:bg-white/10 hover:scale-105`
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* 点击外部关闭语言菜单 */}
      {showLangMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowLangMenu(false)}
        />
      )}
    </div>
  );
};

export default PageLayout;

