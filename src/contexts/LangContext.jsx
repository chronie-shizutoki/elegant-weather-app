import { createContext, useContext, useState, useEffect } from 'react';

const LangContext = createContext();

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
};

// 支持的语言列表（删除了德语、西班牙语、俄语、阿拉伯语）
const SUPPORTED_LANGUAGES = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en': 'English',
  'ja': '日本語',
  'ko': '한국어',
  'fr': 'Français'
};

// 翻译资源
const translations = {
  'zh-CN': {
    appTitle: '美观的天气预报应用',
    currentWeather: '当前天气',
    hourlyForecast: '小时预报',
    dailyForecast: '每日预报',
    weatherDetails: '天气详情',
    settings: '设置',
    cities: '城市',
    forecast: '预报',
    more: '更多',
    temperature: '温度',
    maxTemp: '最高温度',
    minTemp: '最低温度',
    feelsLike: '体感温度',
    humidity: '湿度',
    windSpeed: '风速',
    visibility: '能见度',
    pressure: '气压',
    airQuality: '空气质量',
    uvIndex: '紫外线指数',
    sunrise: '日出',
    sunset: '日落',
    precipitationChance: '降水概率',
    noRainNext2Hours: '未来2小时内无降雨',
    updateTime: '最后更新',
    // 天气状况
    sunny: '晴天',
    cloudy: '多云',
    overcast: '阴天',
    lightRain: '小雨',
    moderateRain: '中雨',
    heavyRain: '大雨',
    thunderstorm: '雷雨',
    snow: '雪',
    fog: '雾',
    // 空气质量
    good: '优',
    moderate: '良',
    unhealthyForSensitive: '轻度污染',
    unhealthy: '中度污染',
    veryUnhealthy: '重度污染',
    hazardous: '严重污染',
    // 风力等级
    calm: '无风',
    lightAir: '软风',
    lightBreeze: '轻风',
    gentleBreeze: '微风',
    moderateBreeze: '和风',
    freshBreeze: '清风',
    strongBreeze: '强风',
    nearGale: '疾风',
    gale: '大风',
    strongGale: '烈风',
    storm: '狂风',
    violentStorm: '暴风',
    hurricane: '飓风'
  },
  'zh-TW': {
    appTitle: '美觀的天氣預報應用',
    currentWeather: '當前天氣',
    hourlyForecast: '小時預報',
    dailyForecast: '每日預報',
    weatherDetails: '天氣詳情',
    settings: '設置',
    cities: '城市',
    forecast: '預報',
    more: '更多',
    temperature: '溫度',
    maxTemp: '最高溫度',
    minTemp: '最低溫度',
    feelsLike: '體感溫度',
    humidity: '濕度',
    windSpeed: '風速',
    visibility: '能見度',
    pressure: '氣壓',
    airQuality: '空氣質量',
    uvIndex: '紫外線指數',
    sunrise: '日出',
    sunset: '日落',
    precipitationChance: '降水概率',
    noRainNext2Hours: '未來2小時內無降雨',
    updateTime: '最後更新',
    // 天气状况
    sunny: '晴天',
    cloudy: '多雲',
    overcast: '陰天',
    lightRain: '小雨',
    moderateRain: '中雨',
    heavyRain: '大雨',
    thunderstorm: '雷雨',
    snow: '雪',
    fog: '霧',
    // 空气质量
    good: '優',
    moderate: '良',
    unhealthyForSensitive: '輕度污染',
    unhealthy: '中度污染',
    veryUnhealthy: '重度污染',
    hazardous: '嚴重污染'
  },
  'en': {
    appTitle: 'Beautiful Weather App',
    currentWeather: 'Current Weather',
    hourlyForecast: 'Hourly Forecast',
    dailyForecast: 'Daily Forecast',
    weatherDetails: 'Weather Details',
    settings: 'Settings',
    cities: 'Cities',
    forecast: 'Forecast',
    more: 'More',
    temperature: 'Temperature',
    maxTemp: 'Max Temp',
    minTemp: 'Min Temp',
    feelsLike: 'Feels Like',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    visibility: 'Visibility',
    pressure: 'Pressure',
    airQuality: 'Air Quality',
    uvIndex: 'UV Index',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    precipitationChance: 'Precipitation',
    noRainNext2Hours: 'No rain in next 2 hours',
    updateTime: 'Last Updated',
    // 天气状况
    sunny: 'Sunny',
    cloudy: 'Cloudy',
    overcast: 'Overcast',
    lightRain: 'Light Rain',
    moderateRain: 'Moderate Rain',
    heavyRain: 'Heavy Rain',
    thunderstorm: 'Thunderstorm',
    snow: 'Snow',
    fog: 'Fog',
    // 空气质量
    good: 'Good',
    moderate: 'Moderate',
    unhealthyForSensitive: 'Unhealthy for Sensitive',
    unhealthy: 'Unhealthy',
    veryUnhealthy: 'Very Unhealthy',
    hazardous: 'Hazardous'
  },
  'ja': {
    appTitle: '美しい天気アプリ',
    currentWeather: '現在の天気',
    hourlyForecast: '時間別予報',
    dailyForecast: '日別予報',
    weatherDetails: '天気詳細',
    settings: '設定',
    cities: '都市',
    forecast: '予報',
    more: 'その他',
    temperature: '気温',
    maxTemp: '最高気温',
    minTemp: '最低気温',
    feelsLike: '体感温度',
    humidity: '湿度',
    windSpeed: '風速',
    visibility: '視程',
    pressure: '気圧',
    airQuality: '空気質',
    uvIndex: 'UV指数',
    sunrise: '日の出',
    sunset: '日の入り',
    precipitationChance: '降水確率',
    noRainNext2Hours: '今後2時間は雨なし',
    updateTime: '最終更新',
    // 天气状况
    sunny: '晴れ',
    cloudy: '曇り',
    overcast: '曇天',
    lightRain: '小雨',
    moderateRain: '雨',
    heavyRain: '大雨',
    thunderstorm: '雷雨',
    snow: '雪',
    fog: '霧'
  },
  'ko': {
    appTitle: '아름다운 날씨 앱',
    currentWeather: '현재 날씨',
    hourlyForecast: '시간별 예보',
    dailyForecast: '일별 예보',
    weatherDetails: '날씨 상세',
    settings: '설정',
    cities: '도시',
    forecast: '예보',
    more: '더보기',
    temperature: '온도',
    maxTemp: '최고온도',
    minTemp: '최저온도',
    feelsLike: '체감온도',
    humidity: '습도',
    windSpeed: '풍속',
    visibility: '가시거리',
    pressure: '기압',
    airQuality: '공기질',
    uvIndex: '자외선지수',
    sunrise: '일출',
    sunset: '일몰',
    precipitationChance: '강수확률',
    noRainNext2Hours: '향후 2시간 비 없음',
    updateTime: '마지막 업데이트',
    // 天气状况
    sunny: '맑음',
    cloudy: '구름많음',
    overcast: '흐림',
    lightRain: '가벼운 비',
    moderateRain: '비',
    heavyRain: '폭우',
    thunderstorm: '뇌우',
    snow: '눈',
    fog: '안개'
  },
  'fr': {
    appTitle: 'Belle Application Météo',
    currentWeather: 'Météo Actuelle',
    hourlyForecast: 'Prévisions Horaires',
    dailyForecast: 'Prévisions Quotidiennes',
    weatherDetails: 'Détails Météo',
    settings: 'Paramètres',
    cities: 'Villes',
    forecast: 'Prévisions',
    more: 'Plus',
    temperature: 'Température',
    maxTemp: 'Temp. Max',
    minTemp: 'Temp. Min',
    feelsLike: 'Ressenti',
    humidity: 'Humidité',
    windSpeed: 'Vitesse du Vent',
    visibility: 'Visibilité',
    pressure: 'Pression',
    airQuality: 'Qualité de l\'Air',
    uvIndex: 'Indice UV',
    sunrise: 'Lever du Soleil',
    sunset: 'Coucher du Soleil',
    precipitationChance: 'Précipitations',
    noRainNext2Hours: 'Pas de pluie dans les 2h',
    updateTime: 'Dernière Mise à Jour',
    // 天气状况
    sunny: 'Ensoleillé',
    cloudy: 'Nuageux',
    overcast: 'Couvert',
    lightRain: 'Pluie Légère',
    moderateRain: 'Pluie Modérée',
    heavyRain: 'Forte Pluie',
    thunderstorm: 'Orage',
    snow: 'Neige',
    fog: 'Brouillard'
  }
};

