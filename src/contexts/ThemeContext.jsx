import { createContext, useContext, useEffect, useState } from 'react';

// 创建主题上下文
const ThemeContext = createContext();

// 时间段枚举
export const TimeOfDay = {
  MORNING: 'morning',   // 早晨 (5:00 - 10:00)
  NOON: 'noon',         // 中午 (10:00 - 15:00)
  AFTERNOON: 'afternoon', // 下午 (15:00 - 19:00)
  NIGHT: 'night',       // 晚上 (19:00 - 5:00)
};

// 主题提供者组件
export function ThemeProvider({ children }) {
  // 深色模式状态
  const [darkMode, setDarkMode] = useState(false);
  
  // 当前时间段状态
  const [timeOfDay, setTimeOfDay] = useState(TimeOfDay.MORNING);
  
  // 自动切换模式状态
  const [autoMode, setAutoMode] = useState(true);

  // 根据当前时间确定时间段
  const determineTimeOfDay = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 10) {
      return TimeOfDay.MORNING;
    } else if (hour >= 10 && hour < 15) {
      return TimeOfDay.NOON;
    } else if (hour >= 15 && hour < 19) {
      return TimeOfDay.AFTERNOON;
    } else {
      return TimeOfDay.NIGHT;
    }
  };

  // 根据时间段自动设置深色模式
  const setThemeByTime = () => {
    const currentTimeOfDay = determineTimeOfDay();
    setTimeOfDay(currentTimeOfDay);
    
    // 晚上自动切换到深色模式
    if (currentTimeOfDay === TimeOfDay.NIGHT) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  };

  // 检测系统颜色模式
  const detectSystemColorScheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  };

  // 手动切换深色模式
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    setAutoMode(false); // 手动切换时关闭自动模式
  };

  // 切换自动模式
  const toggleAutoMode = () => {
    setAutoMode(prev => !prev);
    if (!autoMode) {
      // 重新开启自动模式时，立即应用当前时间的主题
      setThemeByTime();
    }
  };

  // 手动设置时间段（用于测试不同时间段的UI）
  const setManualTimeOfDay = (time) => {
    setTimeOfDay(time);
    setAutoMode(false); // 手动设置时关闭自动模式
  };

  // 初始化和自动更新
  useEffect(() => {
    // 初始化时检测系统颜色模式
    detectSystemColorScheme();
    
    // 初始化时设置当前时间段
    setThemeByTime();
    
    // 监听系统颜色模式变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (autoMode) {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // 每分钟更新一次时间段
    const timer = setInterval(() => {
      if (autoMode) {
        setThemeByTime();
      }
    }, 60000);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearInterval(timer);
    };
  }, [autoMode]);

  // 应用深色模式类名到文档
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 提供的上下文值
  const value = {
    darkMode,
    timeOfDay,
    autoMode,
    toggleDarkMode,
    toggleAutoMode,
    setManualTimeOfDay,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 自定义钩子，用于访问主题上下文
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

