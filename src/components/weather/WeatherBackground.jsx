import { useEffect, useRef, useState } from 'react';
import { useWeather, WeatherType } from '@/contexts/WeatherContext';
import { useTheme, TimeOfDay } from '@/contexts/ThemeContext';

export default function WeatherBackground() {
  const { currentWeather } = useWeather();
  const { timeOfDay } = useTheme();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 粒子类
  class Particle {
    constructor(canvas, type, timeOfDay) {
      this.canvas = canvas;
      this.type = type;
      this.timeOfDay = timeOfDay;
      this.reset();
    }

    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = -10;
      this.size = this.getSize();
      this.speed = this.getSpeed();
      this.opacity = Math.random() * 0.8 + 0.2;
      this.angle = Math.random() * Math.PI * 2;
      this.drift = (Math.random() - 0.5) * 2;
    }

    getSize() {
      switch (this.type) {
        case 'rain':
          return Math.random() * 2 + 1;
        case 'snow':
          return Math.random() * 4 + 2;
        case 'stars':
          return Math.random() * 2 + 0.5;
        case 'clouds':
          return Math.random() * 60 + 40;
        default:
          return 2;
      }
    }

    getSpeed() {
      switch (this.type) {
        case 'rain':
          return Math.random() * 8 + 12;
        case 'snow':
          return Math.random() * 2 + 1;
        case 'stars':
          return 0;
        case 'clouds':
          return Math.random() * 0.5 + 0.2;
        default:
          return 2;
      }
    }

    update() {
      switch (this.type) {
        case 'rain':
          this.y += this.speed;
          this.x += this.drift;
          break;
        case 'snow':
          this.y += this.speed;
          this.x += Math.sin(this.angle) * 0.5;
          this.angle += 0.02;
          break;
        case 'stars':
          this.opacity = Math.sin(Date.now() * 0.001 + this.angle) * 0.3 + 0.7;
          break;
        case 'clouds':
          this.x += this.speed;
          if (this.x > this.canvas.width + this.size) {
            this.x = -this.size;
          }
          break;
      }

      if (this.y > this.canvas.height + 10) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;

      switch (this.type) {
        case 'rain':
          this.drawRain(ctx);
          break;
        case 'snow':
          this.drawSnow(ctx);
          break;
        case 'stars':
          this.drawStar(ctx);
          break;
        case 'clouds':
          this.drawCloud(ctx);
          break;
      }

      ctx.restore();
    }

    drawRain(ctx) {
      const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + 10);
      gradient.addColorStop(0, 'rgba(174, 194, 224, 0.8)');
      gradient.addColorStop(1, 'rgba(174, 194, 224, 0.2)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = this.size;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.drift, this.y + 10);
      ctx.stroke();
    }

    drawSnow(ctx) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();

      // 雪花形状
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x1 = this.x + Math.cos(angle) * this.size;
        const y1 = this.y + Math.sin(angle) * this.size;
        const x2 = this.x - Math.cos(angle) * this.size;
        const y2 = this.y - Math.sin(angle) * this.size;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    drawStar(ctx) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();

      // 星光效果
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(this.x - this.size * 2, this.y);
      ctx.lineTo(this.x + this.size * 2, this.y);
      ctx.moveTo(this.x, this.y - this.size * 2);
      ctx.lineTo(this.x, this.y + this.size * 2);
      ctx.stroke();
    }

    drawCloud(ctx) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.3})`;
      
      // 绘制云朵形状
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
      ctx.arc(this.x + this.size * 0.4, this.y, this.size * 0.8, 0, Math.PI * 2);
      ctx.arc(this.x + this.size * 0.8, this.y, this.size * 0.6, 0, Math.PI * 2);
      ctx.arc(this.x - this.size * 0.4, this.y, this.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 获取粒子类型
  const getParticleType = () => {
    if (!currentWeather) return 'stars';

    switch (currentWeather.weatherType) {
      case WeatherType.RAIN:
      case WeatherType.HEAVY_RAIN:
      case WeatherType.THUNDERSTORM:
        return 'rain';
      case WeatherType.SNOW:
        return 'snow';
      case WeatherType.CLOUDY:
      case WeatherType.OVERCAST:
        return 'clouds';
      default:
        return timeOfDay === TimeOfDay.NIGHT ? 'stars' : 'clouds';
    }
  };

  // 获取粒子数量
  const getParticleCount = () => {
    if (!currentWeather) return 50;

    switch (currentWeather.weatherType) {
      case WeatherType.HEAVY_RAIN:
      case WeatherType.THUNDERSTORM:
        return 200;
      case WeatherType.RAIN:
        return 100;
      case WeatherType.SNOW:
        return 80;
      case WeatherType.CLOUDY:
      case WeatherType.OVERCAST:
        return 20;
      default:
        return timeOfDay === TimeOfDay.NIGHT ? 100 : 30;
    }
  };

  // 初始化粒子
  const initParticles = (canvas) => {
    const particleType = getParticleType();
    const particleCount = getParticleCount();
    
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle(canvas, particleType, timeOfDay));
    }
  };

  // 动画循环
  const animate = (canvas, ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    
    switch (timeOfDay) {
      case TimeOfDay.MORNING:
        gradient.addColorStop(0, 'rgba(135, 206, 235, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 228, 181, 0.1)');
        break;
      case TimeOfDay.NOON:
        gradient.addColorStop(0, 'rgba(30, 144, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(135, 206, 250, 0.1)');
        break;
      case TimeOfDay.AFTERNOON:
        gradient.addColorStop(0, 'rgba(255, 127, 80, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0.1)');
        break;
      case TimeOfDay.EVENING:
        gradient.addColorStop(0, 'rgba(255, 99, 71, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 140, 0, 0.1)');
        break;
      case TimeOfDay.NIGHT:
        gradient.addColorStop(0, 'rgba(25, 25, 112, 0.2)');
        gradient.addColorStop(1, 'rgba(72, 61, 139, 0.2)');
        break;
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制粒子
    particlesRef.current.forEach(particle => {
      particle.update();
      particle.draw(ctx);
    });

    // 雷电效果
    if (currentWeather?.weatherType === WeatherType.THUNDERSTORM && Math.random() < 0.001) {
      drawLightning(ctx, canvas);
    }

    animationRef.current = requestAnimationFrame(() => animate(canvas, ctx));
  };

  // 绘制闪电
  const drawLightning = (ctx, canvas) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 10;

    const startX = Math.random() * canvas.width;
    let currentX = startX;
    let currentY = 0;

    ctx.beginPath();
    ctx.moveTo(currentX, currentY);

    while (currentY < canvas.height) {
      currentY += Math.random() * 50 + 20;
      currentX += (Math.random() - 0.5) * 100;
      ctx.lineTo(currentX, currentY);
    }

    ctx.stroke();
    ctx.restore();

    // 闪电消失
    setTimeout(() => {
      // 闪电效果会在下一帧自动消失
    }, 100);
  };

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 初始化画布和动画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    initParticles(canvas);
    animate(canvas, ctx);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, currentWeather, timeOfDay]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        width: '100%',
        height: '100%'
      }}
    />
  );
}

