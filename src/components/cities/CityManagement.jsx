import { useState, useEffect } from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';
import { 
  Search, 
  MapPin, 
  Plus, 
  Trash2, 
  Navigation,
  Clock,
  Star,
  X
} from 'lucide-react';

// 中国主要城市数据
const MAJOR_CITIES = [
  '北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市',
  '成都市', '武汉市', '西安市', '重庆市', '天津市', '苏州市',
  '长沙市', '郑州市', '青岛市', '大连市', '宁波市', '厦门市',
  '福州市', '济南市', '昆明市', '兰州市', '石家庄市', '哈尔滨市',
  '长春市', '沈阳市', '太原市', '合肥市', '南昌市', '贵阳市',
  '海口市', '银川市', '西宁市', '乌鲁木齐市', '拉萨市', '呼和浩特市'
];

// 国际城市数据
const INTERNATIONAL_CITIES = [
  '东京', '首尔', '新加坡', '曼谷', '吉隆坡', '雅加达',
  '马尼拉', '河内', '金边', '仰光', '新德里', '孟买',
  '伦敦', '巴黎', '柏林', '罗马', '马德里', '阿姆斯特丹',
  '纽约', '洛杉矶', '芝加哥', '旧金山', '西雅图', '波士顿',
  '多伦多', '温哥华', '悉尼', '墨尔本', '奥克兰', '开普敦'
];

