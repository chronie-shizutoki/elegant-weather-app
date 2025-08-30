import React from 'react';

/**
 * WebGL错误边界组件
 * 捕获WebGL和3D渲染相关的错误，防止整个应用崩溃
 */
class WeatherErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // 更新state以显示错误UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    console.error('WeatherScene Error:', error);
    console.error('Error Info:', errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // 尝试清理WebGL资源
    this.cleanupWebGLResources();
  }

  cleanupWebGLResources = () => {
    try {
      // 清理THREE.js缓存
      if (window.THREE && window.THREE.Cache) {
        window.THREE.Cache.clear();
      }

      // 强制垃圾回收
      if (window.gc) {
        window.gc();
      }

      console.log('Emergency WebGL cleanup performed');
    } catch (cleanupError) {
      console.error('Emergency cleanup failed:', cleanupError);
    }
  };

  handleRetry = () => {
    if (this.state.retryCount < 3) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: this.state.retryCount + 1
      });
    } else {
      console.error('Max retry attempts reached, staying in fallback mode');
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="weather-error-fallback">
          <div className="error-content">
            <h2>🌤️ 天气场景暂时不可用</h2>
            <p>3D渲染遇到问题，已切换到安全模式</p>
            
            {this.state.retryCount < 3 && (
              <button 
                onClick={this.handleRetry}
                className="retry-button"
              >
                重试 ({this.state.retryCount}/3)
              </button>
            )}
            
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>错误详情 (开发模式)</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
          
          <style jsx>{`
            .weather-error-fallback {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
              padding: 2rem;
            }
            
            .error-content {
              max-width: 400px;
            }
            
            .error-content h2 {
              margin-bottom: 1rem;
              font-size: 1.5rem;
            }
            
            .error-content p {
              margin-bottom: 1.5rem;
              opacity: 0.9;
            }
            
            .retry-button {
              background: rgba(255, 255, 255, 0.2);
              border: 1px solid rgba(255, 255, 255, 0.3);
              color: white;
              padding: 0.5rem 1rem;
              border-radius: 0.5rem;
              cursor: pointer;
              transition: background 0.2s;
            }
            
            .retry-button:hover {
              background: rgba(255, 255, 255, 0.3);
            }
            
            .error-details {
              margin-top: 1rem;
              text-align: left;
              background: rgba(0, 0, 0, 0.2);
              padding: 1rem;
              border-radius: 0.5rem;
              font-size: 0.8rem;
            }
            
            .error-details pre {
              white-space: pre-wrap;
              word-break: break-word;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WeatherErrorBoundary;