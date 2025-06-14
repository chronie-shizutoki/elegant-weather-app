import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

// 导入上下文提供者
import { ThemeProvider } from './contexts/ThemeContext';
import { LangProvider } from './contexts/LangContext';
import { WeatherProvider } from './contexts/WeatherContext';

// 导入布局组件
import AppContainer from './components/layout/AppContainer';
import PageLayout from './components/layout/PageLayout';

// 导入页面组件
import HomePage from './pages/HomePage';
import ForecastPage from './pages/ForecastPage';
import CitiesPage from './pages/CitiesPage';
import SettingsPage from './pages/SettingsPage';

// 导入3D背景组件
import WeatherBackground from './components/weather/WeatherBackground';

// 导入样式
import './App.css';
import './styles/liquid-glass.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // 模拟加载过程
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="loading-icon">🌤️</div>
          <div className="loading-text">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ThemeProvider>
        <LangProvider>
          <WeatherProvider>
            <AppContainer>
              {/* 3D渲染层 - 使用React Three Fiber */}
              <div className="three-container">
                <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
                  <Suspense fallback={null}>
                    <WeatherBackground />
                  </Suspense>
                </Canvas>
              </div>
              
              {/* 页面内容层 */}
              <PageLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/forecast" element={<ForecastPage />} />
                  <Route path="/cities" element={<CitiesPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </PageLayout>
            </AppContainer>
          </WeatherProvider>
        </LangProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
