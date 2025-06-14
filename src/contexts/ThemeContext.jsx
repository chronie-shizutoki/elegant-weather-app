import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('afternoon');
  const [weatherCondition, setWeatherCondition] = useState('cloudy');

  // 获取当前时间段
  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'noon';
    if (hour >= 17 && hour < 20) return 'afternoon';
    return 'night';
  };

  // 检测系统主题偏好
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = getSystemTheme();
    const currentTime = getCurrentTimeOfDay();
    
    setTimeOfDay(currentTime);
    
    if (savedTheme === 'dark' || (savedTheme === 'auto' && systemDark)) {
      setIsDarkMode(true);
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
    } else {
      // 根据时间自动切换
      setIsDarkMode(currentTime === 'night' || systemDark);
    }
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'auto' || !savedTheme) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 定时更新时间段
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeOfDay = getCurrentTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
        
        // 如果是自动模式，根据时间调整主题
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'auto' || !savedTheme) {
          setIsDarkMode(newTimeOfDay === 'night' || getSystemTheme());
        }
      }
    }, 60000); // 每分钟检查一次

    return () => clearInterval(interval);
  }, [timeOfDay]);

  // 切换深色模式
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // 设置主题模式
  const setThemeMode = (mode) => {
    localStorage.setItem('theme', mode);
    if (mode === 'dark') {
      setIsDarkMode(true);
    } else if (mode === 'light') {
      setIsDarkMode(false);
    } else {
      // auto mode
      const systemDark = getSystemTheme();
      const currentTime = getCurrentTimeOfDay();
      setIsDarkMode(currentTime === 'night' || systemDark);
    }
  };

  // 获取主题样式
  const getThemeStyles = () => {
    const baseStyles = {
      textColor: isDarkMode ? 'text-white' : 'text-gray-900',
      secondaryTextColor: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      backgroundColor: isDarkMode ? 'bg-gray-900' : 'bg-white',
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      glassBackground: isDarkMode 
        ? 'rgba(0, 0, 0, 0.3)' 
        : 'rgba(255, 255, 255, 0.1)',
      glassBackgroundStrong: isDarkMode 
        ? 'rgba(0, 0, 0, 0.5)' 
        : 'rgba(255, 255, 255, 0.2)',
      shadow: isDarkMode 
        ? 'shadow-2xl shadow-black/20' 
        : 'shadow-2xl shadow-black/10',
      blur: 'glass-morphism',
      blurStrong: 'glass-morphism-strong',
      blurUltra: 'glass-morphism-ultra'
    };

    // 根据时间段调整背景渐变
    const timeGradients = {
      morning: 'weather-gradient-morning',
      noon: 'weather-gradient-noon', 
      afternoon: 'weather-gradient-afternoon',
      night: 'weather-gradient-night'
    };

    return {
      ...baseStyles,
      backgroundGradient: timeGradients[timeOfDay] || timeGradients.afternoon,
      timeOfDay,
      weatherCondition
    };
  };

  const value = {
    isDarkMode,
    timeOfDay,
    weatherCondition,
    toggleDarkMode,
    setThemeMode,
    setWeatherCondition,
    theme: getThemeStyles()
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

