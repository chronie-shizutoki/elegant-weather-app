import { createContext, useContext, useEffect, useState } from 'react';

// 创建语言上下文
const LangContext = createContext();

// 支持的语言列表
export const SUPPORTED_LANGUAGES = {
  'zh-CN': { name: '简体中文', nativeName: '简体中文' },
  'zh-TW': { name: '繁體中文', nativeName: '繁體中文' },
  'en': { name: 'English', nativeName: 'English' },
  'ja': { name: 'Japanese', nativeName: '日本語' },
  'ko': { name: 'Korean', nativeName: '한국어' },
  'fr': { name: 'French', nativeName: 'Français' },
  'de': { name: 'German', nativeName: 'Deutsch' },
  'es': { name: 'Spanish', nativeName: 'Español' },
  'ru': { name: 'Russian', nativeName: 'Русский' },
};

// 语言提供者组件
export function LangProvider({ children }) {
  // 当前语言状态
  const [currentLang, setCurrentLang] = useState('zh-CN');
  
  // 检测浏览器语言
  const detectBrowserLang = () => {
    const browserLang = navigator.language;
    
    // 检查是否支持浏览器语言
    if (SUPPORTED_LANGUAGES[browserLang]) {
      return browserLang;
    }
    
    // 检查是否支持浏览器语言的基础语言（例如 zh-HK -> zh-TW）
    const baseLang = browserLang.split('-')[0];
    
    if (baseLang === 'zh') {
      // 对于中文，区分简体和繁体
      if (browserLang.includes('TW') || browserLang.includes('HK') || browserLang.includes('MO')) {
        return 'zh-TW';
      } else {
        return 'zh-CN';
      }
    }
    
    // 检查是否支持基础语言
    for (const lang in SUPPORTED_LANGUAGES) {
      if (lang.startsWith(baseLang)) {
        return lang;
      }
    }
    
    // 默认返回简体中文
    return 'zh-CN';
  };

  // 切换语言
  const changeLang = (lang) => {
    if (SUPPORTED_LANGUAGES[lang]) {
      setCurrentLang(lang);
      localStorage.setItem('preferredLanguage', lang);
    }
  };

  // 初始化语言设置
  useEffect(() => {
    // 首先检查本地存储中是否有保存的语言偏好
    const savedLang = localStorage.getItem('preferredLanguage');
    
    if (savedLang && SUPPORTED_LANGUAGES[savedLang]) {
      setCurrentLang(savedLang);
    } else {
      // 如果没有保存的语言偏好，则检测浏览器语言
      const detectedLang = detectBrowserLang();
      setCurrentLang(detectedLang);
      localStorage.setItem('preferredLanguage', detectedLang);
    }
  }, []);

  // 提供的上下文值
  const value = {
    currentLang,
    supportedLanguages: SUPPORTED_LANGUAGES,
    changeLang,
  };

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
}

// 自定义钩子，用于访问语言上下文
export function useLang() {
  const context = useContext(LangContext);
  if (context === undefined) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
}

