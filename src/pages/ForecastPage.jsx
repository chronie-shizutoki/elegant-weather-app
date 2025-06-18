import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useWeather } from '../contexts/WeatherContext';
import HourlyForecast from '../components/weather/HourlyForecast';
import DailyForecast from '../components/weather/DailyForecast';

/**
 * 预报页面组件 - 使用液体玻璃效果和3D动画展示详细天气预报
 */
const ForecastPage = () => {
  const { t } = useTranslation();
  const { weather } = useWeather();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 模拟加载完成
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 组件进入动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };
  
  return (
    <motion.div
      className="forecast-page"
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
    >
      <motion.div 
        className="liquid-glass liquid-card mb-6"
        variants={itemVariants}
      >
        <div className="liquid-card-header">
          <h2 className="text-2xl font-bold text-white/90">{t('dailyForecast')}</h2>
        </div>
        <div className="liquid-card-content">
          <p className="text-white/80 mb-4">
            {t('forecastDescription')}
          </p>
          
          <div className="location-info flex items-center mb-4">
            <span className="icon text-2xl mr-2">📍</span>
            <span className="text-white font-medium">{weather.location}</span>
          </div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <HourlyForecast />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <DailyForecast />
      </motion.div>
      
      <motion.div 
        className="liquid-glass liquid-card mt-6"
        variants={itemVariants}
      >
        <div className="liquid-card-header">
          <h3 className="text-xl font-semibold text-white/90">{t('forecastDisclaimer')}</h3>
        </div>
        <div className="liquid-card-content">
          <p className="text-white/70 text-sm">
            {t('forecastDisclaimerText')}
          </p>
        </div>
      </motion.div>
      
      <style jsx>{`
        .forecast-page {
          padding-bottom: 30px;
        }
      `}</style>
    </motion.div>
  );
};

export default ForecastPage;
