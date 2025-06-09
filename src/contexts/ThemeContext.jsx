import { createContext, useContext, useState, useEffect } from 'react';

// 时间段枚举
export const TimeOfDay = {
  MORNING: 'morning',     // 6:00 - 11:59
  NOON: 'noon',          // 12:00 - 13:59
  AFTERNOON: 'afternoon', // 14:00 - 17:59
  EVENING: 'evening',    // 18:00 - 19:59
  NIGHT: 'night'         // 20:00 - 5:59
};

// 主题模式
export const ThemeMode = {
  AUTO: 'auto',
  LIGHT: 'light',
  DARK: 'dark'
};

// 创建上下文
const ThemeContext = createContext();

// 获取当前时间段
function getCurrentTimeOfDay() {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return TimeOfDay.MORNING;
  } else if (hour >= 12 && hour < 14) {
    return TimeOfDay.NOON;
  } else if (hour >= 14 && hour < 18) {
    return TimeOfDay.AFTERNOON;
  } else if (hour >= 18 && hour < 20) {
    return TimeOfDay.EVENING;
  } else {
    return TimeOfDay.NIGHT;
  }
}

// 根据时间段获取主题色彩
function getThemeColors(timeOfDay) {
  const themes = {
    [TimeOfDay.MORNING]: {
      primary: '#87CEEB',      // 天蓝色
      secondary: '#FFE4B5',    // 淡黄色
      background: 'linear-gradient(135deg, #87CEEB 0%, #FFE4B5 50%, #FFF8DC 100%)',
      text: '#2C3E50',
      cardBg: 'rgba(255, 255, 255, 0.8)',
      cardBorder: 'rgba(135, 206, 235, 0.3)',
      shadow: 'rgba(135, 206, 235, 0.2)'
    },
    [TimeOfDay.NOON]: {
      primary: '#1E90FF',      // 道奇蓝
      secondary: '#87CEFA',    // 淡蓝色
      background: 'linear-gradient(135deg, #1E90FF 0%, #87CEFA 50%, #B0E0E6 100%)',
      text: '#FFFFFF',
      cardBg: 'rgba(255, 255, 255, 0.9)',
      cardBorder: 'rgba(30, 144, 255, 0.3)',
      shadow: 'rgba(30, 144, 255, 0.3)'
    },
    [TimeOfDay.AFTERNOON]: {
      primary: '#FF7F50',      // 珊瑚色
      secondary: '#FFD700',    // 金色
      background: 'linear-gradient(135deg, #FF7F50 0%, #FFD700 50%, #FFA500 100%)',
      text: '#FFFFFF',
      cardBg: 'rgba(255, 255, 255, 0.85)',
      cardBorder: 'rgba(255, 127, 80, 0.3)',
      shadow: 'rgba(255, 127, 80, 0.3)'
    },
    [TimeOfDay.EVENING]: {
      primary: '#FF6347',      // 番茄色
      secondary: '#FF8C00',    // 深橙色
      background: 'linear-gradient(135deg, #FF6347 0%, #FF8C00 50%, #FFA500 100%)',
      text: '#FFFFFF',
      cardBg: 'rgba(255, 255, 255, 0.8)',
      cardBorder: 'rgba(255, 99, 71, 0.3)',
      shadow: 'rgba(255, 99, 71, 0.3)'
    },
    [TimeOfDay.NIGHT]: {
      primary: '#191970',      // 午夜蓝
      secondary: '#483D8B',    // 深蓝紫色
      background: 'linear-gradient(135deg, #191970 0%, #483D8B 50%, #2F4F4F 100%)',
      text: '#FFFFFF',
      cardBg: 'rgba(255, 255, 255, 0.1)',
      cardBorder: 'rgba(255, 255, 255, 0.2)',
      shadow: 'rgba(0, 0, 0, 0.3)'
    }
  };
  
  return themes[timeOfDay] || themes[TimeOfDay.MORNING];
}

// 获取时间段显示名称
function getTimeOfDayName(timeOfDay, t) {
  const names = {
    [TimeOfDay.MORNING]: t('time.morning'),
    [TimeOfDay.NOON]: t('time.noon'),
    [TimeOfDay.AFTERNOON]: t('time.afternoon'),
    [TimeOfDay.EVENING]: t('time.evening'),
    [TimeOfDay.NIGHT]: t('time.night')
  };
  
  return names[timeOfDay] || names[TimeOfDay.MORNING];
}

