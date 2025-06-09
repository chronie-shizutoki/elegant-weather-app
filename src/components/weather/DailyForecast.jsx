import { useState } from 'react';
import { useWeather, WeatherIcons } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';
import { ChevronDown, ChevronUp, Droplets, Wind } from 'lucide-react';

export default function DailyForecast() {
  const { dailyForecast, isLoading } = useWeather();
  const { getCardStyle, getTextColor } = useTheme();
  const { t } = useLang();
  const [expandedDay, setExpandedDay] = useState(null);

  // 切换展开状态
  const toggleExpanded = (index) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  // 获取空气质量颜色
  const getAQIColor = (level) => {
    switch (level) {
      case '优': return 'text-green-500';
      case '良': return 'text-yellow-500';
      case '轻度污染': return 'text-orange-500';
      case '中度污染': return 'text-red-500';
      case '重度污染': return 'text-purple-500';
      case '严重污染': return 'text-red-700';
      default: return 'text-gray-500';
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <div 
        className="p-4"
        style={getCardStyle(0.8)}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: getTextColor() }}>
          {t('forecast.daily')}
        </h3>
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white bg-opacity-10 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="h-6 bg-gray-300 rounded w-12"></div>
                <div className="h-8 bg-gray-300 rounded w-8"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-300 rounded w-8"></div>
                <div className="h-4 bg-gray-300 rounded w-8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 无数据状态
  if (!dailyForecast || dailyForecast.length === 0) {
    return (
      <div 
        className="p-4 text-center"
        style={getCardStyle(0.8)}
      >
        <h3 className="text-lg font-semibold mb-2" style={{ color: getTextColor() }}>
          {t('forecast.daily')}
        </h3>
        <p style={{ color: getTextColor('secondary') }}>
          {t('no_data')}
        </p>
      </div>
    );
  }

  return (
    <div 
      className="p-4"
      style={getCardStyle(0.8)}
    >
      {/* 标题 */}
      <h3 className="text-lg font-semibold mb-4" style={{ color: getTextColor() }}>
        {t('forecast.14_days')}
      </h3>

      {/* 每日预报列表 */}
      <div className="space-y-2">
        {dailyForecast.map((day, index) => (
          <div
            key={index}
            className="rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 overflow-hidden"
          >
            {/* 主要信息 */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleExpanded(index)}
            >
              {/* 左侧：日期和天气 */}
              <div className="flex items-center space-x-4 flex-1">
                {/* 日期 */}
                <div className="w-16 text-center">
                  <div 
                    className={`text-sm ${index === 0 ? 'font-semibold' : ''}`}
                    style={{ color: index === 0 ? getTextColor() : getTextColor('secondary') }}
                  >
                    {day.weekday}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: getTextColor('muted') }}
                  >
                    {day.date.split('/').slice(1).join('/')}
                  </div>
                </div>

                {/* 白天天气图标 */}
                <div className="flex items-center space-x-2">
                  <span className="text-2xl animate-pulse">
                    {WeatherIcons[day.dayWeatherType]}
                  </span>
                  <span className="text-xs" style={{ color: getTextColor('muted') }}>
                    {t(`weather.${day.dayWeatherType}`)}
                  </span>
                </div>

                {/* 降水概率 */}
                {day.precipitation > 0 && (
                  <div className="flex items-center">
                    <Droplets size={14} className="text-blue-400 mr-1" />
                    <span className="text-xs text-blue-400">
                      {day.precipitation}%
                    </span>
                  </div>
                )}
              </div>

              {/* 中间：温度趋势 */}
              <div className="flex-1 mx-4">
                <div className="relative h-8 flex items-center">
                  {/* 温度条 */}
                  <div className="w-full h-2 bg-gray-300 bg-opacity-30 rounded-full relative overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-red-400 rounded-full transition-all duration-500"
                      style={{ 
                        width: '100%',
                        background: `linear-gradient(to right, 
                          hsl(${240 - (day.minTemp + 20) * 2}, 70%, 60%) 0%, 
                          hsl(${240 - (day.maxTemp + 20) * 2}, 70%, 60%) 100%)`
                      }}
                    ></div>
                  </div>
                  
                  {/* 温度标签 */}
                  <div className="absolute left-0 -top-6 text-xs" style={{ color: getTextColor('secondary') }}>
                    {day.minTemp}°
                  </div>
                  <div className="absolute right-0 -top-6 text-xs" style={{ color: getTextColor() }}>
                    {day.maxTemp}°
                  </div>
                </div>
              </div>

              {/* 右侧：夜间天气和展开按钮 */}
              <div className="flex items-center space-x-3">
                {/* 夜间天气图标 */}
                <span className="text-lg opacity-70">
                  {WeatherIcons[day.nightWeatherType]}
                </span>

                {/* 空气质量 */}
                <span className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-20 ${getAQIColor(day.airQuality)}`}>
                  {day.airQuality}
                </span>

                {/* 展开按钮 */}
                <div className="p-1">
                  {expandedDay === index ? (
                    <ChevronUp size={16} style={{ color: getTextColor('secondary') }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: getTextColor('secondary') }} />
                  )}
                </div>
              </div>
            </div>

            {/* 展开的详细信息 */}
            {expandedDay === index && (
              <div className="px-4 pb-4 border-t border-white border-opacity-20 animate-fadeIn">
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {/* 白天详情 */}
                  <div className="p-3 rounded-lg bg-white bg-opacity-10">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">{WeatherIcons[day.dayWeatherType]}</span>
                      <span className="text-sm font-semibold" style={{ color: getTextColor() }}>
                        白天
                      </span>
                    </div>
                    <div className="space-y-1 text-xs" style={{ color: getTextColor('secondary') }}>
                      <div>{t(`weather.${day.dayWeatherType}`)}</div>
                      <div>最高温度: {day.maxTemp}°</div>
                      <div className="flex items-center">
                        <Droplets size={12} className="mr-1 text-blue-400" />
                        降水: {day.precipitation}%
                      </div>
                    </div>
                  </div>

                  {/* 夜间详情 */}
                  <div className="p-3 rounded-lg bg-white bg-opacity-10">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">{WeatherIcons[day.nightWeatherType]}</span>
                      <span className="text-sm font-semibold" style={{ color: getTextColor() }}>
                        夜间
                      </span>
                    </div>
                    <div className="space-y-1 text-xs" style={{ color: getTextColor('secondary') }}>
                      <div>{t(`weather.${day.nightWeatherType}`)}</div>
                      <div>最低温度: {day.minTemp}°</div>
                      <div className="flex items-center">
                        <Wind size={12} className="mr-1 text-gray-400" />
                        风力: {day.windSpeed}级
                      </div>
                    </div>
                  </div>
                </div>

                {/* 额外信息 */}
                <div className="mt-3 p-3 rounded-lg bg-white bg-opacity-5">
                  <div className="grid grid-cols-3 gap-4 text-xs" style={{ color: getTextColor('muted') }}>
                    <div>
                      <span className="block">空气质量</span>
                      <span className={getAQIColor(day.airQuality)}>{day.airQuality}</span>
                    </div>
                    <div>
                      <span className="block">风力等级</span>
                      <span>{day.windSpeed}级</span>
                    </div>
                    <div>
                      <span className="block">降水概率</span>
                      <span className="text-blue-400">{day.precipitation}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 查看更多按钮 */}
      <div className="mt-4 text-center">
        <button
          className="px-6 py-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
          style={{ color: getTextColor() }}
        >
          {t('forecast.14_days')}
        </button>
      </div>
    </div>
  );
}

