import { useState } from 'react';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';
import { 
  Settings, 
  Globe, 
  Thermometer, 
  Wind, 
  Bell, 
  Moon, 
  Palette,
  Info,
  ChevronRight,
  Check,
  X
} from 'lucide-react';

export default function SettingsPage() {
  const { 
    themeMode, 
    changeThemeMode, 
    isDarkMode, 
    getCardStyle, 
    getTextColor,
    timeOfDay,
    getTimeOfDayName
  } = useTheme();
  const { 
    t, 
    currentLanguage, 
    changeLanguage, 
    supportedLanguages 
  } = useLang();

  const [notifications, setNotifications] = useState({
    morning: true,
    weatherAlert: true,
    abnormalWeather: true,
    nightMode: false,
    autoUpdate: true
  });

  const [units, setUnits] = useState({
    temperature: 'celsius',
    wind: 'beaufort'
  });

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // 切换通知设置
  const toggleNotification = (key) => {
    const newNotifications = {
      ...notifications,
      [key]: !notifications[key]
    };
    setNotifications(newNotifications);
    localStorage.setItem('weather-app-notifications', JSON.stringify(newNotifications));
  };

  // 切换单位设置
  const changeUnit = (type, value) => {
    const newUnits = {
      ...units,
      [type]: value
    };
    setUnits(newUnits);
    localStorage.setItem('weather-app-units', JSON.stringify(newUnits));
  };

  // 设置项组件
  const SettingItem = ({ icon: Icon, title, subtitle, children, onClick }) => (
    <div 
      className={`p-4 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <Icon className="mr-3" size={20} style={{ color: getTextColor('secondary') }} />
          <div className="flex-1">
            <div className="font-semibold" style={{ color: getTextColor() }}>
              {title}
            </div>
            {subtitle && (
              <div className="text-sm" style={{ color: getTextColor('secondary') }}>
                {subtitle}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center">
          {children}
          {onClick && (
            <ChevronRight className="ml-2" size={16} style={{ color: getTextColor('secondary') }} />
          )}
        </div>
      </div>
    </div>
  );

  // 开关组件
  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
        checked ? 'bg-blue-500' : 'bg-gray-400 bg-opacity-50'
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
          checked ? 'left-7' : 'left-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div 
        className="p-6 text-center"
        style={getCardStyle(0.9)}
      >
        <h1 className="text-2xl font-bold mb-2" style={{ color: getTextColor() }}>
          {t('settings.title')}
        </h1>
        <p style={{ color: getTextColor('secondary') }}>
          个性化您的天气体验
        </p>
      </div>

      {/* 当前状态 */}
      <div 
        className="p-4"
        style={getCardStyle(0.9)}
      >
        <h3 className="text-lg font-semibold mb-3" style={{ color: getTextColor() }}>
          当前状态
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-white bg-opacity-10">
            <div className="text-sm" style={{ color: getTextColor('secondary') }}>
              时间段
            </div>
            <div className="font-semibold" style={{ color: getTextColor() }}>
              {getTimeOfDayName(t)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white bg-opacity-10">
            <div className="text-sm" style={{ color: getTextColor('secondary') }}>
              主题模式
            </div>
            <div className="font-semibold" style={{ color: getTextColor() }}>
              {themeMode === ThemeMode.AUTO ? '自动' : themeMode === ThemeMode.DARK ? '深色' : '浅色'}
            </div>
          </div>
        </div>
      </div>

      {/* 外观设置 */}
      <div 
        className="p-4"
        style={getCardStyle(0.9)}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: getTextColor() }}>
          外观设置
        </h3>
        <div className="space-y-3">
          <SettingItem
            icon={Globe}
            title={t('settings.language')}
            subtitle={supportedLanguages[currentLanguage]}
            onClick={() => setShowLanguageModal(true)}
          />
          
          <SettingItem
            icon={Palette}
            title="主题模式"
            subtitle={`当前: ${themeMode === ThemeMode.AUTO ? '自动切换' : themeMode === ThemeMode.DARK ? '深色模式' : '浅色模式'}`}
            onClick={() => setShowThemeModal(true)}
          />
        </div>
      </div>

      {/* 单位设置 */}
      <div 
        className="p-4"
        style={getCardStyle(0.9)}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: getTextColor() }}>
          单位设置
        </h3>
        <div className="space-y-3">
          <SettingItem
            icon={Thermometer}
            title={t('settings.temperature_unit')}
            subtitle={units.temperature === 'celsius' ? '摄氏度 (°C)' : '华氏度 (°F)'}
          >
            <div className="flex space-x-2">
              <button
                onClick={() => changeUnit('temperature', 'celsius')}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                  units.temperature === 'celsius' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white bg-opacity-20'
                }`}
                style={{ color: units.temperature === 'celsius' ? 'white' : getTextColor() }}
              >
                °C
              </button>
              <button
                onClick={() => changeUnit('temperature', 'fahrenheit')}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                  units.temperature === 'fahrenheit' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white bg-opacity-20'
                }`}
                style={{ color: units.temperature === 'fahrenheit' ? 'white' : getTextColor() }}
              >
                °F
              </button>
            </div>
          </SettingItem>

          <SettingItem
            icon={Wind}
            title={t('settings.wind_unit')}
            subtitle={units.wind === 'beaufort' ? '蒲福风力等级' : '公里/小时'}
          >
            <div className="flex space-x-2">
              <button
                onClick={() => changeUnit('wind', 'beaufort')}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                  units.wind === 'beaufort' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white bg-opacity-20'
                }`}
                style={{ color: units.wind === 'beaufort' ? 'white' : getTextColor() }}
              >
                级
              </button>
              <button
                onClick={() => changeUnit('wind', 'kmh')}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                  units.wind === 'kmh' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white bg-opacity-20'
                }`}
                style={{ color: units.wind === 'kmh' ? 'white' : getTextColor() }}
              >
                km/h
              </button>
            </div>
          </SettingItem>
        </div>
      </div>

      {/* 通知设置 */}
      <div 
        className="p-4"
        style={getCardStyle(0.9)}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: getTextColor() }}>
          {t('settings.notifications')}
        </h3>
        <div className="space-y-3">
          <SettingItem
            icon={Bell}
            title={t('settings.morning_notification')}
            subtitle="开启后，7:00/19:00 左右将会收到今天/明天天气推送"
          >
            <Toggle 
              checked={notifications.morning}
              onChange={() => toggleNotification('morning')}
            />
          </SettingItem>

          <SettingItem
            icon={Bell}
            title={t('settings.weather_alert')}
            subtitle="开启后，将会收到气象灾害预警推送"
          >
            <Toggle 
              checked={notifications.weatherAlert}
              onChange={() => toggleNotification('weatherAlert')}
            />
          </SettingItem>

          <SettingItem
            icon={Bell}
            title={t('settings.abnormal_weather')}
            subtitle="开启后，在降雨、空气质量等天气变化时收到推送"
          >
            <Toggle 
              checked={notifications.abnormalWeather}
              onChange={() => toggleNotification('abnormalWeather')}
            />
          </SettingItem>

          <SettingItem
            icon={Moon}
            title="夜间免打扰"
            subtitle="开启后，23:00-次日7:00将屏蔽天气推送"
          >
            <Toggle 
              checked={notifications.nightMode}
              onChange={() => toggleNotification('nightMode')}
            />
          </SettingItem>
        </div>
      </div>

      {/* 其他设置 */}
      <div 
        className="p-4"
        style={getCardStyle(0.9)}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: getTextColor() }}>
          其他设置
        </h3>
        <div className="space-y-3">
          <SettingItem
            icon={Settings}
            title={t('settings.auto_update')}
            subtitle="关闭后，23:00-次日7:00将不会自动联网更新天气"
          >
            <Toggle 
              checked={notifications.autoUpdate}
              onChange={() => toggleNotification('autoUpdate')}
            />
          </SettingItem>

          <SettingItem
            icon={Info}
            title={t('settings.about')}
            subtitle="版本信息和用户体验计划"
            onClick={() => setShowAboutModal(true)}
          />
        </div>
      </div>

      {/* 语言选择模态框 */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowLanguageModal(false)} />
          <div 
            className="relative w-full max-w-md max-h-96 overflow-y-auto rounded-lg p-6"
            style={getCardStyle(0.95)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: getTextColor() }}>
                选择语言
              </h3>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                style={{ color: getTextColor('secondary') }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {Object.entries(supportedLanguages).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => {
                    changeLanguage(code);
                    setShowLanguageModal(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                  style={{ color: getTextColor() }}
                >
                  <span>{name}</span>
                  {currentLanguage === code && (
                    <Check size={16} className="text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 主题选择模态框 */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowThemeModal(false)} />
          <div 
            className="relative w-full max-w-md rounded-lg p-6"
            style={getCardStyle(0.95)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: getTextColor() }}>
                主题模式
              </h3>
              <button
                onClick={() => setShowThemeModal(false)}
                className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                style={{ color: getTextColor('secondary') }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { mode: ThemeMode.AUTO, name: '自动切换', desc: '根据时间自动切换主题' },
                { mode: ThemeMode.LIGHT, name: '浅色模式', desc: '始终使用浅色主题' },
                { mode: ThemeMode.DARK, name: '深色模式', desc: '始终使用深色主题' }
              ].map((theme) => (
                <button
                  key={theme.mode}
                  onClick={() => {
                    changeThemeMode(theme.mode);
                    setShowThemeModal(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                  style={{ color: getTextColor() }}
                >
                  <div className="text-left">
                    <div className="font-semibold">{theme.name}</div>
                    <div className="text-sm" style={{ color: getTextColor('secondary') }}>
                      {theme.desc}
                    </div>
                  </div>
                  {themeMode === theme.mode && (
                    <Check size={16} className="text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 关于模态框 */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAboutModal(false)} />
          <div 
            className="relative w-full max-w-md rounded-lg p-6"
            style={getCardStyle(0.95)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: getTextColor() }}>
                关于优雅天气
              </h3>
              <button
                onClick={() => setShowAboutModal(false)}
                className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                style={{ color: getTextColor('secondary') }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Settings className="text-white" size={32} />
                </div>
                <h4 className="text-xl font-bold mb-2" style={{ color: getTextColor() }}>
                  优雅天气
                </h4>
                <p className="text-sm" style={{ color: getTextColor('secondary') }}>
                  版本 1.0.0
                </p>
              </div>
              <div className="text-sm space-y-2" style={{ color: getTextColor('secondary') }}>
                <p>一个美观优雅的天气应用，支持多语言，具有3D渲染动画效果，适配深色模式和多平台。</p>
                <p>© 2024 优雅天气. 保留所有权利。</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

