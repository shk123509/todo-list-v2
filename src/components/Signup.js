import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './SignupEnhanced.css';

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

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
    <div className="signup-3d-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        
        {/* Floating geometric shapes */}
        <div className="geometric-shape shape-1">
          <div className="shape-inner"></div>
        </div>
        <div className="geometric-shape shape-2">
          <div className="shape-inner"></div>
        </div>
        <div className="geometric-shape shape-3">
          <div className="shape-inner"></div>
        </div>
        
        {/* Particle field */}
        <div className="particle-container">
          {[...Array(60)].map((_, i) => (
            <div 
              key={i} 
              className="particle-star" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${20 + Math.random() * 20}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* 3D Signup Card */}
      <div className="signup-3d-card" style={{
        transform: `perspective(1000px) rotateY(${mousePosition.x * 0.3}deg) rotateX(${-mousePosition.y * 0.3}deg)`
      }}>
        <div className="card-glow-effect"></div>
        <div className="card-content">
          
          {/* Header Section */}
          <div className="signup-header-3d">
            <div className="logo-container-3d">
              <div className="logo-3d-effect">
                <span className="logo-main">NewsBoard</span>
                <span className="logo-tagline">Create Your Account</span>
              </div>
            </div>
            
            <div className="welcome-text-3d">
              <h1 className="title-3d">
                <span className="gradient-text-animated">Join Us Today</span>
                <span className="emoji-float">🎨</span>
              </h1>
              <p className="subtitle-3d">Start your journey with personalized news</p>
            </div>

            {/* Progress Steps */}
            <div className="progress-steps">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <span className="step-number">1</span>
                <span className="step-label">Account</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">Security</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <span className="step-number">3</span>
                <span className="step-label">Complete</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="signup-form-3d">
            {errors.submit && (
              <div className="error-alert-3d">
                <span className="error-icon">⚠️</span>
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Name & Email Section */}
            <div className="form-section-3d">
              {/* Name Input */}
              <div className="input-group-3d">
                <div className="input-wrapper-3d">
                  <div className="input-icon-3d">
                    <span>👤</span>
                  </div>
                  <input
                    type="text"
                    className={`input-field-3d ${errors.name ? 'error' : ''} ${cre.name ? 'filled' : ''}`}
                    id="name"
                    name="name"
                    placeholder=" "
                    value={cre.name}
                    onChange={onChange}
                    required
                    autoComplete="name"
                  />
                  <label className="input-label-3d" htmlFor="name">Full Name</label>
                  <div className="input-underline-3d"></div>
                </div>
                {errors.name && <div className="error-text-3d">{errors.name}</div>}
              </div>

              {/* Email Input */}
              <div className="input-group-3d">
                <div className="input-wrapper-3d">
                  <div className="input-icon-3d">
                    <span>📧</span>
                  </div>
                  <input
                    type="email"
                    className={`input-field-3d ${errors.email ? 'error' : ''} ${cre.email ? 'filled' : ''}`}
                    id="email"
                    name="email"
                    placeholder=" "
                    value={cre.email}
                    onChange={onChange}
                    required
                    autoComplete="email"
                  />
                  <label className="input-label-3d" htmlFor="email">Email Address</label>
                  <div className="input-underline-3d"></div>
                </div>
                {errors.email && <div className="error-text-3d">{errors.email}</div>}
              </div>
            </div>

            {/* Password Section */}
            <div className="form-section-3d">
              {/* Password Input */}
              <div className="input-group-3d">
                <div className="input-wrapper-3d">
                  <div className="input-icon-3d">
                    <span>🔐</span>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`input-field-3d ${errors.password ? 'error' : ''} ${cre.password ? 'filled' : ''}`}
                    id="password"
                    name="password"
                    placeholder=" "
                    value={cre.password}
                    onChange={onChange}
                    required
                    autoComplete="new-password"
                  />
                  <label className="input-label-3d" htmlFor="password">Password</label>
                  <button
                    type="button"
                    className="toggle-password-3d"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <div className="input-underline-3d"></div>
                </div>
                {errors.password && <div className="error-text-3d">{errors.password}</div>}
              </div>

              {/* Confirm Password Input */}
              <div className="input-group-3d">
                <div className="input-wrapper-3d">
                  <div className="input-icon-3d">
                    <span>🔒</span>
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`input-field-3d ${errors.cpassword ? 'error' : ''} ${cre.cpassword ? 'filled' : ''}`}
                    id="cpassword"
                    name="cpassword"
                    placeholder=" "
                    value={cre.cpassword}
                    onChange={onChange}
                    required
                    autoComplete="new-password"
                  />
                  <label className="input-label-3d" htmlFor="cpassword">Confirm Password</label>
                  <button
                    type="button"
                    className="toggle-password-3d"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <div className="input-underline-3d"></div>
                </div>
                {errors.cpassword && <div className="error-text-3d">{errors.cpassword}</div>}
              </div>
            </div>

            {/* Password Strength Indicator */}
            {cre.password && (
              <div className="password-strength-3d">
                <div className="strength-label">Password Strength:</div>
                <div className="strength-bars">
                  <div className={`bar ${cre.password.length >= 6 ? 'active' : ''}`}></div>
                  <div className={`bar ${cre.password.length >= 8 ? 'active' : ''}`}></div>
                  <div className={`bar ${cre.password.length >= 10 && /[A-Z]/.test(cre.password) ? 'active' : ''}`}></div>
                  <div className={`bar ${cre.password.length >= 12 && /[0-9]/.test(cre.password) && /[!@#$%^&*]/.test(cre.password) ? 'active' : ''}`}></div>
                </div>
                <div className="strength-text">
                  {cre.password.length < 6 ? 'Weak' :
                   cre.password.length < 8 ? 'Fair' :
                   cre.password.length < 10 ? 'Good' : 'Strong'}
                </div>
              </div>
            )}

            {/* Terms Checkbox */}
            <div className="terms-section-3d">
              <input
                type="checkbox"
                id="terms"
                className="checkbox-3d"
                required
              />
              <label htmlFor="terms" className="checkbox-label-3d">
                <span className="checkbox-box-3d"></span>
                I agree to the <a href="#" className="link-3d">Terms of Service</a> and <a href="#" className="link-3d">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="submit-btn-3d"
              disabled={isLoading}
            >
              <div className="btn-content-3d">
                {isLoading ? (
                  <>
                    <div className="loading-spinner-3d">
                      <div></div><div></div><div></div>
                    </div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </div>
              <div className="btn-shadow-3d"></div>
            </button>
          </form>

          {/* Social Signup */}
          <div className="social-signup-3d">
            <div className="divider-with-text">
              <span>Or sign up with</span>
            </div>
            
            <div className="social-buttons-3d">
              <button className="social-btn-3d google">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              
              <button className="social-btn-3d github">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
              
              <button className="social-btn-3d linkedin">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="signup-footer-3d">
            <p>
              Already have an account?
              <Link to="/login" className="login-link-3d">
                Sign In
                <span className="link-arrow-3d">→</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
