import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLang } from '../../contexts/LangContext';

/**
 * 语言切换组件 - 使用液体玻璃效果实现优雅的语言切换界面
 */
const LanguageSwitcher = ({ className }) => {
  const { t } = useTranslation();
  const { currentLang, changeLang, supportedLanguages } = useLang();
  const [isOpen, setIsOpen] = React.useState(false);
  
  // 切换下拉菜单
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // 选择语言
  const selectLanguage = (langCode) => {
    changeLang(langCode);
    setIsOpen(false);
  };
  
  // 获取当前语言的显示名称
  const getCurrentLangDisplay = () => {
    const lang = supportedLanguages.find(lang => lang.code === currentLang);
    return lang ? lang.name : '简体中文';
  };
  
  return (
    <div className={`language-switcher relative ${className}`}>
      <button 
        className="liquid-glass liquid-button rounded-full p-2 flex items-center justify-center"
        onClick={toggleDropdown}
        aria-label={t('switchLanguage')}
        aria-expanded={isOpen}
      >
        <span className="text-xl">🌐</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown absolute right-0 mt-2 z-50 min-w-[150px]">
          <div className="liquid-glass p-2 rounded-xl">
            <div className="py-1 text-white/90 text-center border-b border-white/20 mb-2">
              {t('selectLanguage')}
            </div>
            <ul>
              {supportedLanguages.map((lang) => (
                <li key={lang.code}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      currentLang === lang.code 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                    onClick={() => selectLanguage(lang.code)}
                  >
                    {lang.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .language-dropdown {
          animation: dropdown-appear 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: top right;
        }
        
        @keyframes dropdown-appear {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