export const LangProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('zh-CN');

  useEffect(() => {
    // 从本地存储获取语言设置
    const savedLang = localStorage.getItem('language');
    if (savedLang && SUPPORTED_LANGUAGES[savedLang]) {
      setCurrentLang(savedLang);
    } else {
      // 检测浏览器语言
      const browserLang = navigator.language || navigator.languages[0];
      const langCode = browserLang.split('-')[0];
      
      // 匹配支持的语言
      if (browserLang === 'zh-CN' || browserLang === 'zh-TW') {
        setCurrentLang(browserLang);
      } else if (SUPPORTED_LANGUAGES[langCode]) {
        setCurrentLang(langCode);
      } else {
        setCurrentLang('en'); // 默认英语
      }
    }
  }, []);

  const changeLang = (langCode) => {
    if (SUPPORTED_LANGUAGES[langCode]) {
      setCurrentLang(langCode);
      localStorage.setItem('language', langCode);
    }
  };

  const t = (key) => {
    return translations[currentLang]?.[key] || translations['en']?.[key] || key;
  };

  const value = {
    currentLang,
    changeLang,
    t,
    supportedLanguages: SUPPORTED_LANGUAGES,
    isRTL: false // 删除了阿拉伯语，所以不需要RTL支持
  };

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
};

