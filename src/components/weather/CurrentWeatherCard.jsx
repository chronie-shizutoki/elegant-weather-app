import { useEffect, useState } from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';

const CurrentWeatherCard = () => {
  const { currentWeather, loading } = useWeather();
  const { theme, isDarkMode } = useTheme();
  const { t } = useLang();
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fadeIn');
    const timer = setTimeout(() => setAnimationClass(''), 600);
    return () => clearTimeout(timer);
  }, [currentWeather]);

  if (loading) {
    return (
      <div 
        className={`rounded-3xl p-8 ${theme.blur} ${theme.shadow} ${animationClass}`}
        style={{ 
          background: theme.cardBackground,
          border: `1px solid ${theme.borderColor}`
        }}
      >
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  const getWeatherIcon = (condition) => {
    const iconMap = {
      'sunny': '☀️',
      'cloudy': '☁️',
      'overcast': '☁️',
      'lightRain': '🌦️',
      'moderateRain': '🌧️',
      'heavyRain': '⛈️',
      'thunderstorm': '⛈️',
      'snow': '❄️',
      'fog': '🌫️'
    };
    return iconMap[condition] || '☀️';
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'from-green-400 to-green-600';
    if (aqi <= 100) return 'from-yellow-400 to-yellow-600';
    if (aqi <= 150) return 'from-orange-400 to-orange-600';
    if (aqi <= 200) return 'from-red-400 to-red-600';
    if (aqi <= 300) return 'from-purple-400 to-purple-600';
    return 'from-red-600 to-red-800';
  };

  const getUVColor = (uv) => {
    if (uv <= 2) return 'from-green-400 to-green-600';
    if (uv <= 5) return 'from-yellow-400 to-yellow-600';
    if (uv <= 7) return 'from-orange-400 to-orange-600';
    if (uv <= 10) return 'from-red-400 to-red-600';
    return 'from-purple-400 to-purple-600';
  };

  return (
    <div 
      className={`rounded-3xl p-8 ${theme.blur} ${theme.shadow} ${animationClass} transition-all duration-500 hover:scale-[1.02] card-hover`}
      style={{ 
        background: theme.cardBackground,
        border: `1px solid ${theme.borderColor}`
      }}
    >
      {/* 位置信息 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
            <span className="text-white text-xs">📍</span>
          </div>
          <span className={`text-lg font-medium ${theme.textColor}`}>
            {currentWeather.location}
          </span>
        </div>
        <button className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12">
          <span className="text-white text-lg">🔄</span>
        </button>
      </div>

      {/* 主要天气信息 */}
      <div className="text-center mb-8">
        <div className="mb-6 animate-float">
          <div className="text-8xl mb-4 filter drop-shadow-lg">
            {getWeatherIcon(currentWeather.condition)}
          </div>
          <div className={`text-2xl font-medium ${theme.textColor} mb-2`}>
            {t(currentWeather.condition)}
          </div>
        </div>
        
        <div className={`text-7xl font-thin ${theme.textColor} mb-4 animate-scaleIn`}>
          {currentWeather.temperature}°
        </div>
        
        <div className={`flex items-center justify-center space-x-6 ${theme.secondaryTextColor}`}>
          <span className="flex items-center space-x-1">
            <span className="text-blue-400">↗</span>
            <span>{t('maxTemp')}: {currentWeather.maxTemp}°</span>
          </span>
          <span className="w-1 h-1 bg-current rounded-full opacity-50"></span>
          <span className="flex items-center space-x-1">
            <span className="text-blue-300">↘</span>
            <span>{t('minTemp')}: {currentWeather.minTemp}°</span>
          </span>
        </div>
        
        <div className={`mt-4 ${theme.secondaryTextColor}`}>
          {t('feelsLike')}: {currentWeather.feelsLike}°
        </div>
      </div>

      {/* 天气详情网格 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* 湿度 */}
        <div 
          className={`p-4 rounded-2xl ${theme.blur} transition-all duration-300 hover:scale-105`}
          style={{ 
            background: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.3)',
            border: `1px solid ${theme.borderColor}`
          }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white text-sm">💧</span>
            </div>
            <span className={`text-sm ${theme.secondaryTextColor}`}>{t('humidity')}</span>
          </div>
          <div className={`text-2xl font-semibold ${theme.textColor}`}>
            {currentWeather.humidity}%
          </div>
        </div>

        {/* 风速 */}
        <div 
          className={`p-4 rounded-2xl ${theme.blur} transition-all duration-300 hover:scale-105`}
          style={{ 
            background: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.3)',
            border: `1px solid ${theme.borderColor}`
          }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
              <span className="text-white text-sm">💨</span>
            </div>
            <span className={`text-sm ${theme.secondaryTextColor}`}>{t('windSpeed')}</span>
          </div>
          <div className={`text-2xl font-semibold ${theme.textColor}`}>
            {currentWeather.windSpeed} km/h
          </div>
        </div>

        {/* 能见度 */}
        <div 
          className={`p-4 rounded-2xl ${theme.blur} transition-all duration-300 hover:scale-105`}
          style={{ 
            background: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.3)',
            border: `1px solid ${theme.borderColor}`
          }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
              <span className="text-white text-sm">👁</span>
            </div>
            <span className={`text-sm ${theme.secondaryTextColor}`}>{t('visibility')}</span>
          </div>
          <div className={`text-2xl font-semibold ${theme.textColor}`}>
            {currentWeather.visibility} km
          </div>
        </div>

        {/* 气压 */}
        <div 
          className={`p-4 rounded-2xl ${theme.blur} transition-all duration-300 hover:scale-105`}
          style={{ 
            background: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.3)',
            border: `1px solid ${theme.borderColor}`
          }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm">🌡</span>
            </div>
            <span className={`text-sm ${theme.secondaryTextColor}`}>{t('pressure')}</span>
          </div>
          <div className={`text-2xl font-semibold ${theme.textColor}`}>
            {currentWeather.pressure} hPa
          </div>
        </div>
      </div>

      {/* 空气质量和紫外线指数 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* 空气质量 */}
        <div 
          className={`p-4 rounded-2xl ${theme.blur} transition-all duration-300 hover:scale-105`}
          style={{ 
            background: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.3)',
            border: `1px solid ${theme.borderColor}`
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${theme.secondaryTextColor}`}>{t('airQuality')}</span>
            <span className={`text-lg font-semibold ${theme.textColor}`}>
              {currentWeather.airQuality.level}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${getAQIColor(currentWeather.airQuality.aqi)} transition-all duration-1000`}
              style={{ width: `${Math.min(currentWeather.airQuality.aqi / 3, 100)}%` }}
            ></div>
          </div>
          <div className={`text-xs ${theme.secondaryTextColor}`}>
            AQI: {currentWeather.airQuality.aqi}
          </div>
        </div>

        {/* 紫外线指数 */}
        <div 
          className={`p-4 rounded-2xl ${theme.blur} transition-all duration-300 hover:scale-105`}
          style={{ 
            background: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.3)',
            border: `1px solid ${theme.borderColor}`
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${theme.secondaryTextColor}`}>{t('uvIndex')}</span>
            <span className={`text-lg font-semibold ${theme.textColor}`}>
              {currentWeather.uvIndex}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${getUVColor(currentWeather.uvIndex)} transition-all duration-1000`}
              style={{ width: `${Math.min(currentWeather.uvIndex * 10, 100)}%` }}
            ></div>
          </div>
          <div className={`text-xs ${theme.secondaryTextColor}`}>
            ☀️ {currentWeather.uvIndex <= 2 ? t('good') : currentWeather.uvIndex <= 5 ? t('moderate') : t('unhealthy')}
          </div>
        </div>
      </div>

      {/* 更新时间 */}
      <div className={`text-center text-sm ${theme.secondaryTextColor}`}>
        {t('updateTime')}: {currentWeather.updateTime}
      </div>
    </div>
  );
};

export default CurrentWeatherCard;

