import { useEffect, useRef, useState } from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';

const WeatherBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const { currentWeather } = useWeather();
  const { timeOfDay, isDarkMode } = useTheme();
  const [particles, setParticles] = useState([]);

  // 粒子类
  class Particle {
    constructor(canvas, type = 'rain') {
      this.canvas = canvas;
      this.type = type;
      this.reset();
    }

    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = -10;
      this.speed = this.type === 'rain' ? Math.random() * 5 + 3 : Math.random() * 2 + 1;
      this.size = this.type === 'rain' ? Math.random() * 2 + 1 : Math.random() * 4 + 2;
      this.opacity = Math.random() * 0.6 + 0.4;
      this.wind = Math.random() * 2 - 1;
      
      if (this.type === 'snow') {
        this.swayAmount = Math.random() * 2 + 1;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.swayOffset = Math.random() * Math.PI * 2;
      }
    }

    update() {
      if (this.type === 'rain') {
        this.y += this.speed;
        this.x += this.wind;
      } else if (this.type === 'snow') {
        this.y += this.speed;
        this.x += Math.sin(this.y * this.swaySpeed + this.swayOffset) * this.swayAmount;
      }

      if (this.y > this.canvas.height + 10) {
        this.reset();
      }
      if (this.x < -10 || this.x > this.canvas.width + 10) {
        this.x = Math.random() * this.canvas.width;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;

      if (this.type === 'rain') {
        // 雨滴效果
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.size * 8);
        gradient.addColorStop(0, isDarkMode ? 'rgba(147, 197, 253, 0.8)' : 'rgba(59, 130, 246, 0.6)');
        gradient.addColorStop(1, 'rgba(147, 197, 253, 0.1)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.wind * 2, this.y + this.size * 8);
        ctx.stroke();
      } else if (this.type === 'snow') {
        // 雪花效果
        ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 雪花细节
        ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x1 = this.x + Math.cos(angle) * this.size;
          const y1 = this.y + Math.sin(angle) * this.size;
          const x2 = this.x + Math.cos(angle) * this.size * 0.5;
          const y2 = this.y + Math.sin(angle) * this.size * 0.5;
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      ctx.restore();
    }
  }

  // 云朵类
  class Cloud {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height * 0.3;
      this.size = Math.random() * 60 + 40;
      this.speed = Math.random() * 0.5 + 0.2;
      this.opacity = Math.random() * 0.3 + 0.1;
    }

    update() {
      this.x += this.speed;
      if (this.x > this.canvas.width + this.size) {
        this.x = -this.size;
        this.y = Math.random() * this.canvas.height * 0.3;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = isDarkMode ? 'rgba(100, 116, 139, 0.4)' : 'rgba(255, 255, 255, 0.6)';
      
      // 绘制云朵
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
      ctx.arc(this.x + this.size * 0.3, this.y, this.size * 0.4, 0, Math.PI * 2);
      ctx.arc(this.x + this.size * 0.6, this.y, this.size * 0.3, 0, Math.PI * 2);
      ctx.arc(this.x - this.size * 0.2, this.y, this.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  }

  // 星星类
  class Star {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height * 0.6;
      this.size = Math.random() * 2 + 1;
      this.twinkleSpeed = Math.random() * 0.02 + 0.01;
      this.twinkleOffset = Math.random() * Math.PI * 2;
      this.brightness = Math.random() * 0.5 + 0.5;
    }

    update() {
      this.twinkleOffset += this.twinkleSpeed;
    }

    draw(ctx) {
      if (timeOfDay === 'night' || (timeOfDay === 'evening' && isDarkMode)) {
        ctx.save();
        const twinkle = Math.sin(this.twinkleOffset) * 0.3 + 0.7;
        ctx.globalAlpha = this.brightness * twinkle;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 星光效果
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x - this.size * 2, this.y);
        ctx.lineTo(this.x + this.size * 2, this.y);
        ctx.moveTo(this.x, this.y - this.size * 2);
        ctx.lineTo(this.x, this.y + this.size * 2);
        ctx.stroke();
        
        ctx.restore();
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 初始化粒子
    const newParticles = [];
    const clouds = [];
    const stars = [];

    // 根据天气条件创建粒子
    const weatherCondition = currentWeather?.condition || 'sunny';
    
    if (weatherCondition.includes('rain') || weatherCondition.includes('thunderstorm')) {
      const particleCount = weatherCondition.includes('heavy') ? 150 : 
                           weatherCondition.includes('moderate') ? 100 : 50;
      for (let i = 0; i < particleCount; i++) {
        newParticles.push(new Particle(canvas, 'rain'));
      }
    } else if (weatherCondition.includes('snow')) {
      for (let i = 0; i < 80; i++) {
        newParticles.push(new Particle(canvas, 'snow'));
      }
    }

    // 创建云朵
    if (weatherCondition.includes('cloudy') || weatherCondition.includes('overcast')) {
      for (let i = 0; i < 5; i++) {
        clouds.push(new Cloud(canvas));
      }
    }

    // 创建星星
    if (timeOfDay === 'night' || (timeOfDay === 'evening' && isDarkMode)) {
      for (let i = 0; i < 50; i++) {
        stars.push(new Star(canvas));
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制星星
      stars.forEach(star => {
        star.update();
        star.draw(ctx);
      });

      // 绘制云朵
      clouds.forEach(cloud => {
        cloud.update();
        cloud.draw(ctx);
      });

      // 绘制天气粒子
      newParticles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentWeather, timeOfDay, isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'transparent',
        mixBlendMode: isDarkMode ? 'screen' : 'multiply'
      }}
    />
  );
};

export default WeatherBackground;

