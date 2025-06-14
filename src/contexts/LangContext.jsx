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

  // 当语言变化时，更新本地存储和文档语言
  useEffect(() => {
    localStorage.setItem('weatherAppLang', currentLang);
    document.documentElement.lang = currentLang;
    
    // 加载对应的语言资源
    import(`../i18n/${currentLang}.json`)
      .then(module => {
        // 这里可以添加语言资源加载完成后的处理
        console.log(`Language ${currentLang} loaded successfully`);
      })
      .catch(error => {
        console.error(`Failed to load language ${currentLang}:`, error);
        // 如果加载失败，回退到默认语言
        if (currentLang !== 'zh-CN') {
          setCurrentLang('zh-CN');
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

  return (
    <LangContext.Provider value={{ 
      currentLang, 
      changeLang, 
      supportedLanguages: SUPPORTED_LANGUAGES,
      getCurrentLangName
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
