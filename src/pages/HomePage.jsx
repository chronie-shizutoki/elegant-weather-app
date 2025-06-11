import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import CurrentWeatherCard from '@/components/weather/CurrentWeatherCard';
import HourlyForecast from '@/components/weather/HourlyForecast';
import DailyForecast from '@/components/weather/DailyForecast';
import WeatherDetails from '@/components/weather/WeatherDetails';
import CityManagement from '@/components/cities/CityManagement';
import SettingsPage from '@/components/settings/SettingsPage';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState('weather');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'weather':
        return (
          <div className="space-y-6">
            <CurrentWeatherCard />
            <HourlyForecast />
            <WeatherDetails />
          </div>
        );
      case 'forecast':
        return (
          <div className="space-y-6">
            <DailyForecast />
          </div>
        );
      case 'cities':
        return (
          <div className="space-y-6">
            <CityManagement />
          </div>
        );
      case 'settings':
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
    <PageLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </PageLayout>
  );
};

export default HomePage;

