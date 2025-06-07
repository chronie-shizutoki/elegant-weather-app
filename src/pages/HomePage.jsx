import { useEffect } from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import PageLayout from '@/components/layout/PageLayout';
import CurrentWeatherCard from '@/components/weather/CurrentWeatherCard';
import HourlyForecast from '@/components/weather/HourlyForecast';
import DailyForecast from '@/components/weather/DailyForecast';
import WeatherDetails from '@/components/weather/WeatherDetails';

export default function HomePage() {
  const { currentWeather } = useWeather();
  const { timeOfDay } = useTheme();
  
  // 页面标题
  const pageTitle = currentWeather?.location?.name || '天气';
  
  // 根据时间段和天气类型设置页面背景
  useEffect(() => {
    // 这里可以添加更复杂的背景效果，如3D渲染等
    // 目前使用简单的背景色渐变
    document.body.classList.add('transition-colors', 'duration-1000');
    
    return () => {
      document.body.classList.remove('transition-colors', 'duration-1000');
    };
  }, [timeOfDay]);

  return (
    <PageLayout title={pageTitle}>
      <div className="space-y-4 pb-20">
        {/* 当前天气卡片 */}
        <CurrentWeatherCard />
        
        {/* 小时预报 */}
        <HourlyForecast />
        
        {/* 每日预报 */}
        <DailyForecast days={7} />
        
        {/* 天气详情 */}
        <WeatherDetails />
        
        {/* 底部空间，确保内容不被底部导航栏遮挡 */}
        <div className="h-16"></div>
      </div>
    </PageLayout>
  );
}

