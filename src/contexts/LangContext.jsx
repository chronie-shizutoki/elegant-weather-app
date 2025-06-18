import React, { createContext, useContext, useState, useEffect } from 'react';

// 支持的语言列表
const SUPPORTED_LANGUAGES = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'fr', name: 'Français' }
];

// 创建语言上下文
const LangContext = createContext();

// 语言提供者组件
export const LangProvider = ({ children }) => {
  // 从本地存储获取语言设置，默认为简体中文
  const [currentLang, setCurrentLang] = useState(() => {
    const savedLang = localStorage.getItem('weatherAppLang');
    return savedLang || 'zh-CN';
  });
  
  // 语言资源状态
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // 当语言变化时，更新本地存储和文档语言
  useEffect(() => {
    localStorage.setItem('weatherAppLang', currentLang);
    document.documentElement.lang = currentLang;
    
    // 使用fetch加载静态语言资源文件
    setIsLoading(true);
    fetch(`/i18n/${currentLang}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load language ${currentLang}`);
        }
        return response.json();
      })
      .then(data => {
        setTranslations(data);
        console.log(`Language ${currentLang} loaded successfully`);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(`Failed to load language ${currentLang}:`, error);
        // 如果加载失败，回退到默认语言
        if (currentLang !== 'zh-CN') {
          setCurrentLang('zh-CN');
        } else {
          // 如果默认语言也加载失败，使用内置的基本翻译
          setTranslations({
            appName: '优雅天气',
            currentWeather: '当前天气',
            loading: '加载中...'
          });
          setIsLoading(false);
        }
      });
  }, [currentLang]);

  // 切换语言的函数
  const changeLang = (langCode) => {
    if (SUPPORTED_LANGUAGES.some(lang => lang.code === langCode)) {
      setCurrentLang(langCode);
    } else {
      console.error(`Language ${langCode} is not supported`);
    }
  };

  // 获取当前语言名称
  const getCurrentLangName = () => {
    const lang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLang);
    return lang ? lang.name : '简体中文';
  };
  
  // 翻译函数
  const t = (key) => {
    if (!key) return '';
    
    // 处理嵌套键，如 'aqi.good'
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // 如果找不到翻译，返回键名
      }
    }
    
    return value || key;
  };

  return (
    <LangContext.Provider value={{ 
      currentLang, 
      changeLang, 
      supportedLanguages: SUPPORTED_LANGUAGES,
      getCurrentLangName,
      t,
      isLoading
    }}>
      {children}
    </LangContext.Provider>
  );
};

// 自定义钩子，方便组件使用语言上下文
export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
};

export default LangContext;
