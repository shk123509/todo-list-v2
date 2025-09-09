import React, { useState } from 'react';
import { LoginAlert, showAlert } from './Alert';
import './LoginWithAlert.css';

const LoginWithAlert = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear login error when user modifies form
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Show alert for validation errors
      showAlert('Please fix the errors in the form', 'warning', 4000);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Demo authentication logic
      if (formData.email === 'demo@example.com' && formData.password === 'password123') {
        // Success - show success alert
        showAlert('Login successful! Redirecting...', 'success', 3000);
        
        // Simulate redirect after success
        setTimeout(() => {
          console.log('Redirecting to dashboard...');
          // window.location.href = '/dashboard';
        }, 2000);
      } else if (formData.email === 'demo@example.com' && formData.password !== 'password123') {
        // Wrong password
        setLoginError('Wrong password');
        showAlert('Incorrect password. Please try again.', 'error', 5000);
      } else if (formData.password === 'password123') {
        // Wrong email
        setLoginError('Invalid email');
        showAlert('Email not found. Please check your email address.', 'error', 5000);
      } else {
        // Both wrong
        setLoginError('Invalid credentials');
        showAlert('Invalid email or password. Please try again.', 'error', 5000);
      }
    } catch (error) {
      // Network error
      setLoginError('Network error');
      showAlert('Network error. Please check your connection and try again.', 'error', 6000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    showAlert('Password reset link will be sent to your email', 'info', 4000);
  };

  const handleSocialLogin = (provider) => {
    showAlert(`${provider} login coming soon!`, 'info', 3000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Please sign in to your account</p>
        </div>

        {/* Custom Login Alert for inline errors */}
        <LoginAlert 
          error={loginError} 
          onClose={() => setLoginError('')}
        />

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="demo@example.com"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <button 
              type="button" 
              className="forgot-password"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <button 
            type="button" 
            className="social-btn google"
            onClick={() => handleSocialLogin('Google')}
            disabled={isLoading}
          >
            <span className="social-icon">🔴</span>
            Continue with Google
          </button>
          <button 
            type="button" 
            className="social-btn facebook"
            onClick={() => handleSocialLogin('Facebook')}
            disabled={isLoading}
          >
            <span className="social-icon">🔵</span>
            Continue with Facebook
          </button>
        </div>

        <div className="login-footer">
          <p>
            Don't have an account? 
            <button 
              type="button" 
              className="signup-link"
              onClick={() => showAlert('Signup feature coming soon!', 'info')}
            >
              Sign up
            </button>
          </p>
        </div>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials:</p>
          <p className="demo-info">Email: demo@example.com</p>
          <p className="demo-info">Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginWithAlert;
