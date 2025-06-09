import { createContext, useContext, useState, useEffect } from 'react';

// 支持的语言列表
export const SUPPORTED_LANGUAGES = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en': 'English',
  'ja': '日本語',
  'ko': '한국어',
  'fr': 'Français',
  'de': 'Deutsch',
  'es': 'Español',
  'ru': 'Русский',
  'ar': 'العربية'
};

// 翻译数据
const translations = {
  'zh-CN': {
    // 通用
    'loading': '加载中...',
    'error': '出错了',
    'retry': '重试',
    'refresh': '刷新',
    'settings': '设置',
    'back': '返回',
    'save': '保存',
    'cancel': '取消',
    'confirm': '确认',
    'delete': '删除',
    'add': '添加',
    'search': '搜索',
    
    // 导航
    'nav.weather': '天气',
    'nav.forecast': '预报',
    'nav.cities': '城市',
    'nav.more': '更多',
    
    // 天气相关
    'weather.current': '当前天气',
    'weather.feels_like': '体感温度',
    'weather.humidity': '湿度',
    'weather.wind_speed': '风速',
    'weather.wind_direction': '风向',
    'weather.pressure': '气压',
    'weather.visibility': '能见度',
    'weather.uv_index': '紫外线指数',
    'weather.air_quality': '空气质量',
    'weather.sunrise': '日出',
    'weather.sunset': '日落',
    'weather.max_temp': '最高温度',
    'weather.min_temp': '最低温度',
    'weather.precipitation': '降水概率',
    
    // 天气类型
    'weather.sunny': '晴朗',
    'weather.cloudy': '多云',
    'weather.overcast': '阴天',
    'weather.rain': '小雨',
    'weather.heavy_rain': '大雨',
    'weather.thunderstorm': '雷阵雨',
    'weather.snow': '雪',
    'weather.fog': '雾',
    'weather.haze': '霾',
    
    // 空气质量
    'aqi.excellent': '优',
    'aqi.good': '良',
    'aqi.light_pollution': '轻度污染',
    'aqi.moderate_pollution': '中度污染',
    'aqi.heavy_pollution': '重度污染',
    'aqi.severe_pollution': '严重污染',
    
    // 时间
    'time.now': '现在',
    'time.today': '今天',
    'time.tomorrow': '明天',
    'time.morning': '早晨',
    'time.noon': '中午',
    'time.afternoon': '下午',
    'time.evening': '傍晚',
    'time.night': '夜晚',
    
    // 星期
    'weekday.sunday': '周日',
    'weekday.monday': '周一',
    'weekday.tuesday': '周二',
    'weekday.wednesday': '周三',
    'weekday.thursday': '周四',
    'weekday.friday': '周五',
    'weekday.saturday': '周六',
    
    // 预报
    'forecast.hourly': '小时预报',
    'forecast.daily': '每日预报',
    'forecast.14_days': '14天预报',
    'forecast.no_rain': '未来2小时内无降雨',
    'forecast.rain_in': '预计{time}后降雨',
    
    // 城市管理
    'cities.title': '城市管理',
    'cities.current_location': '当前定位',
    'cities.search_placeholder': '搜索城市',
    'cities.search_history': '搜索历史',
    'cities.major_cities': '主要城市',
    'cities.add_city': '添加城市',
    'cities.remove_city': '删除城市',
    
    // 设置
    'settings.title': '设置',
    'settings.language': '语言',
    'settings.temperature_unit': '温度单位',
    'settings.wind_unit': '风速单位',
    'settings.notifications': '通知设置',
    'settings.morning_notification': '早晚天气提醒',
    'settings.weather_alert': '天气预警提醒',
    'settings.abnormal_weather': '异常天气提醒',
    'settings.night_mode': '夜间免打扰',
    'settings.auto_update': '夜间自动更新',
    'settings.about': '关于天气',
    
    // 单位
    'unit.celsius': '摄氏度°C',
    'unit.fahrenheit': '华氏度°F',
    'unit.kmh': '公里/小时',
    'unit.mph': '英里/小时',
    'unit.beaufort': '蒲福风力等级',
    'unit.hpa': 'hPa',
    'unit.km': '公里',
    'unit.percent': '%',
    
    // 生活指数
    'lifestyle.clothing': '穿衣指数',
    'lifestyle.uv_protection': '防晒指数',
    'lifestyle.outdoor_activity': '户外活动指数',
    'lifestyle.car_wash': '洗车指数',
    'lifestyle.travel': '旅游指数',
    
    // 错误信息
    'error.network': '网络连接失败',
    'error.location': '无法获取位置信息',
    'error.weather_data': '无法获取天气数据',
    'error.city_not_found': '未找到该城市',
    
    // 其他
    'app.title': '优雅天气',
    'app.subtitle': '美观的天气预报应用',
    'no_data': '暂无数据',
    'last_update': '最后更新：{time}',
    'pull_to_refresh': '下拉刷新'
  },
  
  'zh-TW': {
    // 通用
    'loading': '載入中...',
    'error': '出錯了',
    'retry': '重試',
    'refresh': '刷新',
    'settings': '設定',
    'back': '返回',
    'save': '儲存',
    'cancel': '取消',
    'confirm': '確認',
    'delete': '刪除',
    'add': '新增',
    'search': '搜尋',
    
    // 导航
    'nav.weather': '天氣',
    'nav.forecast': '預報',
    'nav.cities': '城市',
    'nav.more': '更多',
    
    // 天气相关
    'weather.current': '目前天氣',
    'weather.feels_like': '體感溫度',
    'weather.humidity': '濕度',
    'weather.wind_speed': '風速',
    'weather.wind_direction': '風向',
    'weather.pressure': '氣壓',
    'weather.visibility': '能見度',
    'weather.uv_index': '紫外線指數',
    'weather.air_quality': '空氣品質',
    'weather.sunrise': '日出',
    'weather.sunset': '日落',
    'weather.max_temp': '最高溫度',
    'weather.min_temp': '最低溫度',
    'weather.precipitation': '降水機率',
    
    // 天气类型
    'weather.sunny': '晴朗',
    'weather.cloudy': '多雲',
    'weather.overcast': '陰天',
    'weather.rain': '小雨',
    'weather.heavy_rain': '大雨',
    'weather.thunderstorm': '雷陣雨',
    'weather.snow': '雪',
    'weather.fog': '霧',
    'weather.haze': '霾',
    
    // 其他翻译...
    'app.title': '優雅天氣',
    'app.subtitle': '美觀的天氣預報應用'
  },
  
  'en': {
    // 通用
    'loading': 'Loading...',
    'error': 'Error occurred',
    'retry': 'Retry',
    'refresh': 'Refresh',
    'settings': 'Settings',
    'back': 'Back',
    'save': 'Save',
    'cancel': 'Cancel',
    'confirm': 'Confirm',
    'delete': 'Delete',
    'add': 'Add',
    'search': 'Search',
    
    // 导航
    'nav.weather': 'Weather',
    'nav.forecast': 'Forecast',
    'nav.cities': 'Cities',
    'nav.more': 'More',
    
    // 天气相关
    'weather.current': 'Current Weather',
    'weather.feels_like': 'Feels Like',
    'weather.humidity': 'Humidity',
    'weather.wind_speed': 'Wind Speed',
    'weather.wind_direction': 'Wind Direction',
    'weather.pressure': 'Pressure',
    'weather.visibility': 'Visibility',
    'weather.uv_index': 'UV Index',
    'weather.air_quality': 'Air Quality',
    'weather.sunrise': 'Sunrise',
    'weather.sunset': 'Sunset',
    'weather.max_temp': 'Max Temp',
    'weather.min_temp': 'Min Temp',
    'weather.precipitation': 'Precipitation',
    
    // 天气类型
    'weather.sunny': 'Sunny',
    'weather.cloudy': 'Cloudy',
    'weather.overcast': 'Overcast',
    'weather.rain': 'Rain',
    'weather.heavy_rain': 'Heavy Rain',
    'weather.thunderstorm': 'Thunderstorm',
    'weather.snow': 'Snow',
    'weather.fog': 'Fog',
    'weather.haze': 'Haze',
    
    // 其他翻译...
    'app.title': 'Elegant Weather',
    'app.subtitle': 'Beautiful Weather App'
  },
  
  'ja': {
    // 通用
    'loading': '読み込み中...',
    'error': 'エラーが発生しました',
    'retry': '再試行',
    'refresh': '更新',
    'settings': '設定',
    'back': '戻る',
    'save': '保存',
    'cancel': 'キャンセル',
    'confirm': '確認',
    'delete': '削除',
    'add': '追加',
    'search': '検索',
    
    // 导航
    'nav.weather': '天気',
    'nav.forecast': '予報',
    'nav.cities': '都市',
    'nav.more': 'その他',
    
    // 天气相关
    'weather.current': '現在の天気',
    'weather.feels_like': '体感温度',
    'weather.humidity': '湿度',
    'weather.wind_speed': '風速',
    'weather.wind_direction': '風向',
    'weather.pressure': '気圧',
    'weather.visibility': '視程',
    'weather.uv_index': 'UV指数',
    'weather.air_quality': '大気質',
    'weather.sunrise': '日の出',
    'weather.sunset': '日の入り',
    'weather.max_temp': '最高気温',
    'weather.min_temp': '最低気温',
    'weather.precipitation': '降水確率',
    
    // 天气类型
    'weather.sunny': '晴れ',
    'weather.cloudy': '曇り',
    'weather.overcast': '曇天',
    'weather.rain': '雨',
    'weather.heavy_rain': '大雨',
    'weather.thunderstorm': '雷雨',
    'weather.snow': '雪',
    'weather.fog': '霧',
    'weather.haze': 'かすみ',
    
    // 其他翻译...
    'app.title': 'エレガント天気',
    'app.subtitle': '美しい天気予報アプリ'
  },
  
  'ko': {
    // 通用
    'loading': '로딩 중...',
    'error': '오류가 발생했습니다',
    'retry': '다시 시도',
    'refresh': '새로고침',
    'settings': '설정',
    'back': '뒤로',
    'save': '저장',
    'cancel': '취소',
    'confirm': '확인',
    'delete': '삭제',
    'add': '추가',
    'search': '검색',
    
    // 导航
    'nav.weather': '날씨',
    'nav.forecast': '예보',
    'nav.cities': '도시',
    'nav.more': '더보기',
    
    // 天气相关
    'weather.current': '현재 날씨',
    'weather.feels_like': '체감온도',
    'weather.humidity': '습도',
    'weather.wind_speed': '풍속',
    'weather.wind_direction': '풍향',
    'weather.pressure': '기압',
    'weather.visibility': '가시거리',
    'weather.uv_index': 'UV 지수',
    'weather.air_quality': '대기질',
    'weather.sunrise': '일출',
    'weather.sunset': '일몰',
    'weather.max_temp': '최고기온',
    'weather.min_temp': '최저기온',
    'weather.precipitation': '강수확률',
    
    // 天气类型
    'weather.sunny': '맑음',
    'weather.cloudy': '구름많음',
    'weather.overcast': '흐림',
    'weather.rain': '비',
    'weather.heavy_rain': '폭우',
    'weather.thunderstorm': '뇌우',
    'weather.snow': '눈',
    'weather.fog': '안개',
    'weather.haze': '연무',
    
    // 其他翻译...
    'app.title': '우아한 날씨',
    'app.subtitle': '아름다운 날씨 앱'
  },
  
  'fr': {
    // 通用
    'loading': 'Chargement...',
    'error': 'Une erreur s\'est produite',
    'retry': 'Réessayer',
    'refresh': 'Actualiser',
    'settings': 'Paramètres',
    'back': 'Retour',
    'save': 'Enregistrer',
    'cancel': 'Annuler',
    'confirm': 'Confirmer',
    'delete': 'Supprimer',
    'add': 'Ajouter',
    'search': 'Rechercher',
    
    // 导航
    'nav.weather': 'Météo',
    'nav.forecast': 'Prévisions',
    'nav.cities': 'Villes',
    'nav.more': 'Plus',
    
    // 天气相关
    'weather.current': 'Météo Actuelle',
    'weather.feels_like': 'Ressenti',
    'weather.humidity': 'Humidité',
    'weather.wind_speed': 'Vitesse du Vent',
    'weather.wind_direction': 'Direction du Vent',
    'weather.pressure': 'Pression',
    'weather.visibility': 'Visibilité',
    'weather.uv_index': 'Indice UV',
    'weather.air_quality': 'Qualité de l\'Air',
    'weather.sunrise': 'Lever du Soleil',
    'weather.sunset': 'Coucher du Soleil',
    'weather.max_temp': 'Temp. Max',
    'weather.min_temp': 'Temp. Min',
    'weather.precipitation': 'Précipitations',
    
    // 天气类型
    'weather.sunny': 'Ensoleillé',
    'weather.cloudy': 'Nuageux',
    'weather.overcast': 'Couvert',
    'weather.rain': 'Pluie',
    'weather.heavy_rain': 'Forte Pluie',
    'weather.thunderstorm': 'Orage',
    'weather.snow': 'Neige',
    'weather.fog': 'Brouillard',
    'weather.haze': 'Brume',
    
    // 其他翻译...
    'app.title': 'Météo Élégante',
    'app.subtitle': 'Belle Application Météo'
  }
};

