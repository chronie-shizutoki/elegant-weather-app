import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useWeather } from '@/contexts/WeatherContext';

const AppContainer = ({ children }) => {
  const { theme, timeOfDay, isDarkMode } = useTheme();
  const { currentWeather } = useWeather();

  useEffect(() => {
    // 设置CSS变量用于全局主题
    const root = document.documentElement;
    root.style.setProperty('--theme-background', theme.background);
    root.style.setProperty('--theme-card-background', theme.cardBackground);
    root.style.setProperty('--theme-text-color', isDarkMode ? '#ffffff' : '#1f2937');
    root.style.setProperty('--theme-secondary-text-color', isDarkMode ? '#d1d5db' : '#6b7280');
    root.style.setProperty('--theme-border-color', theme.borderColor);
  }, [theme, isDarkMode]);

  return (
    <div 
      className={`min-h-screen transition-all duration-1000 ${isDarkMode ? 'dark' : ''}`}
      style={{ background: theme.background }}
    >
      {children}
    </div>
  );
};

export default AppContainer;

