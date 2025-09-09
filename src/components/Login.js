import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

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
  const navigate = useNavigate();
  const { login } = useAuth();

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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome Back! 🚀</h1>
          <p className="login-subtitle">Sign in to access your personalized news dashboard</p>
        </div>

        {/* Features Preview */}
        <div className="features-preview">
          <h4>What you'll get:</h4>
          <ul className="features-list">
            <li>Personalized news feed</li>
            <li>Smart bookmarking</li>
            <li>Reading analytics</li>
            <li>Trending insights</li>
          </ul>
        </div>

        {/* Google Login */}
        <button 
          type="button" 
          className="btn-modern btn-google"
          onClick={handleGoogleLogin}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="divider">or continue with email</div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="alert alert-danger" style={{ borderRadius: '12px', marginBottom: '1rem' }}>
              {errors.submit}
            </div>
          )}
          
          <div className="form-group">
            <div className="input-icon">📬</div>
            <input
              type="email"
              className={`form-control-modern ${errors.email ? 'border-danger' : ''}`}
              id="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={onChange}
              required
              autoComplete="email"
            />
            {errors.email && <div className="text-danger mt-1" style={{ fontSize: '0.9rem' }}>{errors.email}</div>}
          </div>

          <div className="form-group">
            <div className="input-icon">🔒</div>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`form-control-modern ${errors.password ? 'border-danger' : ''}`}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={onChange}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#a0aec0',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
            {errors.password && <div className="text-danger mt-1" style={{ fontSize: '0.9rem' }}>{errors.password}</div>}
          </div>

          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={credentials.rememberMe}
              onChange={onChange}
            />
            <label htmlFor="rememberMe" style={{ fontSize: '0.9rem', color: '#718096' }}>
              Remember me for 30 days
            </label>
          </div>

          <button 
            type="submit" 
            className="btn-modern btn-primary-modern"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Signing in...
              </>
            ) : (
              'Sign In →'
            )}
          </button>
        </form>

        <div className="forgot-password">
          <button 
            type="button" 
            onClick={handleForgotPassword}
            style={{ background: 'none', border: 'none', color: '#4e54c8', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Forgot your password?
          </button>
        </div>

        <div className="signup-link">
          Don't have an account? <Link to="/signup">Create one for free →</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
