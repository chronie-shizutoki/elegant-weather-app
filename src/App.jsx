import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          优雅天气
        </h1>
        
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/30">
          <div className="text-center">
            <div className="text-6xl mb-4">🌤️</div>
            <div className="text-4xl font-bold text-white mb-2">26°</div>
            <div className="text-white/80 mb-4">多云</div>
            <div className="flex justify-between text-white/60 text-sm">
              <span>最高 32°</span>
              <span>最低 24°</span>
            </div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/30">
          <h3 className="text-white font-semibold mb-4">小时预报</h3>
          <div className="flex space-x-4 overflow-x-auto">
            {[
              { time: '现在', icon: '🌤️', temp: '26°' },
              { time: '17:00', icon: '☀️', temp: '27°' },
              { time: '18:00', icon: '🌅', temp: '25°' },
              { time: '19:00', icon: '🌙', temp: '24°' }
            ].map((item, index) => (
              <div key={index} className="flex-shrink-0 text-center">
                <div className="text-white/60 text-sm mb-2">{item.time}</div>
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-white font-semibold">{item.temp}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 border border-white/30">
          <h3 className="text-white font-semibold mb-4">天气详情</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '湿度', value: '65%', icon: '💧' },
              { label: '风速', value: '12 km/h', icon: '💨' },
              { label: '能见度', value: '10 km', icon: '👁️' },
              { label: '气压', value: '1013 hPa', icon: '🌡️' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-white/60 text-sm">{item.label}</div>
                <div className="text-white font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-8 mt-8">
          <button className="text-white/60 hover:text-white transition-colors">
            🏠 天气
          </button>
          <button className="text-white/60 hover:text-white transition-colors">
            📊 预报
          </button>
          <button className="text-white/60 hover:text-white transition-colors">
            🌍 城市
          </button>
          <button className="text-white/60 hover:text-white transition-colors">
            ⚙️ 设置
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

