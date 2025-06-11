import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';

const SettingsPage = () => {
  const { theme, isDarkMode, toggleDarkMode } = useTheme();
  const { t, currentLang, changeLang, supportedLanguages } = useLang();
  const [notifications, setNotifications] = useState({
    weather: true,
    alerts: true,
    daily: false,
    nightMode: false
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const settingSections = [
    {
      title: '天气提醒',
      items: [
        {
          key: 'weather',
          label: '早晚天气提醒',
          description: '开启后，7:00/19:00 左右将会收到今天/明天天气推送',
          value: notifications.weather
        },
        {
          key: 'alerts',
          label: '天气预警提醒',
          description: '开启后，将会收到气象灾害预警推送',
          value: notifications.alerts
        },
        {
          key: 'daily',
          label: '异常天气提醒',
          description: '开启后，在降雨、空气质量等天气变化时收到推送',
          value: notifications.daily
        },
        {
          key: 'nightMode',
          label: '夜间免打扰',
          description: '开启后，23:00-次日7:00将屏蔽天气推送',
          value: notifications.nightMode
        }
      ]
    },
    {
      title: '单位',
      items: [
        {
          key: 'temperature',
          label: '温度单位',
          description: '摄氏度°C',
          type: 'select',
          options: ['摄氏度°C', '华氏度°F']
        },
        {
          key: 'windSpeed',
          label: '风力单位',
          description: '蒲福风力等级 (Beaufort scale)',
          type: 'select',
          options: ['蒲福风力等级', 'km/h', 'm/s', 'mph']
        }
      ]
    },
    {
      title: '其他设置',
      items: [
        {
          key: 'autoUpdate',
          label: '夜间自动更新',
          description: '关闭后，23:00-次日7:00将不会自动联网更新天气',
          value: true
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div 
        className={`rounded-3xl p-6 ${theme.blur} ${theme.shadow} animate-fadeIn`}
        style={{ 
          background: theme.cardBackground,
          border: `1px solid ${theme.borderColor}`
        }}
      >
        <h2 className={`text-2xl font-bold ${theme.textColor} flex items-center space-x-3`}>
          <span className="text-3xl">⚙️</span>
          <span>{t('settings')}</span>
        </h2>
      </div>

      {/* 主题和语言设置 */}
      <div 
        className={`rounded-3xl p-6 ${theme.blur} ${theme.shadow} animate-slideInUp`}
        style={{ 
          background: theme.cardBackground,
          border: `1px solid ${theme.borderColor}`
        }}
      >
        <h3 className={`text-lg font-semibold ${theme.textColor} mb-4`}>外观和语言</h3>
        
        <div className="space-y-4">
          {/* 主题切换 */}
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${theme.textColor}`}>深色模式</div>
              <div className={`text-sm ${theme.secondaryTextColor}`}>
                根据时间自动切换或手动选择
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 语言选择 */}
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${theme.textColor}`}>语言</div>
              <div className={`text-sm ${theme.secondaryTextColor}`}>
                选择应用界面语言
              </div>
            </div>
            <select
              value={currentLang}
              onChange={(e) => changeLang(e.target.value)}
              className={`px-4 py-2 rounded-xl ${theme.blur} ${theme.textColor} border-0 focus:ring-2 focus:ring-blue-500`}
              style={{ 
                background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                border: `1px solid ${theme.borderColor}`
              }}
            >
              {Object.entries(supportedLanguages).map(([code, name]) => (
                <option key={code} value={code} className="bg-gray-800 text-white">
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 设置分组 */}
      {settingSections.map((section, sectionIndex) => (
        <div 
          key={section.title}
          className={`rounded-3xl p-6 ${theme.blur} ${theme.shadow} animate-slideInUp`}
          style={{ 
            background: theme.cardBackground,
            border: `1px solid ${theme.borderColor}`,
            animationDelay: `${(sectionIndex + 1) * 100}ms`
          }}
        >
          <h3 className={`text-lg font-semibold ${theme.textColor} mb-4`}>
            {section.title}
          </h3>
          
          <div className="space-y-4">
            {section.items.map((item, itemIndex) => (
              <div 
                key={item.key}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]`}
                style={{ 
                  background: isDarkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.3)',
                  border: `1px solid ${theme.borderColor}`
                }}
              >
                <div className="flex-1">
                  <div className={`font-medium ${theme.textColor} mb-1`}>
                    {item.label}
                  </div>
                  <div className={`text-sm ${theme.secondaryTextColor}`}>
                    {item.description}
                  </div>
                </div>
                
                <div className="ml-4">
                  {item.type === 'select' ? (
                    <select
                      className={`px-3 py-2 rounded-lg ${theme.blur} ${theme.textColor} border-0 focus:ring-2 focus:ring-blue-500`}
                      style={{ 
                        background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                        border: `1px solid ${theme.borderColor}`
                      }}
                    >
                      {item.options.map((option) => (
                        <option key={option} value={option} className="bg-gray-800 text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <button
                      onClick={() => handleNotificationChange(item.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                        item.value ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                          item.value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 关于应用 */}
      <div 
        className={`rounded-3xl p-6 ${theme.blur} ${theme.shadow} animate-slideInUp`}
        style={{ 
          background: theme.cardBackground,
          border: `1px solid ${theme.borderColor}`,
          animationDelay: '400ms'
        }}
      >
        <h3 className={`text-lg font-semibold ${theme.textColor} mb-4`}>关于天气</h3>
        
        <div className="space-y-3">
          <div 
            className={`p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
            style={{ 
              background: isDarkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.3)',
              border: `1px solid ${theme.borderColor}`
            }}
          >
            <div className={`font-medium ${theme.textColor}`}>用户体验计划</div>
            <div className={`text-sm ${theme.secondaryTextColor} mt-1`}>
              帮助我们改进应用体验
            </div>
          </div>
          
          <div 
            className={`p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
            style={{ 
              background: isDarkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.3)',
              border: `1px solid ${theme.borderColor}`
            }}
          >
            <div className={`font-medium ${theme.textColor}`}>版本信息</div>
            <div className={`text-sm ${theme.secondaryTextColor} mt-1`}>
              v1.0.0 - 美观优雅的天气应用
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

