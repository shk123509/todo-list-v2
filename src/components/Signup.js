import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Signup.css';

const Signup = (props) => {
  const setAlert = props.setAlert || (() => {});
  const [cre, setCre] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  
  const onChange = (e) => {
    setCre({ ...cre, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!cre.name.trim()) newErrors.name = 'Name is required';
    if (cre.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    
    if (!cre.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(cre.email)) newErrors.email = 'Email is invalid';
    
    if (!cre.password) newErrors.password = 'Password is required';
    if (cre.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!cre.cpassword) newErrors.cpassword = 'Please confirm your password';
    if (cre.password !== cre.cpassword) newErrors.cpassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cre.name,
          email: cre.email,
          password: cre.password,
        }),
      });

      const json = await response.json();
      
      if (json.authtoken) {
        localStorage.setItem("token", json.authtoken);
        setAlert("Account created successfully! Welcome to NewsBoard! 🎉", "success");
        navigate("/");
      } else {
        setAlert(json.error || "Failed to create account. Please try again.", "danger");
      }
    } catch (error) {
      console.error('Signup error:', error);
      setAlert("Network error. Please check your connection and try again.", "danger");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="signup-container">
      {/* Background Elements */}
      <div className="signup-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="signup-content">
        <div className="signup-card animate-slide-up">
          {/* Header */}
          <div className="signup-header animate-fade-in">
            <div className="signup-logo">
              <span className="logo-icon">🚀</span>
              <h1 className="signup-title text-gradient">Join NewsBoard</h1>
            </div>
            <p className="signup-subtitle">
              Create your account and discover the future of news consumption
            </p>
            <div className="creator-badge animate-bounce-in animate-delay-1">
              <span>✨ Created by MD Shakib</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="signup-form">
            {/* Name Field */}
            <div className="form-group animate-fade-in-up animate-delay-2">
              <label htmlFor="name" className="form-label">
                <i className="fas fa-user"></i>
                Full Name
              </label>
              <div className="input-container">
                <input
                  onChange={onChange}
                  type="text"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  id="name"
                  name="name"
                  value={cre.name}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  autoComplete="name"
                />
                <div className="input-icon">
                  <i className="fas fa-user"></i>
                </div>
              </div>
              {errors.name && <span className="error-message animate-shake">{errors.name}</span>}
            </div>

            {/* Email Field */}
            <div className="form-group animate-fade-in-up animate-delay-3">
              <label htmlFor="email" className="form-label">
                <i className="fas fa-envelope"></i>
                Email Address
              </label>
              <div className="input-container">
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  id="email"
                  onChange={onChange}
                  value={cre.email}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                  autoComplete="email"
                />
                <div className="input-icon">
                  <i className="fas fa-envelope"></i>
                </div>
              </div>
              {errors.email && <span className="error-message animate-shake">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="form-group animate-fade-in-up animate-delay-4">
              <label htmlFor="password" className="form-label">
                <i className="fas fa-lock"></i>
                Password
              </label>
              <div className="input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  id="password"
                  name="password"
                  onChange={onChange}
                  value={cre.password}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <div className="input-icon">
                  <i className="fas fa-lock"></i>
                </div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {errors.password && <span className="error-message animate-shake">{errors.password}</span>}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group animate-fade-in-up animate-delay-5">
              <label htmlFor="cpassword" className="form-label">
                <i className="fas fa-shield-alt"></i>
                Confirm Password
              </label>
              <div className="input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-input ${errors.cpassword ? 'error' : ''}`}
                  id="cpassword"
                  name="cpassword"
                  onChange={onChange}
                  value={cre.cpassword}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <div className="input-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {errors.cpassword && <span className="error-message animate-shake">{errors.cpassword}</span>}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`submit-btn btn-animated hover-glow animate-fade-in-up animate-delay-6 ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-rocket"></i>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="signup-footer animate-fade-in animate-delay-7">
            <p className="login-link">
              Already have an account? 
              <Link to="/login" className="link-primary">
                Sign in here
              </Link>
            </p>
            <div className="social-signup">
              <p className="social-text">Or continue with</p>
              <div className="social-buttons">
                <button className="social-btn google-btn hover-scale" disabled={isLoading}>
                  <i className="fab fa-google"></i>
                  Google
                </button>
                <button className="social-btn github-btn hover-scale" disabled={isLoading}>
                  <i className="fab fa-github"></i>
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
