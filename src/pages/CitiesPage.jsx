import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * 城市管理页面组件 - 使用液体玻璃效果和3D动画展示城市列表和管理功能
 */
const CitiesPage = () => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [cities, setCities] = useState([
    { id: 1, name: '北京', country: '中国', isFavorite: true },
    { id: 2, name: '上海', country: '中国', isFavorite: true },
    { id: 3, name: '东京', country: '日本', isFavorite: false },
    { id: 4, name: '纽约', country: '美国', isFavorite: false },
    { id: 5, name: '伦敦', country: '英国', isFavorite: false },
    { id: 6, name: '巴黎', country: '法国', isFavorite: false }
  ]);
  const [newCity, setNewCity] = useState('');
  
  // 模拟加载完成
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 添加城市
  const addCity = () => {
    if (newCity.trim() === '') return;
    
    const newCityObj = {
      id: Date.now(),
      name: newCity,
      country: '未知',
      isFavorite: false
    };
    
    setCities([...cities, newCityObj]);
    setNewCity('');
  };
  
  // 切换收藏状态
  const toggleFavorite = (id) => {
    setCities(cities.map(city => 
      city.id === id ? { ...city, isFavorite: !city.isFavorite } : city
    ));
  };
  
  // 删除城市
  const removeCity = (id) => {
    setCities(cities.filter(city => city.id !== id));
  };
  
  // 组件进入动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
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
      className="cities-page"
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
    >
      <motion.div 
        className="liquid-glass liquid-card mb-6"
        variants={itemVariants}
      >
        <div className="liquid-card-header">
          <h2 className="text-2xl font-bold text-white/90">{t('manageCities')}</h2>
        </div>
        <div className="liquid-card-content">
          <p className="text-white/80 mb-4">
            {t('citiesDescription')}
          </p>
          
          <div className="add-city-form flex items-center mb-4">
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder={t('enterCityName')}
              className="liquid-glass p-3 rounded-l-xl flex-grow text-white bg-transparent border-0 outline-none"
            />
            <motion.button
              className="liquid-button p-3 rounded-r-xl"
              onClick={addCity}
              whileTap={{ scale: 0.95 }}
            >
              {t('addCity')}
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      <div className="cities-list space-y-3">
        {cities.map((city, index) => (
          <motion.div 
            key={city.id} 
            className="liquid-glass p-4 rounded-xl flex items-center justify-between"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              transition: { duration: 0.2 }
            }}
          >
            <div className="city-info">
              <div className="text-white font-medium">{city.name}</div>
              <div className="text-white/70 text-sm">{city.country}</div>
            </div>
            
            <div className="city-actions flex items-center space-x-3">
              <motion.button
                className="favorite-btn"
                onClick={() => toggleFavorite(city.id)}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-xl">
                  {city.isFavorite ? '⭐' : '☆'}
                </span>
              </motion.button>
              
              <motion.button
                className="delete-btn text-white/70 hover:text-white/100"
                onClick={() => removeCity(city.id)}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-xl">🗑️</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <style jsx>{`
        .cities-page {
          padding-bottom: 30px;
        }
        
        .add-city-form input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .favorite-btn, .delete-btn {
          transition: all 0.2s ease;
        }
      `}</style>
    </motion.div>
  );
};

export default CitiesPage;
