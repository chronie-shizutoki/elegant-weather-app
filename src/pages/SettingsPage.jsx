import React, { useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// 导入语言资源
const resources = {
  'zh-CN': {
    translation: {
      appName: '优雅天气',
      currentWeather: '当前天气',
      hourlyForecast: '小时预报',
      dailyForecast: '每日预报',
      weatherDetails: '天气详情',
      highTemp: '最高',
      lowTemp: '最低',
      feelsLike: '体感温度',
      updated: '更新于',
      humidity: '湿度',
      windSpeed: '风速',
      visibility: '能见度',
      pressure: '气压',
      airQuality: '空气质量',
      uvIndex: '紫外线指数',
      sunrise: '日出',
      sunset: '日落',
      selectLanguage: '选择语言',
      switchTheme: '切换主题',
      scrollLeft: '向左滚动',
      scrollRight: '向右滚动',
      nav: {
        home: '天气',
        forecast: '预报',
        cities: '城市',
        settings: '设置'
      },
      weather: {
        sunny: '晴朗',
        clear: '晴朗',
        'partly-cloudy': '多云',
        cloudy: '阴天',
        rainy: '雨',
        drizzle: '小雨',
        thunderstorm: '雷雨',
        snow: '雪',
        fog: '雾'
      },
      aqi: {
        good: '优',
        moderate: '良',
        unhealthySensitive: '对敏感人群不健康',
        unhealthy: '不健康',
        veryUnhealthy: '非常不健康',
        hazardous: '危险'
      },
      uv: {
        low: '低',
        moderate: '中等',
        high: '高',
        veryHigh: '很高',
        extreme: '极高'
      },
      pressureInfo: {
        high: '高压',
        low: '低压'
      }
    }
  },
  'zh-TW': {
    translation: {
      appName: '優雅天氣',
      currentWeather: '當前天氣',
      hourlyForecast: '小時預報',
      dailyForecast: '每日預報',
      weatherDetails: '天氣詳情',
      highTemp: '最高',
      lowTemp: '最低',
      feelsLike: '體感溫度',
      updated: '更新於',
      humidity: '濕度',
      windSpeed: '風速',
      visibility: '能見度',
      pressure: '氣壓',
      airQuality: '空氣質量',
      uvIndex: '紫外線指數',
      sunrise: '日出',
      sunset: '日落',
      selectLanguage: '選擇語言',
      switchTheme: '切換主題',
      scrollLeft: '向左滾動',
      scrollRight: '向右滾動',
      nav: {
        home: '天氣',
        forecast: '預報',
        cities: '城市',
        settings: '設置'
      },
      weather: {
        sunny: '晴朗',
        clear: '晴朗',
        'partly-cloudy': '多雲',
        cloudy: '陰天',
        rainy: '雨',
        drizzle: '小雨',
        thunderstorm: '雷雨',
        snow: '雪',
        fog: '霧'
      },
      aqi: {
        good: '優',
        moderate: '良',
        unhealthySensitive: '對敏感人群不健康',
        unhealthy: '不健康',
        veryUnhealthy: '非常不健康',
        hazardous: '危險'
      },
      uv: {
        low: '低',
        moderate: '中等',
        high: '高',
        veryHigh: '很高',
        extreme: '極高'
      },
      pressureInfo: {
        high: '高壓',
        low: '低壓'
      }
    }
  },
  'en': {
    translation: {
      appName: 'Elegant Weather',
      currentWeather: 'Current Weather',
      hourlyForecast: 'Hourly Forecast',
      dailyForecast: 'Daily Forecast',
      weatherDetails: 'Weather Details',
      highTemp: 'High',
      lowTemp: 'Low',
      feelsLike: 'Feels Like',
      updated: 'Updated',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      visibility: 'Visibility',
      pressure: 'Pressure',
      airQuality: 'Air Quality',
      uvIndex: 'UV Index',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      selectLanguage: 'Select Language',
      switchTheme: 'Switch Theme',
      scrollLeft: 'Scroll Left',
      scrollRight: 'Scroll Right',
      nav: {
        home: 'Weather',
        forecast: 'Forecast',
        cities: 'Cities',
        settings: 'Settings'
      },
      weather: {
        sunny: 'Sunny',
        clear: 'Clear',
        'partly-cloudy': 'Partly Cloudy',
        cloudy: 'Cloudy',
        rainy: 'Rainy',
        drizzle: 'Drizzle',
        thunderstorm: 'Thunderstorm',
        snow: 'Snow',
        fog: 'Fog'
      },
      aqi: {
        good: 'Good',
        moderate: 'Moderate',
        unhealthySensitive: 'Unhealthy for Sensitive Groups',
        unhealthy: 'Unhealthy',
        veryUnhealthy: 'Very Unhealthy',
        hazardous: 'Hazardous'
      },
      uv: {
        low: 'Low',
        moderate: 'Moderate',
        high: 'High',
        veryHigh: 'Very High',
        extreme: 'Extreme'
      },
      pressureInfo: {
        high: 'High',
        low: 'Low'
      }
    }
  },
  'ja': {
    translation: {
      appName: 'エレガント天気',
      currentWeather: '現在の天気',
      hourlyForecast: '時間予報',
      dailyForecast: '日間予報',
      weatherDetails: '天気詳細',
      highTemp: '最高',
      lowTemp: '最低',
      feelsLike: '体感温度',
      updated: '更新',
      humidity: '湿度',
      windSpeed: '風速',
      visibility: '視界',
      pressure: '気圧',
      airQuality: '大気質',
      uvIndex: '紫外線指数',
      sunrise: '日の出',
      sunset: '日の入り',
      selectLanguage: '言語選択',
      switchTheme: 'テーマ切替',
      scrollLeft: '左にスクロール',
      scrollRight: '右にスクロール',
      nav: {
        home: '天気',
        forecast: '予報',
        cities: '都市',
        settings: '設定'
      },
      weather: {
        sunny: '晴れ',
        clear: '快晴',
        'partly-cloudy': '晴れ時々曇り',
        cloudy: '曇り',
        rainy: '雨',
        drizzle: '小雨',
        thunderstorm: '雷雨',
        snow: '雪',
        fog: '霧'
      },
      aqi: {
        good: '良好',
        moderate: '普通',
        unhealthySensitive: '敏感な人に不健康',
        unhealthy: '不健康',
        veryUnhealthy: '非常に不健康',
        hazardous: '危険'
      },
      uv: {
        low: '低い',
        moderate: '中程度',
        high: '高い',
        veryHigh: '非常に高い',
        extreme: '極めて高い'
      },
      pressureInfo: {
        high: '高気圧',
        low: '低気圧'
      }
    }
  },
  'ko': {
    translation: {
      appName: '우아한 날씨',
      currentWeather: '현재 날씨',
      hourlyForecast: '시간별 예보',
      dailyForecast: '일일 예보',
      weatherDetails: '날씨 상세',
      highTemp: '최고',
      lowTemp: '최저',
      feelsLike: '체감 온도',
      updated: '업데이트',
      humidity: '습도',
      windSpeed: '풍속',
      visibility: '가시성',
      pressure: '기압',
      airQuality: '대기 질',
      uvIndex: '자외선 지수',
      sunrise: '일출',
      sunset: '일몰',
      selectLanguage: '언어 선택',
      switchTheme: '테마 전환',
      scrollLeft: '왼쪽으로 스크롤',
      scrollRight: '오른쪽으로 스크롤',
      nav: {
        home: '날씨',
        forecast: '예보',
        cities: '도시',
        settings: '설정'
      },
      weather: {
        sunny: '맑음',
        clear: '맑음',
        'partly-cloudy': '구름 조금',
        cloudy: '흐림',
        rainy: '비',
        drizzle: '이슬비',
        thunderstorm: '뇌우',
        snow: '눈',
        fog: '안개'
      },
      aqi: {
        good: '좋음',
        moderate: '보통',
        unhealthySensitive: '민감한 그룹에게 해로움',
        unhealthy: '해로움',
        veryUnhealthy: '매우 해로움',
        hazardous: '위험'
      },
      uv: {
        low: '낮음',
        moderate: '보통',
        high: '높음',
        veryHigh: '매우 높음',
        extreme: '극도로 높음'
      },
      pressureInfo: {
        high: '고기압',
        low: '저기압'
      }
    }
  },
  'fr': {
    translation: {
      appName: 'Météo Élégante',
      currentWeather: 'Météo Actuelle',
      hourlyForecast: 'Prévisions Horaires',
      dailyForecast: 'Prévisions Quotidiennes',
      weatherDetails: 'Détails Météo',
      highTemp: 'Max',
      lowTemp: 'Min',
      feelsLike: 'Ressenti',
      updated: 'Mis à jour',
      humidity: 'Humidité',
      windSpeed: 'Vitesse du Vent',
      visibility: 'Visibilité',
      pressure: 'Pression',
      airQuality: 'Qualité de l\'Air',
      uvIndex: 'Indice UV',
      sunrise: 'Lever du Soleil',
      sunset: 'Coucher du Soleil',
      selectLanguage: 'Sélectionner la Langue',
      switchTheme: 'Changer de Thème',
      scrollLeft: 'Défiler à Gauche',
      scrollRight: 'Défiler à Droite',
      nav: {
        home: 'Météo',
        forecast: 'Prévisions',
        cities: 'Villes',
        settings: 'Paramètres'
      },
      weather: {
        sunny: 'Ensoleillé',
        clear: 'Dégagé',
        'partly-cloudy': 'Partiellement Nuageux',
        cloudy: 'Nuageux',
        rainy: 'Pluvieux',
        drizzle: 'Bruine',
        thunderstorm: 'Orage',
        snow: 'Neige',
        fog: 'Brouillard'
      },
      aqi: {
        good: 'Bon',
        moderate: 'Modéré',
        unhealthySensitive: 'Mauvais pour les Groupes Sensibles',
        unhealthy: 'Mauvais',
        veryUnhealthy: 'Très Mauvais',
        hazardous: 'Dangereux'
      },
      uv: {
        low: 'Faible',
        moderate: 'Modéré',
        high: 'Élevé',
        veryHigh: 'Très Élevé',
        extreme: 'Extrême'
      },
      pressureInfo: {
        high: 'Haute Pression',
        low: 'Basse Pression'
      }
    }
  }
};

// 初始化i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh-CN',
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false
    }
  });

