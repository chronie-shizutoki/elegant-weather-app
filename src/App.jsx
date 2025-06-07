import { ThemeProvider } from '@/contexts/ThemeContext';
import { LangProvider } from '@/contexts/LangContext';
import { WeatherProvider } from '@/contexts/WeatherContext';
import AppContainer from '@/components/layout/AppContainer';
import WeatherBackground from '@/components/weather/WeatherBackground';
import HomePage from '@/pages/HomePage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <WeatherProvider>
          <WeatherBackground />
          <AppContainer>
            <HomePage />
          </AppContainer>
        </WeatherProvider>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;

