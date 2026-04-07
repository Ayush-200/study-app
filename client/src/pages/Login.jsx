import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { login, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme === 'light' 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background circles */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: theme === 'light' 
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(99, 102, 241, 0.1)',
        top: '-100px',
        left: '-100px',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: theme === 'light' 
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(99, 102, 241, 0.1)',
        bottom: '-150px',
        right: '-150px',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <button 
        className="theme-toggle" 
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px'
        }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div style={{
        maxWidth: '450px',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="card" style={{
          background: theme === 'light' 
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          padding: '40px',
          animation: 'slideUp 0.5s ease-out'
        }}>
          {/* Logo/Icon */}
          <div style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              📚
            </div>
            <h1 style={{ 
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Study Together
            </h1>
            <p style={{ opacity: 0.7, fontSize: '14px' }}>
              Track your progress, study with friends
            </p>
          </div>

          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            background: theme === 'light' ? '#f3f4f6' : '#0f0f0f',
            padding: '4px',
            borderRadius: '12px'
          }}>
            <button
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                background: isLogin 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: isLogin ? 'white' : 'inherit',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '14px'
              }}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                background: !isLogin 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: !isLogin ? 'white' : 'inherit',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '14px'
              }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Username
                </label>
                <input
                  className="input"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    margin: 0,
                    transition: 'all 0.3s'
                  }}
                />
              </div>
            )}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Email
              </label>
              <input
                className="input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  margin: 0,
                  transition: 'all 0.3s'
                }}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Password
              </label>
              <input
                className="input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  margin: 0,
                  transition: 'all 0.3s'
                }}
              />
            </div>
            <button 
              className="btn" 
              type="submit" 
              style={{ 
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
              }}
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Features */}
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: `1px solid ${theme === 'light' ? '#e5e7eb' : '#2a2a2a'}`
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '16px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>⏱️</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>Track Time</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>👥</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>Study Together</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>📊</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>View Stats</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .input:focus {
          outline: none;
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
      `}</style>
    </div>
  );
}

export default Login;
