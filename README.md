# Elegant Weather App

A beautiful and elegant weather application inspired by Apple's WWDC25 Liquid Glass design language. This app features rich animations, multi-language support, and responsive design for all platforms.

![Elegant Weather App Screenshot](screenshots/app_preview.png)

## Features

### 🎨 Beautiful Liquid Glass UI
- **WWDC25 Inspired Design**: Featuring Apple's latest Liquid Glass design language with dynamic reflections and transparency
- **Time-Based Themes**: Automatically changes UI appearance based on time of day (morning, noon, afternoon, night)
- **Weather-Based Animations**: Dynamic animations that change based on current weather conditions
- **Fluid Interactions**: Smooth, liquid-like animations for all user interactions

### 🌦️ Comprehensive Weather Data
- Current weather conditions with temperature and "feels like" data
- Hourly forecast for the next 24 hours
- 14-day weather forecast with temperature ranges
- Detailed weather information including humidity, wind speed, visibility, and pressure
- Air quality index and UV index with visual indicators
- Sunrise and sunset times with dynamic sun position indicator

### 🌍 Multi-Language Support
- Simplified Chinese (简体中文)
- Traditional Chinese (繁體中文)
- English
- Japanese (日本語)
- Korean (한국어)
- French (Français)

### 🌓 Theme Options
- Automatic theme switching based on time of day
- Manual light/dark mode toggle
- Dynamic color adaptation based on weather conditions

### 📱 Multi-Platform Support
- Responsive design for mobile, tablet, and desktop
- Touch-optimized interface for mobile devices
- Desktop-optimized layout with sidebar navigation
- Consistent experience across all device sizes

## Technical Implementation

### Core Technologies
- **React 18**: Modern functional components with hooks
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **CSS Variables**: Dynamic theming and animation control
- **CSS Animations**: Fluid, hardware-accelerated animations
- **Context API**: State management for themes, language, and weather data

### Animation System
The app features a sophisticated animation system that includes:

- **Weather Effects**: Rain drops, snowflakes, sunshine rays, and cloud movements
- **Interactive Elements**: Dynamic hover states, click ripples, and focus indicators
- **Transition Effects**: Smooth transitions between states and pages
- **Parallax Effects**: Subtle depth effects on scrolling elements

### Liquid Glass CSS Framework
We've developed a custom CSS framework to implement the Liquid Glass design language:

- **Multi-layered Transparency**: Creating depth through varying levels of transparency
- **Dynamic Reflections**: Light reflections that respond to user interaction
- **Content-Aware Colors**: UI elements that adapt their colors based on content
- **Fluid Animations**: Elements that transform with liquid-like properties

## Getting Started

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/quiettimejsg/elegant-weather-app.git
cd elegant-weather-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready to be deployed.

## Project Structure

```
elegant-weather-app/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other assets
│   ├── components/      # React components
│   │   ├── layout/      # Layout components
│   │   ├── settings/    # Settings components
│   │   └── weather/     # Weather-related components
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── i18n/            # Internationalization files
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── styles/          # Global styles
│   │   └── liquid-glass.css  # Liquid Glass CSS framework
│   ├── themes/          # Theme definitions
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main App component
│   ├── App.css          # App-specific styles
│   ├── index.css        # Global CSS
│   └── main.jsx         # Entry point
└── package.json         # Project dependencies and scripts
```

## Design Philosophy

The Elegant Weather App is designed with the following principles in mind:

1. **Beauty in Functionality**: Weather information should be both useful and beautiful
2. **Responsive to Environment**: The app should adapt to time of day, weather conditions, and user preferences
3. **Fluid and Natural**: Interactions should feel natural and fluid, mimicking real-world physics
4. **Accessible and Inclusive**: Weather information should be accessible to everyone, regardless of language or device

## Credits

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Design inspired by Apple's WWDC25 Liquid Glass design language
- Icons from various open-source projects

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed with ❤️ by [Manus AI](https://manus.ai)
