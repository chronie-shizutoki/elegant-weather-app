import { useWeather } from '@/contexts/WeatherContext';
import { useTheme, TimeOfDay } from '@/contexts/ThemeContext';
import { 
  Droplets, 
  Wind, 
  Thermometer,
  Gauge,
  Sun,
  Eye,
  Sunrise,
  Sunset,
  Umbrella
} from 'lucide-react';

// 获取风向文字
const getWindDirection = (degrees) => {
  const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

// 获取紫外线等级
const getUVLevel = (index) => {
  if (index <= 2) return { level: '弱', color: 'text-green-500' };
  if (index <= 5) return { level: '中等', color: 'text-yellow-500' };
  if (index <= 7) return { level: '强', color: 'text-orange-500' };
  if (index <= 10) return { level: '很强', color: 'text-red-500' };
  return { level: '极强', color: 'text-purple-500' };
};

// 天气详情组件
export default function WeatherDetails() {
  const { currentWeather, isLoading } = useWeather();
  const { timeOfDay } = useTheme();
  
  // 卡片样式根据时间变化
  let cardStyle = 'bg-white/20 dark:bg-gray-800/40';
  if (timeOfDay === TimeOfDay.NIGHT) {
    cardStyle = 'bg-gray-800/40 text-white';
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className={`${cardStyle} backdrop-blur-md rounded-xl p-4 shadow-lg animate-pulse mt-4`}>
        <h3 className="text-lg font-semibold mb-3">天气详情</h3>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // 无数据状态
  if (!currentWeather || !currentWeather.temperature) {
    return (
      <div className={`${cardStyle} backdrop-blur-md rounded-xl p-4 shadow-lg mt-4`}>
        <p className="text-gray-600 dark:text-gray-300">暂无天气详情数据</p>
      </div>
    );
  }

  // 获取紫外线信息
  const uvLevel = getUVLevel(currentWeather.uvIndex);

  // 计算日出日落时间
  const now = new Date();
  const sunriseTime = new Date(now);
  sunriseTime.setHours(6, Math.floor(Math.random() * 30), 0);
  const sunsetTime = new Date(now);
  sunsetTime.setHours(18, Math.floor(Math.random() * 30), 0);

  return (
    <div className={`${cardStyle} backdrop-blur-md rounded-xl p-4 shadow-lg mt-4 slide-up`}>
      <h3 className="text-lg font-semibold mb-3">天气详情</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* 紫外线 */}
        <div className="bg-white/10 dark:bg-gray-700/20 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Sun className="mr-2 text-yellow-400" size={20} />
            <span className="text-sm opacity-70">紫外线</span>
          </div>
          
          <div className="flex flex-col">
            <span className={`text-2xl font-semibold ${uvLevel.color}`}>
              {uvLevel.level}
            </span>
            
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2.5 rounded-full" 
                style={{ width: `${(currentWeather.uvIndex / 11) * 100}%` }}
              ></div>
            </div>
            
            <span className="text-xs mt-1 opacity-70">
              指数 {currentWeather.uvIndex}
            </span>
          </div>
        </div>
        
        {/* 湿度 */}
        <div className="bg-white/10 dark:bg-gray-700/20 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Droplets className="mr-2 text-blue-400" size={20} />
            <span className="text-sm opacity-70">湿度</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-2xl font-semibold">
              {currentWeather.humidity}%
            </span>
            
            <div className="mt-2 relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-xs text-blue-600 dark:text-blue-400">干燥</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">适宜</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">潮湿</div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full" 
                  style={{ width: `${currentWeather.humidity}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 体感温度 */}
        <div className="bg-white/10 dark:bg-gray-700/20 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Thermometer className="mr-2 text-red-400" size={20} />
            <span className="text-sm opacity-70">体感温度</span>
          </div>
          
          <div className="flex items-end">
            <span className="text-2xl font-semibold">
              {currentWeather.feelsLike}°
            </span>
            
            <span className="text-sm ml-2 opacity-70">
              {currentWeather.feelsLike > currentWeather.temperature ? '比实际温度高' : '比实际温度低'}
            </span>
          </div>
          
          <div className="mt-2 text-xs opacity-70">
            {currentWeather.feelsLike >= 35 ? '酷热难耐' : 
             currentWeather.feelsLike >= 30 ? '炎热' : 
             currentWeather.feelsLike >= 25 ? '温暖' : 
             currentWeather.feelsLike >= 15 ? '舒适' : 
             currentWeather.feelsLike >= 10 ? '凉爽' : 
             currentWeather.feelsLike >= 0 ? '寒冷' : '极冷'}
          </div>
        </div>
        
        {/* 风力 */}
        <div className="bg-white/10 dark:bg-gray-700/20 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Wind className="mr-2 text-blue-400" size={20} />
            <span className="text-sm opacity-70">风力</span>
          </div>
          
          <div className="flex items-end">
            <span className="text-2xl font-semibold">
              {currentWeather.windSpeed}级
            </span>
            
            <span className="text-sm ml-2">
              {getWindDirection(currentWeather.windDirection)}风
            </span>
          </div>
          
          <div className="mt-2 text-xs opacity-70">
            {currentWeather.windSpeed <= 3 ? '微风' : 
             currentWeather.windSpeed <= 5 ? '和风' : 
             currentWeather.windSpeed <= 7 ? '强风' : '大风'}
          </div>
        </div>
        
        {/* 气压 */}
        <div className="bg-white/10 dark:bg-gray-700/20 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Gauge className="mr-2 text-purple-400" size={20} />
            <span className="text-sm opacity-70">气压</span>
          </div>
          
          <div className="flex items-end">
            <span className="text-2xl font-semibold">
              {currentWeather.pressure}
            </span>
            
            <span className="text-sm ml-2">hPa</span>
          </div>
          
          <div className="mt-2 text-xs opacity-70">
            {currentWeather.pressure >= 1020 ? '高气压' : 
             currentWeather.pressure >= 1000 ? '正常气压' : '低气压'}
          </div>
        </div>
        
        {/* 能见度 */}
        <div className="bg-white/10 dark:bg-gray-700/20 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Eye className="mr-2 text-green-400" size={20} />
            <span className="text-sm opacity-70">能见度</span>
          </div>
          
          <div className="flex items-end">
            <span className="text-2xl font-semibold">
              {currentWeather.visibility}
            </span>
            
            <span className="text-sm ml-2">km</span>
          </div>
          
          <div className="mt-2 text-xs opacity-70">
            {currentWeather.visibility >= 10 ? '优' : 
             currentWeather.visibility >= 5 ? '良好' : 
             currentWeather.visibility >= 2 ? '一般' : '较差'}
          </div>
        </div>
        
        {/* 日出日落 */}
        <div className="bg-white/10 dark:bg-gray-700/20 rounded-lg p-4 col-span-2">
          <div className="flex items-center mb-2">
            <Sunrise className="mr-2 text-orange-400" size={20} />
            <span className="text-sm opacity-70">日出日落</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <Sunrise className="text-orange-400 mb-1" size={24} />
              <span className="text-lg font-semibold">
                {sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-xs opacity-70">日出</span>
            </div>
            
            <div className="flex-1 mx-4">
              <div className="relative h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                <div 
                  className="absolute h-3 w-3 bg-yellow-400 rounded-full top-1/2 transform -translate-y-1/2"
                  style={{ 
                    left: `${Math.min(100, Math.max(0, ((now - sunriseTime) / (sunsetTime - sunriseTime)) * 100))}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <Sunset className="text-orange-400 mb-1" size={24} />
              <span className="text-lg font-semibold">
                {sunsetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-xs opacity-70">日落</span>
            </div>
          </div>
        </div>
        
        {/* 降水概率 */}
        <div className="bg-white/10 dark:bg-gray-700/20 rounded-lg p-4 col-span-2">
          <div className="flex items-center mb-2">
            <Umbrella className="mr-2 text-blue-400" size={20} />
            <span className="text-sm opacity-70">降水概率</span>
          </div>
          
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, index) => {
              const hour = new Date();
              hour.setHours(hour.getHours() + index);
              const probability = Math.floor(Math.random() * 100);
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-xs opacity-70">
                    {index === 0 ? '现在' : `${hour.getHours()}:00`}
                  </span>
                  
                  <div className="h-20 w-4 bg-gray-200 dark:bg-gray-600 rounded-full mt-1 relative">
                    <div 
                      className="absolute bottom-0 w-4 bg-blue-500 rounded-full"
                      style={{ height: `${probability}%` }}
                    ></div>
                  </div>
                  
                  <span className="text-xs mt-1">
                    {probability}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

