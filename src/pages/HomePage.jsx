import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import CurrentWeatherCard from '../components/weather/CurrentWeatherCard';
import HourlyForecast from '../components/weather/HourlyForecast';
import DailyForecast from '../components/weather/DailyForecast';
import WeatherDetails from '../components/weather/WeatherDetails';

/**
 * 主页组件 - 使用液体玻璃效果和3D动画展示天气信息
 */
const HomePage = () => {
  const { t } = useTranslation();
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
      className="home-page"
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
    >
      <motion.div variants={itemVariants}>
        <CurrentWeatherCard />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <HourlyForecast />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <DailyForecast />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <WeatherDetails />
      </motion.div>
      
      <style jsx>{`
        .home-page {
          padding-bottom: 30px;
        }
      `}</style>
    </motion.div>
  );
};

export default HomePage;
