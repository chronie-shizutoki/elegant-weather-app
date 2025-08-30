# Elegant Weather App

A beautiful and elegant weather application featuring WWDC25-style liquid glass design, rich 3D animations, and multi-language support.

## Features

### 🎨 Liquid Glass Design
- WWDC25-style multi-layered transparent interface with dynamic light and reflection effects
- All components feature glass-like design with Gaussian blur and elegant borders
- Automatic interface style switching based on time (morning, noon, afternoon, night)
- Dynamic light effects that change with mouse movement for enhanced immersion

### ✨ Rich Animations
- Weather-related animations: rain drops, snowflakes, sunshine, and cloud effects that automatically switch based on weather conditions
- Interaction animations: smooth transitions and feedback animations for all buttons, cards, and navigation elements
- Subtle hover effects: elements change subtly when hovered, enhancing user experience
- Progress bars and indicator animations: air quality, UV index, and other data presented dynamically

### 🌍 Comprehensive Multi-language Support
- Supports 6 languages: Simplified Chinese, Traditional Chinese, English, Japanese, Korean, and French
- Elegant language switching interface with smooth transition animations
- All text is localized to ensure global users can understand

### 📱 Multi-platform Adaptation
- Responsive design, perfectly adapts to phones, tablets, and desktop devices
- Mobile devices use bottom navigation bar, desktop uses side navigation bar
- Touch-optimized interaction design for smooth operation on touch devices

### 🔄 Dark Mode Support
- Perfect dark mode support, all components have corresponding dark styles
- Can switch automatically based on system settings or time, or manually
- Maintains high contrast and readability in dark mode

## Technology Stack

- **Frontend Framework**: React with Vite
- **3D Rendering**: Three.js with React Three Fiber
- **Animation**: Framer Motion
- **Styling**: CSS with Tailwind CSS
- **Internationalization**: i18next
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/chronie-shizutoki/elegant-weather-app.git

# Navigate to the project directory
cd elegant-weather-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
elegant-weather-app/
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # React components
│   │   ├── layout/     # Layout components
│   │   ├── weather/    # Weather-related components
│   │   ├── cities/     # City management components
│   │   └── settings/   # Settings components
│   ├── contexts/       # React contexts
│   ├── pages/          # Page components
│   ├── styles/         # CSS styles
│   │   └── liquid-glass.css  # Liquid glass design framework
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point
└── package.json        # Project dependencies and scripts
```

## Key Features Implementation

### Liquid Glass Design

The application implements a custom CSS framework that creates the WWDC25-style liquid glass effect. This includes:

- Multi-layered transparency with backdrop filters
- Dynamic light reflections that follow cursor movement
- Adaptive color schemes based on time of day and weather conditions
- Subtle border highlights and shadows for depth

### 3D Weather Animations

Using Three.js and React Three Fiber, the application creates realistic 3D weather effects:

- Dynamic 3D clouds that move and change based on weather conditions
- Realistic rain and snow particle systems
- Sun and moon positioning based on actual sunrise/sunset times
- Atmospheric lighting that changes with time of day

### Responsive Navigation

The application features a responsive navigation system that adapts to different screen sizes:

- Bottom navigation bar on mobile devices
- Side navigation bar on desktop devices
- Smooth page transitions with Framer Motion
- Active state indicators with subtle animations

## License

This project is licensed under the AGPL-3.0 License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by OpenWeatherMap API
- Icons from various open-source icon libraries
- Inspired by Apple's WWDC25 design language
