import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';

const WeatherDetails = () => {
  const { currentWeather, loading } = useWeather();
  const { theme, isDarkMode, timeOfDay } = useTheme();
  const { t } = useLang();

  if (loading) {
    return (
      <div 
        className={`rounded-3xl p-6 ${theme.blur} ${theme.shadow} animate-fadeIn`}
        style={{ 
          background: theme.cardBackground,
          border: `1px solid ${theme.borderColor}`
        }}
      >
        <div className="flex items-center justify-center h-32">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  const getDetailIcon = (type) => {
    const iconMap = {
      humidity: '💧',
      windSpeed: '💨',
      visibility: '👁',
      pressure: '🌡',
      airQuality: '🌬',
      uvIndex: '☀️',
      sunrise: '🌅',
      sunset: '🌇'
    };
    return iconMap[type] || '📊';
  };

  const getDetailColor = (type, value) => {
    switch (type) {
      case 'humidity':
        if (value < 30) return 'from-red-400 to-red-600';
        if (value < 60) return 'from-green-400 to-green-600';
        return 'from-blue-400 to-blue-600';
      case 'windSpeed':
        if (value < 10) return 'from-green-400 to-green-600';
        if (value < 25) return 'from-yellow-400 to-yellow-600';
        return 'from-red-400 to-red-600';
      case 'visibility':
        if (value > 10) return 'from-green-400 to-green-600';
        if (value > 5) return 'from-yellow-400 to-yellow-600';
        return 'from-red-400 to-red-600';
      case 'pressure':
        if (value > 1020) return 'from-blue-400 to-blue-600';
        if (value > 1000) return 'from-green-400 to-green-600';
        return 'from-orange-400 to-orange-600';
      case 'airQuality':
        if (value <= 50) return 'from-green-400 to-green-600';
        if (value <= 100) return 'from-yellow-400 to-yellow-600';
        if (value <= 150) return 'from-orange-400 to-orange-600';
        return 'from-red-400 to-red-600';
      case 'uvIndex':
        if (value <= 2) return 'from-green-400 to-green-600';
        if (value <= 5) return 'from-yellow-400 to-yellow-600';
        if (value <= 7) return 'from-orange-400 to-orange-600';
        return 'from-red-400 to-red-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const weatherDetails = [
    {
      key: 'humidity',
      label: t('humidity'),
      value: `${currentWeather.humidity}%`,
      progress: currentWeather.humidity,
      maxProgress: 100
    },
    {
      key: 'windSpeed',
      label: t('windSpeed'),
      value: `${currentWeather.windSpeed} km/h`,
      progress: Math.min(currentWeather.windSpeed, 50),
      maxProgress: 50
    },
    {
      key: 'visibility',
      label: t('visibility'),
      value: `${currentWeather.visibility} km`,
      progress: Math.min(currentWeather.visibility, 20),
      maxProgress: 20
    },
    {
      key: 'pressure',
      label: t('pressure'),
      value: `${currentWeather.pressure} hPa`,
      progress: Math.max(0, Math.min(currentWeather.pressure - 980, 60)),
      maxProgress: 60
    },
    {
      key: 'airQuality',
      label: t('airQuality'),
      value: currentWeather.airQuality.level,
      progress: Math.min(currentWeather.airQuality.aqi, 300),
      maxProgress: 300
    },
    {
      key: 'uvIndex',
      label: t('uvIndex'),
      value: currentWeather.uvIndex.toString(),
      progress: Math.min(currentWeather.uvIndex, 11),
      maxProgress: 11
    }
  ];

  return (
    <div 
      className={`rounded-3xl p-6 ${theme.blur} ${theme.shadow} animate-fadeIn transition-all duration-500 hover:scale-[1.02] card-hover`}
      style={{ 
        background: theme.cardBackground,
        border: `1px solid ${theme.borderColor}`
      }}
    >
      <h3 className={`text-xl font-semibold ${theme.textColor} mb-6 flex items-center space-x-3`}>
        <span className="text-2xl">📊</span>
        <span>{t('weatherDetails')}</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weatherDetails.map((detail, index) => (
          <div 
            key={detail.key}
            className={`p-4 rounded-2xl ${theme.blur} transition-all duration-300 hover:scale-105 animate-slideInUp`}
            style={{ 
              background: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.3)',
              border: `1px solid ${theme.borderColor}`,
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getDetailColor(detail.key, detail.progress)} flex items-center justify-center`}>
                  <span className="text-white text-lg">{getDetailIcon(detail.key)}</span>
                </div>
                <span className={`text-sm font-medium ${theme.secondaryTextColor}`}>
                  {detail.label}
                </span>
              </div>
              <span className={`text-lg font-bold ${theme.textColor}`}>
                {detail.value}
              </span>
            </div>

            {/* 进度条 */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getDetailColor(detail.key, detail.progress)} transition-all duration-1000 progress-bar`}
                style={{ 
                  width: `${(detail.progress / detail.maxProgress) * 100}%`,
                  animationDelay: `${index * 200 + 500}ms`
                }}
              ></div>
            </div>

            {/* 额外信息 */}
            {detail.key === 'airQuality' && (
              <div className={`mt-2 text-xs ${theme.secondaryTextColor}`}>
                AQI: {currentWeather.airQuality.aqi}
              </div>
            )}
          </div>
        ))}

        {/* 日出日落 */}
        <div 
          className={`p-4 rounded-2xl ${theme.blur} transition-all duration-300 hover:scale-105 animate-slideInUp md:col-span-2`}
          style={{ 
            background: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.3)',
            border: `1px solid ${theme.borderColor}`,
            animationDelay: '600ms'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-white text-lg">🌅</span>
                </div>
                <div>
                  <div className={`text-sm ${theme.secondaryTextColor}`}>{t('sunrise')}</div>
                  <div className={`text-lg font-bold ${theme.textColor}`}>
                    {currentWeather.sunrise}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg">🌇</span>
                </div>
                <div>
                  <div className={`text-sm ${theme.secondaryTextColor}`}>{t('sunset')}</div>
                  <div className={`text-lg font-bold ${theme.textColor}`}>
                    {currentWeather.sunset}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;

