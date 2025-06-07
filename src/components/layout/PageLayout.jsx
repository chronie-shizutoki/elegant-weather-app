import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';
import { useWeather } from '@/contexts/WeatherContext';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Menu, 
  Sun, 
  Moon, 
  Globe, 
  RefreshCw,
  MapPin,
  Plus
} from 'lucide-react';

// 页面布局组件
export default function PageLayout({ children, title, showBackButton = false, onBack }) {
  const { darkMode, toggleDarkMode, timeOfDay } = useTheme();
  const { currentLang, supportedLanguages, changeLang } = useLang();
  const { refreshWeather, isLoading } = useWeather();
  
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  // 处理刷新按钮点击
  const handleRefresh = () => {
    refreshWeather();
  };
  
  // 处理语言切换
  const handleLanguageChange = (lang) => {
    changeLang(lang);
    setShowLangMenu(false);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 页面头部 */}
      <header className="flex justify-between items-center py-4">
        <div className="flex items-center">
          {showBackButton ? (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
            </Button>
          )}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 刷新按钮 */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isLoading}
            className={isLoading ? 'animate-spin' : ''}
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          
          {/* 深色模式切换 */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {/* 语言切换 */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowLangMenu(!showLangMenu)}
            >
              <Globe className="h-5 w-5" />
            </Button>
            
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {Object.entries(supportedLanguages).map(([code, { nativeName }]) => (
                    <button
                      key={code}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        currentLang === code 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handleLanguageChange(code)}
                    >
                      {nativeName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 设置按钮 */}
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      {/* 主要内容 */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      
      {/* 底部导航 */}
      <footer className="py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around items-center">
          <Button variant="ghost" className="flex flex-col items-center">
            <MapPin className="h-6 w-6 mb-1" />
            <span className="text-xs">城市</span>
          </Button>
          
          <Button variant="ghost" className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud mb-1">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
            </svg>
            <span className="text-xs">天气</span>
          </Button>
          
          <Button variant="ghost" className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-2 mb-1">
              <line x1="18" x2="18" y1="20" y2="10"/>
              <line x1="12" x2="12" y1="20" y2="4"/>
              <line x1="6" x2="6" y1="20" y2="14"/>
            </svg>
            <span className="text-xs">预报</span>
          </Button>
          
          <Button variant="ghost" className="flex flex-col items-center">
            <Plus className="h-6 w-6 mb-1" />
            <span className="text-xs">更多</span>
          </Button>
        </div>
      </footer>
    </div>
  );
}

