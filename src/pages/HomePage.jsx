import { useState } from 'react';
import PageLayout, { Pages } from '@/components/layout/PageLayout';
import CurrentWeatherCard from '@/components/weather/CurrentWeatherCard';
import HourlyForecast from '@/components/weather/HourlyForecast';
import DailyForecast from '@/components/weather/DailyForecast';
import WeatherDetails from '@/components/weather/WeatherDetails';
import WeatherBackground from '@/components/weather/WeatherBackground';
import CityManagement from '@/components/cities/CityManagement';
import SettingsPage from '@/components/settings/SettingsPage';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(Pages.WEATHER);
  const { getTimeOfDayClasses } = useTheme();
  const { t } = useLang();

  // 渲染当前页面内容
  const renderPageContent = () => {
    switch (currentPage) {
      case Pages.WEATHER:
        return (
          <div className="space-y-6">
            <CurrentWeatherCard />
            <HourlyForecast />
            <WeatherDetails />
          </div>
        );
      
      case Pages.FORECAST:
        return (
          <div className="space-y-6">
            <DailyForecast />
          </div>
        );
      
      case Pages.CITIES:
        return (
          <div className="space-y-6">
            <CityManagement />
          </div>
        );
      
      case Pages.SETTINGS:
        return (
          <div className="space-y-6">
            <SettingsPage />
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            <CurrentWeatherCard />
            <HourlyForecast />
            <WeatherDetails />
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen relative ${getTimeOfDayClasses()}`}>
      {/* 3D背景 */}
      <WeatherBackground />
      
      {/* 页面布局 */}
      <PageLayout 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
      >
        {/* 页面内容 */}
        <div className="relative z-10">
          {renderPageContent()}
        </div>
      </PageLayout>
    </div>
  );
}

