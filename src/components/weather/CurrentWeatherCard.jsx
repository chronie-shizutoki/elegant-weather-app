import { useEffect, useState } from 'react';
import { useWeather, WeatherIcons } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';
import { 
  MapPin, 
  RefreshCw, 
  Thermometer, 
  Droplets, 
  Wind,
  Eye,
  Gauge,
  Sun,
  AlertTriangle
} from 'lucide-react';

export default function CurrentWeatherCard() {
  const { currentWeather, isLoading, error, refreshWeatherData, selectedCity } = useWeather();
  const { getCardStyle, getTextColor, timeOfDay } = useTheme();
  const { t } = useLang();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 刷新数据
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshWeatherData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // 获取空气质量颜色
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-500';
    if (aqi <= 100) return 'text-yellow-500';
    if (aqi <= 150) return 'text-orange-500';
    if (aqi <= 200) return 'text-red-500';
    if (aqi <= 300) return 'text-purple-500';
    return 'text-red-700';
  };

  // 获取紫外线等级颜色
  const getUVColor = (uvIndex) => {
    if (uvIndex <= 2) return 'text-green-500';
    if (uvIndex <= 5) return 'text-yellow-500';
    if (uvIndex <= 7) return 'text-orange-500';
    if (uvIndex <= 10) return 'text-red-500';
    return 'text-purple-500';
  };

  // 加载状态
  if (isLoading) {
    return (
      <div 
        className="p-6 animate-pulse"
        style={getCardStyle(0.9)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-300 rounded w-32"></div>
          <div className="h-6 bg-gray-300 rounded w-6"></div>
        </div>
        <div className="text-center mb-6">
          <div className="h-20 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div 
        className="p-6 text-center"
        style={getCardStyle(0.9)}
      >
        <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: getTextColor() }}>
          {t('error')}
        </h3>
        <p className="mb-4" style={{ color: getTextColor('secondary') }}>
          {error}
        </p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  // 无数据状态
  if (!currentWeather) {
    return (
      <div 
        className="p-6 text-center"
        style={getCardStyle(0.9)}
      >
        <p style={{ color: getTextColor('secondary') }}>
          {t('no_data')}
        </p>
      </div>
    );
  }

  return (
    <div 
      className="p-6 transform hover:scale-105 transition-all duration-300"
      style={getCardStyle(0.9)}
    >
      {/* 头部 - 位置和刷新按钮 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MapPin className="mr-2" size={20} style={{ color: getTextColor('secondary') }} />
          <div>
            <h2 className="text-lg font-semibold" style={{ color: getTextColor() }}>
              {currentWeather.location.name}
            </h2>
            <p className="text-sm" style={{ color: getTextColor('secondary') }}>
              {currentWeather.location.region}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
          style={{ color: getTextColor('secondary') }}
        >
          <RefreshCw 
            size={20} 
            className={isRefreshing ? 'animate-spin' : ''} 
          />
        </button>
      </div>

      {/* 主要天气信息 */}
      <div className="text-center mb-8">
        {/* 天气图标和温度 */}
        <div className="flex items-center justify-center mb-4">
          <span className="text-6xl mr-4 animate-bounce">
            {WeatherIcons[currentWeather.weatherType]}
          </span>
          <div className="text-right">
            <div className="text-6xl font-light" style={{ color: getTextColor() }}>
              {currentWeather.temperature}°
            </div>
            <div className="text-lg" style={{ color: getTextColor('secondary') }}>
              {t(`weather.${currentWeather.weatherType}`)}
            </div>
          </div>
        </div>

        {/* 最高最低温度 */}
        <div className="flex items-center justify-center space-x-4">
          <span style={{ color: getTextColor('secondary') }}>
            {t('weather.max_temp')}: {currentWeather.maxTemp}°
          </span>
          <span style={{ color: getTextColor('muted') }}>|</span>
          <span style={{ color: getTextColor('secondary') }}>
            {t('weather.min_temp')}: {currentWeather.minTemp}°
          </span>
        </div>

        {/* 体感温度 */}
        <div className="mt-2">
          <span style={{ color: getTextColor('secondary') }}>
            {t('weather.feels_like')}: {currentWeather.feelsLike}°
          </span>
        </div>
      </div>

      {/* 详细信息网格 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* 湿度 */}
        <div className="flex items-center p-3 rounded-lg bg-white bg-opacity-10">
          <Droplets className="mr-3 text-blue-400" size={20} />
          <div>
            <div className="text-sm" style={{ color: getTextColor('secondary') }}>
              {t('weather.humidity')}
            </div>
            <div className="font-semibold" style={{ color: getTextColor() }}>
              {currentWeather.humidity}%
            </div>
          </div>
        </div>

        {/* 风速 */}
        <div className="flex items-center p-3 rounded-lg bg-white bg-opacity-10">
          <Wind className="mr-3 text-gray-400" size={20} />
          <div>
            <div className="text-sm" style={{ color: getTextColor('secondary') }}>
              {t('weather.wind_speed')}
            </div>
            <div className="font-semibold" style={{ color: getTextColor() }}>
              {currentWeather.windSpeed}级
            </div>
          </div>
        </div>

        {/* 能见度 */}
        <div className="flex items-center p-3 rounded-lg bg-white bg-opacity-10">
          <Eye className="mr-3 text-green-400" size={20} />
          <div>
            <div className="text-sm" style={{ color: getTextColor('secondary') }}>
              {t('weather.visibility')}
            </div>
            <div className="font-semibold" style={{ color: getTextColor() }}>
              {currentWeather.visibility}km
            </div>
          </div>
        </div>

        {/* 气压 */}
        <div className="flex items-center p-3 rounded-lg bg-white bg-opacity-10">
          <Gauge className="mr-3 text-purple-400" size={20} />
          <div>
            <div className="text-sm" style={{ color: getTextColor('secondary') }}>
              {t('weather.pressure')}
            </div>
            <div className="font-semibold" style={{ color: getTextColor() }}>
              {currentWeather.pressure}hPa
            </div>
          </div>
        </div>
      </div>

      {/* 空气质量和紫外线 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* 空气质量 */}
        <div className="p-3 rounded-lg bg-white bg-opacity-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: getTextColor('secondary') }}>
              {t('weather.air_quality')}
            </span>
            <span className={`font-semibold ${getAQIColor(currentWeather.airQuality.aqi)}`}>
              {currentWeather.airQuality.level}
            </span>
          </div>
          <div className="text-xs" style={{ color: getTextColor('muted') }}>
            AQI: {currentWeather.airQuality.aqi}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (currentWeather.airQuality.aqi / 300) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* 紫外线指数 */}
        <div className="p-3 rounded-lg bg-white bg-opacity-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: getTextColor('secondary') }}>
              {t('weather.uv_index')}
            </span>
            <span className={`font-semibold ${getUVColor(currentWeather.uvIndex)}`}>
              {currentWeather.uvIndex}
            </span>
          </div>
          <div className="flex items-center">
            <Sun className="mr-2 text-yellow-400" size={16} />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentWeather.uvIndex / 11) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 更新时间 */}
      <div className="text-center">
        <p className="text-xs" style={{ color: getTextColor('muted') }}>
          {t('last_update', { time: currentWeather.updateTime })}
        </p>
      </div>
    </div>
  );
}