// Provider 组件
export function ThemeProvider({ children }) {
  const [timeOfDay, setTimeOfDay] = useState(getCurrentTimeOfDay());
  const [themeMode, setThemeMode] = useState(ThemeMode.AUTO);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 从本地存储加载主题设置
  useEffect(() => {
    const savedThemeMode = localStorage.getItem('weather-app-theme-mode');
    if (savedThemeMode && Object.values(ThemeMode).includes(savedThemeMode)) {
      setThemeMode(savedThemeMode);
    }
  }, []);

  // 更新时间段
  useEffect(() => {
    const updateTimeOfDay = () => {
      setTimeOfDay(getCurrentTimeOfDay());
    };

    // 立即更新一次
    updateTimeOfDay();

    // 每分钟检查一次时间变化
    const interval = setInterval(updateTimeOfDay, 60000);

    return () => clearInterval(interval);
  }, []);

  // 根据主题模式和时间段确定是否为深色模式
  useEffect(() => {
    let shouldBeDark = false;

    switch (themeMode) {
      case ThemeMode.DARK:
        shouldBeDark = true;
        break;
      case ThemeMode.LIGHT:
        shouldBeDark = false;
        break;
      case ThemeMode.AUTO:
      default:
        // 自动模式：夜晚时间使用深色模式
        shouldBeDark = timeOfDay === TimeOfDay.NIGHT;
        break;
    }

    setIsDarkMode(shouldBeDark);

    // 更新HTML类名
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode, timeOfDay]);

  // 应用主题色彩到CSS变量
  useEffect(() => {
    const colors = getThemeColors(timeOfDay);
    const root = document.documentElement;

    // 设置CSS变量
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-background', colors.background);
    root.style.setProperty('--theme-text', colors.text);
    root.style.setProperty('--theme-card-bg', colors.cardBg);
    root.style.setProperty('--theme-card-border', colors.cardBorder);
    root.style.setProperty('--theme-shadow', colors.shadow);

    // 设置body背景
    document.body.style.background = colors.background;
    document.body.style.color = colors.text;
    document.body.style.transition = 'all 1s ease-in-out';
  }, [timeOfDay]);

  // 切换主题模式
  const changeThemeMode = (mode) => {
    if (Object.values(ThemeMode).includes(mode)) {
      setThemeMode(mode);
      localStorage.setItem('weather-app-theme-mode', mode);
    }
  };

  // 手动切换深色模式
  const toggleDarkMode = () => {
    const newMode = isDarkMode ? ThemeMode.LIGHT : ThemeMode.DARK;
    changeThemeMode(newMode);
  };

  // 获取当前主题信息
  const getCurrentTheme = () => {
    return {
      timeOfDay,
      themeMode,
      isDarkMode,
      colors: getThemeColors(timeOfDay)
    };
  };

  // 获取时间段相关的样式类
  const getTimeOfDayClasses = () => {
    const baseClasses = 'transition-all duration-1000 ease-in-out';
    
    switch (timeOfDay) {
      case TimeOfDay.MORNING:
        return `${baseClasses} morning-theme`;
      case TimeOfDay.NOON:
        return `${baseClasses} noon-theme`;
      case TimeOfDay.AFTERNOON:
        return `${baseClasses} afternoon-theme`;
      case TimeOfDay.EVENING:
        return `${baseClasses} evening-theme`;
      case TimeOfDay.NIGHT:
        return `${baseClasses} night-theme`;
      default:
        return baseClasses;
    }
  };

  // 获取卡片样式
  const getCardStyle = (opacity = 0.8) => {
    const colors = getThemeColors(timeOfDay);
    return {
      background: colors.cardBg.replace('0.8', opacity.toString()),
      border: `1px solid ${colors.cardBorder}`,
      boxShadow: `0 8px 32px ${colors.shadow}`,
      backdropFilter: 'blur(10px)',
      borderRadius: '16px'
    };
  };

  // 获取文本颜色
  const getTextColor = (variant = 'primary') => {
    const colors = getThemeColors(timeOfDay);
    
    switch (variant) {
      case 'primary':
        return colors.text;
      case 'secondary':
        return isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
      case 'muted':
        return isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
      default:
        return colors.text;
    }
  };

  const value = {
    timeOfDay,
    themeMode,
    isDarkMode,
    changeThemeMode,
    toggleDarkMode,
    getCurrentTheme,
    getTimeOfDayClasses,
    getCardStyle,
    getTextColor,
    getTimeOfDayName: (t) => getTimeOfDayName(timeOfDay, t),
    colors: getThemeColors(timeOfDay)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

