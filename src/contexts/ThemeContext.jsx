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
  const [timeOfDay, setTimeOfDay] = useState('afternoon');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 获取当前时间段
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 14) return 'noon';
    if (hour >= 14 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  };

  // 检测系统深色模式偏好
  const checkSystemDarkMode = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  useEffect(() => {
    // 初始化时间段
    setTimeOfDay(getTimeOfDay());
    
    // 初始化深色模式
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(checkSystemDarkMode());
    }

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);

    // 每分钟更新时间段
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearInterval(interval);
    };
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // 获取时间段相关的背景渐变
  const getTimeGradient = () => {
    const gradients = {
      morning: isDarkMode 
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
        : 'linear-gradient(135deg, rgba(135, 206, 235, 0.8) 0%, rgba(255, 228, 181, 0.8) 100%)',
      noon: isDarkMode
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)'
        : 'linear-gradient(135deg, rgba(30, 144, 255, 0.8) 0%, rgba(135, 206, 250, 0.8) 100%)',
      afternoon: isDarkMode
        ? 'linear-gradient(135deg, rgba(51, 65, 85, 0.95) 0%, rgba(71, 85, 105, 0.95) 100%)'
        : 'linear-gradient(135deg, rgba(255, 127, 80, 0.8) 0%, rgba(255, 215, 0, 0.8) 100%)',
      evening: isDarkMode
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
        : 'linear-gradient(135deg, rgba(255, 99, 71, 0.8) 0%, rgba(255, 140, 0, 0.8) 100%)',
      night: isDarkMode
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)'
        : 'linear-gradient(135deg, rgba(25, 25, 112, 0.9) 0%, rgba(72, 61, 139, 0.9) 100%)'
    };
    return gradients[timeOfDay];
  };

  // 获取卡片背景样式
  const getCardBackground = () => {
    if (isDarkMode) {
      return 'rgba(15, 23, 42, 0.7)';
    }
    return 'rgba(255, 255, 255, 0.2)';
  };

  // 获取文本颜色
  const getTextColor = () => {
    return isDarkMode ? 'text-white' : 'text-gray-800';
  };

  // 获取次要文本颜色
  const getSecondaryTextColor = () => {
    return isDarkMode ? 'text-gray-300' : 'text-gray-600';
  };

  // 获取边框颜色
  const getBorderColor = () => {
    return isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)';
  };

  const value = {
    timeOfDay,
    isDarkMode,
    toggleDarkMode,
    getTimeGradient,
    getCardBackground,
    getTextColor,
    getSecondaryTextColor,
    getBorderColor,
    theme: {
      background: getTimeGradient(),
      cardBackground: getCardBackground(),
      textColor: getTextColor(),
      secondaryTextColor: getSecondaryTextColor(),
      borderColor: getBorderColor(),
      blur: 'backdrop-blur-xl',
      shadow: isDarkMode ? 'shadow-2xl shadow-black/50' : 'shadow-2xl shadow-black/20'
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