// 创建上下文
const LangContext = createContext();

// Provider 组件
export function LangProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('zh-CN');

  // 从本地存储加载语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('weather-app-language');
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    } else {
      // 检测浏览器语言
      const browserLanguage = navigator.language || navigator.userLanguage;
      if (SUPPORTED_LANGUAGES[browserLanguage]) {
        setCurrentLanguage(browserLanguage);
      } else if (browserLanguage.startsWith('zh')) {
        setCurrentLanguage(browserLanguage.includes('TW') || browserLanguage.includes('HK') ? 'zh-TW' : 'zh-CN');
      } else if (SUPPORTED_LANGUAGES[browserLanguage.split('-')[0]]) {
        setCurrentLanguage(browserLanguage.split('-')[0]);
      }
    }
  }, []);

  // 切换语言
  const changeLanguage = (language) => {
    if (SUPPORTED_LANGUAGES[language]) {
      setCurrentLanguage(language);
      localStorage.setItem('weather-app-language', language);
    }
  };

  // 翻译函数
  const t = (key, params = {}) => {
    const translation = translations[currentLanguage]?.[key] || translations['zh-CN']?.[key] || key;
    
    // 替换参数
    return translation.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] || match;
    });
  };

  // 获取当前语言信息
  const getCurrentLanguageInfo = () => {
    return {
      code: currentLanguage,
      name: SUPPORTED_LANGUAGES[currentLanguage],
      isRTL: currentLanguage === 'ar' // 阿拉伯语从右到左
    };
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    getCurrentLanguageInfo,
    supportedLanguages: SUPPORTED_LANGUAGES
  };

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
}

// Hook
export function useLang() {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
}