export default function CityManagement() {
  const { cities, selectedCity, selectCity, addCity, removeCity } = useWeather();
  const { getCardStyle, getTextColor } = useTheme();
  const { t } = useLang();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // 从本地存储加载搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('weather-app-search-history');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }, []);

  // 保存搜索历史到本地存储
  const saveSearchHistory = (history) => {
    localStorage.setItem('weather-app-search-history', JSON.stringify(history));
  };

  // 添加到搜索历史
  const addToSearchHistory = (city) => {
    const newHistory = [city, ...searchHistory.filter(c => c !== city)].slice(0, 10);
    setSearchHistory(newHistory);
    saveSearchHistory(newHistory);
  };

  // 清除搜索历史
  const clearSearchHistory = () => {
    setSearchHistory([]);
    saveSearchHistory([]);
  };

  // 搜索城市
  const searchCities = (query) => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    const allCities = [...MAJOR_CITIES, ...INTERNATIONAL_CITIES];
    
    return allCities.filter(city => 
      city.toLowerCase().includes(lowerQuery) ||
      city.replace('市', '').toLowerCase().includes(lowerQuery)
    ).slice(0, 20);
  };

  // 处理搜索输入
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  // 选择城市
  const handleCitySelect = (city) => {
    selectCity(city);
    addToSearchHistory(city);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // 添加城市到收藏
  const handleAddCity = (city) => {
    addCity(city);
    addToSearchHistory(city);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // 删除城市
  const handleRemoveCity = (city) => {
    removeCity(city);
  };

  // 获取搜索结果
  const searchResults = searchCities(searchQuery);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div 
        className="p-6 text-center"
        style={getCardStyle(0.9)}
      >
        <h1 className="text-2xl font-bold mb-2" style={{ color: getTextColor() }}>
          {t('cities.title')}
        </h1>
        <p style={{ color: getTextColor('secondary') }}>
          管理您关注的城市天气
        </p>
      </div>

      {/* 搜索框 */}
      <div 
        className="p-4 relative"
        style={getCardStyle(0.9)}
      >
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2" 
            size={20} 
            style={{ color: getTextColor('secondary') }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t('cities.search_placeholder')}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            style={{ 
              color: getTextColor(),
              '::placeholder': { color: getTextColor('secondary') }
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
              style={{ color: getTextColor('secondary') }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 搜索结果 */}
        {showSearchResults && (
          <div 
            className="absolute top-full left-4 right-4 mt-2 max-h-64 overflow-y-auto rounded-lg shadow-lg z-50"
            style={getCardStyle(0.95)}
          >
            {searchResults.length > 0 ? (
              <div className="p-2">
                {searchResults.map((city, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 cursor-pointer"
                    onClick={() => handleCitySelect(city)}
                  >
                    <div className="flex items-center">
                      <MapPin className="mr-3" size={16} style={{ color: getTextColor('secondary') }} />
                      <span style={{ color: getTextColor() }}>{city}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddCity(city);
                      }}
                      className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                      style={{ color: getTextColor('secondary') }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center" style={{ color: getTextColor('secondary') }}>
                未找到匹配的城市
              </div>
            )}
          </div>
        )}
      </div>

      {/* 当前定位 */}
      <div 
        className="p-4"
        style={getCardStyle(0.9)}
      >
        <h3 className="text-lg font-semibold mb-3 flex items-center" style={{ color: getTextColor() }}>
          <Navigation className="mr-2" size={20} />
          {t('cities.current_location')}
        </h3>
        <div 
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
            selectedCity === cities[0] ? 'bg-blue-500 bg-opacity-30 ring-2 ring-blue-400' : 'bg-white bg-opacity-10 hover:bg-opacity-20'
          }`}
          onClick={() => handleCitySelect(cities[0])}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="mr-3 text-blue-400" size={20} />
              <div>
                <div className="font-semibold" style={{ color: getTextColor() }}>
                  {cities[0] || '北京市'}
                </div>
                <div className="text-sm" style={{ color: getTextColor('secondary') }}>
                  当前位置
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold" style={{ color: getTextColor() }}>
                26°
              </div>
              <div className="text-sm" style={{ color: getTextColor('secondary') }}>
                晴朗
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 收藏的城市 */}
      {cities.length > 1 && (
        <div 
          className="p-4"
          style={getCardStyle(0.9)}
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center" style={{ color: getTextColor() }}>
            <Star className="mr-2" size={20} />
            收藏的城市
          </h3>
          <div className="space-y-2">
            {cities.slice(1).map((city, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedCity === city ? 'bg-blue-500 bg-opacity-30 ring-2 ring-blue-400' : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                }`}
                onClick={() => handleCitySelect(city)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="mr-3" size={16} style={{ color: getTextColor('secondary') }} />
                    <span style={{ color: getTextColor() }}>{city}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-3">
                      <div className="font-semibold" style={{ color: getTextColor() }}>
                        {Math.floor(Math.random() * 20) + 10}°
                      </div>
                      <div className="text-xs" style={{ color: getTextColor('secondary') }}>
                        多云
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCity(city);
                      }}
                      className="p-1 rounded-full hover:bg-red-500 hover:bg-opacity-20 text-red-400 hover:text-red-300 transition-all duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 搜索历史 */}
      {searchHistory.length > 0 && (
        <div 
          className="p-4"
          style={getCardStyle(0.9)}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center" style={{ color: getTextColor() }}>
              <Clock className="mr-2" size={20} />
              {t('cities.search_history')}
            </h3>
            <button
              onClick={clearSearchHistory}
              className="text-sm px-3 py-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
              style={{ color: getTextColor('secondary') }}
            >
              清除
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((city, index) => (
              <button
                key={index}
                onClick={() => handleCitySelect(city)}
                className="px-3 py-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 text-sm"
                style={{ color: getTextColor() }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 主要城市 */}
      <div 
        className="p-4"
        style={getCardStyle(0.9)}
      >
        <h3 className="text-lg font-semibold mb-3" style={{ color: getTextColor() }}>
          {t('cities.major_cities')}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {MAJOR_CITIES.slice(0, 12).map((city, index) => (
            <button
              key={index}
              onClick={() => handleCitySelect(city)}
              className="p-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 text-sm"
              style={{ color: getTextColor() }}
            >
              {city.replace('市', '')}
            </button>
          ))}
        </div>
      </div>

      {/* 国际城市 */}
      <div 
        className="p-4"
        style={getCardStyle(0.9)}
      >
        <h3 className="text-lg font-semibold mb-3" style={{ color: getTextColor() }}>
          国际城市
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {INTERNATIONAL_CITIES.slice(0, 12).map((city, index) => (
            <button
              key={index}
              onClick={() => handleCitySelect(city)}
              className="p-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 text-sm"
              style={{ color: getTextColor() }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

