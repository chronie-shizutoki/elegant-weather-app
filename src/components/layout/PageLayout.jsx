import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';
import { 
  Cloud, 
  Calendar, 
  MapPin, 
  Settings, 
  Menu,
  X,
  Globe,
  Palette
} from 'lucide-react';

// 页面枚举
export const Pages = {
  WEATHER: 'weather',
  FORECAST: 'forecast',
  CITIES: 'cities',
  SETTINGS: 'settings'
};

export default function PageLayout({ children, currentPage, onPageChange }) {
  const { getCardStyle, getTextColor, timeOfDay, toggleDarkMode, isDarkMode } = useTheme();
  const { t, changeLanguage, currentLanguage, supportedLanguages } = useLang();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // 导航项配置
  const navItems = [
    {
      id: Pages.WEATHER,
      icon: Cloud,
      label: t('nav.weather'),
      color: 'text-blue-400'
    },
    {
      id: Pages.FORECAST,
      icon: Calendar,
      label: t('nav.forecast'),
      color: 'text-green-400'
    },
    {
      id: Pages.CITIES,
      icon: MapPin,
      label: t('nav.cities'),
      color: 'text-orange-400'
    },
    {
      id: Pages.SETTINGS,
      icon: Settings,
      label: t('nav.more'),
      color: 'text-purple-400'
    }
  ];

  // 切换语言
  const handleLanguageChange = (language) => {
    changeLanguage(language);
    setShowLanguageMenu(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <header 
        className="sticky top-0 z-50 p-4"
        style={getCardStyle(0.95)}
      >
        <div className="flex items-center justify-between">
          {/* 左侧：应用标题 */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
              <Cloud className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: getTextColor() }}>
                {t('app.title')}
              </h1>
              <p className="text-xs" style={{ color: getTextColor('secondary') }}>
                {t('app.subtitle')}
              </p>
            </div>
          </div>

          {/* 右侧：工具按钮 */}
          <div className="flex items-center space-x-2">
            {/* 语言切换按钮 */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                style={{ color: getTextColor('secondary') }}
              >
                <Globe size={20} />
              </button>

              {/* 语言菜单 */}
              {showLanguageMenu && (
                <div 
                  className="absolute right-0 top-12 w-48 py-2 rounded-lg shadow-lg z-50"
                  style={getCardStyle(0.95)}
                >
                  {Object.entries(supportedLanguages).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => handleLanguageChange(code)}
                      className={`w-full px-4 py-2 text-left hover:bg-white hover:bg-opacity-20 transition-all duration-200 ${
                        currentLanguage === code ? 'bg-white bg-opacity-10' : ''
                      }`}
                      style={{ color: getTextColor() }}
                    >
                      {name}
                      {currentLanguage === code && (
                        <span className="float-right text-blue-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 主题切换按钮 */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
              style={{ color: getTextColor('secondary') }}
            >
              <Palette size={20} />
            </button>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
              style={{ color: getTextColor('secondary') }}
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pt-4 border-t border-white border-opacity-20">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-white bg-opacity-20 scale-105' 
                        : 'hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <Icon 
                      size={20} 
                      className={isActive ? item.color : ''} 
                      style={{ color: isActive ? undefined : getTextColor('secondary') }}
                    />
                    <span 
                      className={`text-sm ${isActive ? 'font-semibold' : ''}`}
                      style={{ color: isActive ? getTextColor() : getTextColor('secondary') }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* 主要内容区域 */}
      <main className="flex-1 p-4 pb-20 md:pb-4">
        {children}
      </main>

      {/* 底部导航栏（桌面端） */}
      <nav 
        className="hidden md:block fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        style={getCardStyle(0.95)}
      >
        <div className="flex items-center space-x-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-white bg-opacity-20 scale-110 shadow-lg' 
                    : 'hover:bg-white hover:bg-opacity-10 hover:scale-105'
                }`}
                style={{ minWidth: '80px' }}
              >
                <Icon 
                  size={24} 
                  className={`transition-all duration-300 ${isActive ? `${item.color} animate-pulse` : ''}`}
                  style={{ color: isActive ? undefined : getTextColor('secondary') }}
                />
                <span 
                  className={`text-xs transition-all duration-300 ${isActive ? 'font-semibold' : ''}`}
                  style={{ color: isActive ? getTextColor() : getTextColor('secondary') }}
                >
                  {item.label}
                </span>
                
                {/* 活动指示器 */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 移动端底部导航栏 */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={getCardStyle(0.95)}
      >
        <div className="flex items-center justify-around p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-white bg-opacity-20 scale-110' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
                style={{ minWidth: '60px' }}
              >
                <Icon 
                  size={20} 
                  className={`transition-all duration-300 ${isActive ? `${item.color} animate-pulse` : ''}`}
                  style={{ color: isActive ? undefined : getTextColor('secondary') }}
                />
                <span 
                  className={`text-xs transition-all duration-300 ${isActive ? 'font-semibold' : ''}`}
                  style={{ color: isActive ? getTextColor() : getTextColor('secondary') }}
                >
                  {item.label}
                </span>
                
                {/* 活动指示器 */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 点击外部关闭菜单 */}
      {(showLanguageMenu || showMobileMenu) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowLanguageMenu(false);
            setShowMobileMenu(false);
          }}
        />
      )}
    </div>
  );
}