/**
 * 多语言切换页面 - 使用液体玻璃效果和3D动画展示语言选项
 */
const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [theme, setTheme] = useState('light');
  
  // 支持的语言列表
  const languages = [
    { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
    { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];
  
  // 切换语言
  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setSelectedLang(langCode);
    localStorage.setItem('weatherAppLang', langCode);
  };
  
  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('weatherAppTheme', newTheme);
  };
  
  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('weatherAppTheme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    }
    
    const savedLang = localStorage.getItem('weatherAppLang');
    if (savedLang) {
      i18n.changeLanguage(savedLang);
      setSelectedLang(savedLang);
    }
  }, [i18n]);
  
  return (
    <div className="settings-page">
      <motion.div 
        className="liquid-glass liquid-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="liquid-card-header">
          <h2 className="text-2xl font-bold text-white/90">{t('selectLanguage')}</h2>
        </div>
        
        <div className="language-grid grid grid-cols-2 gap-4 md:grid-cols-3">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              className={`language-item liquid-glass p-4 rounded-xl flex items-center ${
                selectedLang === lang.code ? 'active' : ''
              }`}
              onClick={() => changeLanguage(lang.code)}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.15)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flag text-2xl mr-3">{lang.flag}</span>
              <span className="name text-white">{lang.name}</span>
              {selectedLang === lang.code && (
                <motion.span 
                  className="check ml-auto text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  ✓
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
      
      <motion.div 
        className="liquid-glass liquid-card mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="liquid-card-header">
          <h2 className="text-2xl font-bold text-white/90">{t('switchTheme')}</h2>
        </div>
        
        <div className="theme-selector p-4">
          <motion.button
            className="theme-toggle liquid-glass p-6 rounded-xl flex items-center justify-between w-full"
            onClick={toggleTheme}
            whileHover={{ 
              backgroundColor: "rgba(255, 255, 255, 0.15)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <span className="icon text-2xl mr-3">
                {theme === 'light' ? '☀️' : '🌙'}
              </span>
              <span className="text-white text-lg">
                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>
            
            <div className="toggle-switch">
              <div className={`toggle-track ${theme === 'dark' ? 'active' : ''}`}>
                <motion.div 
                  className="toggle-thumb"
                  animate={{ 
                    x: theme === 'dark' ? 20 : 0 
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>
      
      <style jsx>{`
        .settings-page {
          padding: 20px 0;
        }
        
        .language-item {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .language-item.active {
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        
        .toggle-track {
          width: 50px;
          height: 30px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          padding: 5px;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .toggle-track.active {
          background: rgba(255, 255, 255, 0.4);
        }
        
        .toggle-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
