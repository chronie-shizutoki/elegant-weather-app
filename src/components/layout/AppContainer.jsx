import { useEffect } from 'react';
import { useTheme, TimeOfDay } from '@/contexts/ThemeContext';
import { useWeather } from '@/contexts/WeatherContext';

// 根据时间段和天气类型获取背景样式
const getBackgroundStyle = (timeOfDay, weatherType) => {
  // 基础渐变色
  let gradientColors = {
    [TimeOfDay.MORNING]: 'from-blue-200 to-yellow-100',
    [TimeOfDay.NOON]: 'from-blue-400 to-blue-200',
    [TimeOfDay.AFTERNOON]: 'from-orange-300 to-yellow-200',
    [TimeOfDay.NIGHT]: 'from-blue-900 to-gray-900',
  };

  // 根据天气类型调整背景
  if (weatherType) {
    switch (weatherType) {
      case 'cloudy':
        gradientColors = {
          ...gradientColors,
          [TimeOfDay.MORNING]: 'from-gray-300 to-blue-200',
          [TimeOfDay.NOON]: 'from-gray-400 to-blue-300',
          [TimeOfDay.AFTERNOON]: 'from-gray-400 to-orange-200',
          [TimeOfDay.NIGHT]: 'from-gray-800 to-blue-900',
        };
        break;
      case 'overcast':
        gradientColors = {
          ...gradientColors,
          [TimeOfDay.MORNING]: 'from-gray-400 to-gray-300',
          [TimeOfDay.NOON]: 'from-gray-500 to-gray-400',
          [TimeOfDay.AFTERNOON]: 'from-gray-500 to-gray-400',
          [TimeOfDay.NIGHT]: 'from-gray-900 to-gray-800',
        };
        break;
      case 'rain':
      case 'heavy_rain':
      case 'thunderstorm':
        gradientColors = {
          ...gradientColors,
          [TimeOfDay.MORNING]: 'from-gray-500 to-blue-400',
          [TimeOfDay.NOON]: 'from-gray-600 to-blue-500',
          [TimeOfDay.AFTERNOON]: 'from-gray-600 to-blue-500',
          [TimeOfDay.NIGHT]: 'from-gray-900 to-blue-900',
        };
        break;
      case 'snow':
        gradientColors = {
          ...gradientColors,
          [TimeOfDay.MORNING]: 'from-gray-200 to-blue-100',
          [TimeOfDay.NOON]: 'from-gray-300 to-blue-200',
          [TimeOfDay.AFTERNOON]: 'from-gray-300 to-blue-200',
          [TimeOfDay.NIGHT]: 'from-gray-700 to-blue-800',
        };
        break;
      case 'fog':
        gradientColors = {
          ...gradientColors,
          [TimeOfDay.MORNING]: 'from-gray-300 to-gray-200',
          [TimeOfDay.NOON]: 'from-gray-400 to-gray-300',
          [TimeOfDay.AFTERNOON]: 'from-gray-400 to-gray-300',
          [TimeOfDay.NIGHT]: 'from-gray-800 to-gray-700',
        };
        break;
      default:
        // 保持默认渐变色
        break;
    }
  }

  return `bg-gradient-to-b ${gradientColors[timeOfDay]}`;
};

// 应用容器组件
export default function AppContainer({ children }) {
  const { timeOfDay } = useTheme();
  const { currentWeather } = useWeather();
  
  // 获取背景样式
  const backgroundStyle = getBackgroundStyle(
    timeOfDay, 
    currentWeather?.weatherType
  );

  // 当时间段或天气类型变化时，更新body类名
  useEffect(() => {
    document.body.className = backgroundStyle;
    
    return () => {
      document.body.className = '';
    };
  }, [backgroundStyle]);

  return (
    <div className={`min-h-screen w-full transition-colors duration-1000 ${backgroundStyle}`}>
      <div className="container mx-auto px-4 py-6 min-h-screen">
        {children}
      </div>
    </div>
  );
}

