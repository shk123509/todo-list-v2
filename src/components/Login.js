import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = (props) => {
  const setAlert = props.setAlert || (() => {});
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { login } = useAuth();

  // 3D mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Remove auto-redirect - let users stay on login page if not authenticated

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials({ 
      ...credentials, 
      [name]: type === 'checkbox' ? checked : value 
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      const result = await login(credentials.email, credentials.password);
      
      if (result.success) {
        if (credentials.rememberMe) {
          localStorage.setItem('rememberLogin', 'true');
        }
        navigate('/dashboard');
        setAlert('Welcome back! Successfully logged in.', 'success');
      } else {
        setErrors({ submit: result.error || 'Invalid email or password' });
        setAlert('Login failed. Please check your credentials.', 'danger');
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
      setAlert('Network error. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth
    const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  const handleForgotPassword = () => {
    setAlert('Password reset feature coming soon!', 'info');
  };

  return (
    <div className="login-3d-container">
      {/* Animated Background Elements */}
      <div className="animated-bg">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
        <div className="floating-cube cube-1"></div>
        <div className="floating-cube cube-2"></div>
        <div className="floating-cube cube-3"></div>
        <div className="particle-field">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* 3D Login Card */}
      <div className="login-3d-card" style={{
        transform: `perspective(1000px) rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg)`
      }}>
        <div className="card-glow"></div>
        <div className="card-inner">
          {/* Logo Section */}
          <div className="logo-3d-container">
            <div className="logo-3d">
              <span className="logo-text">NewsBoard</span>
              <div className="logo-subtitle">Your Gateway to Knowledge</div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="welcome-section">
            <h1 className="welcome-title">
              <span className="gradient-text">Welcome Back</span>
              <span className="emoji-3d">✨</span>
            </h1>
            <p className="welcome-subtitle">Enter your credentials to access your account</p>
          </div>

          {/* Social Login Buttons */}
          <div className="social-login-section">
            <button 
              type="button" 
              className="social-btn google-btn"
              onClick={handleGoogleLogin}
            >
              <div className="btn-3d-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </div>
            </button>
            
            <button type="button" className="social-btn github-btn">
              <div className="btn-3d-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>Continue with GitHub</span>
              </div>
            </button>
          </div>

          <div className="divider-3d">
            <span className="divider-text">OR</span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-3d-form">
            {errors.submit && (
              <div className="error-3d-box">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{errors.submit}</span>
              </div>
            )}
            
            {/* Email Input */}
            <div className="input-3d-group">
              <div className="input-3d-wrapper">
                <div className="input-3d-icon">
                  <span>📧</span>
                </div>
                <input
                  type="email"
                  className={`input-3d ${errors.email ? 'error' : ''} ${credentials.email ? 'filled' : ''}`}
                  id="email"
                  name="email"
                  placeholder=" "
                  value={credentials.email}
                  onChange={onChange}
                  required
                  autoComplete="email"
                />
                <label className="input-3d-label" htmlFor="email">Email Address</label>
                <div className="input-3d-highlight"></div>
              </div>
              {errors.email && <div className="error-message-3d">{errors.email}</div>}
            </div>

            {/* Password Input */}
            <div className="input-3d-group">
              <div className="input-3d-wrapper">
                <div className="input-3d-icon">
                  <span>🔐</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input-3d ${errors.password ? 'error' : ''} ${credentials.password ? 'filled' : ''}`}
                  id="password"
                  name="password"
                  placeholder=" "
                  value={credentials.password}
                  onChange={onChange}
                  required
                  autoComplete="current-password"
                />
                <label className="input-3d-label" htmlFor="password">Password</label>
                <button
                  type="button"
                  className="password-toggle-3d"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
                <div className="input-3d-highlight"></div>
              </div>
              {errors.password && <div className="error-message-3d">{errors.password}</div>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-extras-3d">
              <div className="remember-3d">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  className="checkbox-3d"
                  checked={credentials.rememberMe}
                  onChange={onChange}
                />
                <label htmlFor="rememberMe" className="checkbox-3d-label">
                  <span className="checkbox-3d-box"></span>
                  Remember me
                </label>
              </div>
              <button 
                type="button" 
                className="forgot-link-3d"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="submit-3d-btn"
              disabled={loading}
            >
              <div className="btn-3d-content">
                {loading ? (
                  <>
                    <div className="spinner-3d">
                      <div></div><div></div><div></div>
                    </div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="arrow-3d">→</span>
                  </>
                )}
              </div>
              <div className="btn-3d-shadow"></div>
            </button>
          </form>

          {/* Footer */}
          <div className="login-3d-footer">
            <p className="footer-text">
              Don't have an account? 
              <Link to="/signup" className="signup-link-3d">
                Create Account
                <span className="link-arrow">→</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
