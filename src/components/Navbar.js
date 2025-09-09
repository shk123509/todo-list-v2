
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import weatherService from '../services/weatherService';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Load weather data
    const loadWeather = async () => {
      try {
        const weatherData = await weatherService.getCurrentWeather('Mumbai');
        setWeather(weatherData);
      } catch (error) {
        console.error('Weather loading error:', error);
      }
    };
    loadWeather();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleChatBot = () => {
    window.dispatchEvent(new CustomEvent('toggleChatBot'));
  };

  return (
    <div>
      <nav className="navbar fixed-top navbar-expand-lg" style={{
        background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        padding: '0.8rem 1rem',
        transition: 'all 0.3s ease',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" style={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexDirection: 'column',
            lineHeight: '1.2'
          }}>
            <div className="news-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>
              <span role="img" aria-label="news" style={{ fontSize: '1.8rem' }}>📰</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>NewsBoard</span>
            </div>
            <small className="creator-tag" style={{ fontSize: '0.6rem', opacity: 0.9, fontWeight: 'normal', color: 'rgba(255, 255, 255, 0.9)' }}>
              By MD Shakib
            </small>
          </Link>
          <button
            className="navbar-toggler custom-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{
              border: 'none',
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
          >
            <span className="navbar-toggler-icon" style={{filter: 'invert(1)'}}></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/" style={{
                  color: '#fff',
                  transition: 'all 0.3s ease',
                  padding: '0.5rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}>
                  🏠 Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/NewsMonkey" style={{color: '#fff', fontSize: '0.9rem', padding: '0.5rem 0.8rem'}}>
                  News
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search" style={{color: '#fff', fontSize: '0.9rem', padding: '0.5rem 0.8rem'}}>
                  🔍 Search
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/trending" style={{color: '#fff', fontSize: '0.9rem', padding: '0.5rem 0.8rem'}}>
                  🔥 Trending
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/shop" style={{color: '#fff', fontSize: '0.9rem', padding: '0.5rem 0.8rem'}}>
                  🛍️ Shop
                </Link>
              </li>
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false" style={{color: '#fff', fontSize: '0.9rem', padding: '0.5rem 0.8rem', background: 'none', border: 'none'}}>
                  Categories
                </button>
                <ul className="dropdown-menu" style={{background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)'}}>
                  <li><Link className="dropdown-item" to="/business">💼 Business</Link></li>
                  <li><Link className="dropdown-item" to="/technology">💻 Technology</Link></li>
                  <li><Link className="dropdown-item" to="/health">🏥 Health</Link></li>
                  <li><Link className="dropdown-item" to="/entertainment">🎬 Entertainment</Link></li>
                  <li><Link className="dropdown-item" to="/general">📰 General</Link></li>
                  <li><Link className="dropdown-item" to="/science">🔬 Science</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about" style={{color: '#fff', fontSize: '0.9rem', padding: '0.5rem 0.8rem'}}>
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact" style={{color: '#fff', fontSize: '0.9rem', padding: '0.5rem 0.8rem'}}>
                  📞 Contact
                </Link>
              </li>
            </ul>
            <div className="d-flex align-items-center" style={{gap: '0.5rem'}}>
              {/* Weather Widget */}
              {weather && (
                <div className="weather-btn dropdown">
                  <button 
                    className="btn weather-btn dropdown-toggle" 
                    type="button" 
                    data-bs-toggle="dropdown"
                    title={`${weather.temperature}°C in ${weather.location}`}
                  >
                    {weatherService.getWeatherEmoji(weather.condition, weather.icon)} {weather.temperature}°C
                  </button>
                  <div className="dropdown-menu dropdown-menu-end" style={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem',
                    minWidth: '250px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                  }}>
                    <div className="weather-details">
                      <h6 className="mb-2">{weatherService.getWeatherEmoji(weather.condition, weather.icon)} {weather.location}</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Temperature:</span>
                        <strong>{weather.temperature}°C</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Feels like:</span>
                        <span>{weather.feelsLike}°C</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Condition:</span>
                        <span>{weather.description}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Humidity:</span>
                        <span>{weather.humidity}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* ChatBot Toggle */}
              <button 
                className="btn weather-btn" 
                onClick={toggleChatBot}
                title="Open AI Assistant"
                style={{padding: '0.4rem 0.8rem'}}
              >
                🤖 AI
              </button>
              
              {!isAuthenticated ? (
                <>
                  <Link className="btn btn-outline-light btn-sm" to="/login" role="button" style={{
                    fontWeight: '600',
                    borderRadius: '20px',
                    padding: '0.4rem 1rem',
                    fontSize: '0.85rem',
                    border: '1px solid rgba(255,255,255,0.7)',
                    transition: 'all 0.3s ease'
                  }}>
                    Login
                  </Link>
                  <Link className="btn btn-light btn-sm" to="/signup" role="button" style={{
                    fontWeight: '600',
                    borderRadius: '20px',
                    padding: '0.4rem 1rem',
                    fontSize: '0.85rem',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    color: '#4e54c8',
                    transition: 'all 0.3s ease'
                  }}>
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="dropdown">
                    <button className="btn btn-outline-light btn-sm dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false" style={{
                      borderRadius: '20px',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.85rem',
                      border: '1px solid rgba(255,255,255,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        display: 'inline-block',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#4e54c8',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        lineHeight: '24px',
                        fontSize: '0.8rem'
                      }}>
                        {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                      {user ? user.name.split(' ')[0] : 'User'}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" style={{
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      borderRadius: '12px',
                      minWidth: '200px'
                    }}>
                      <li><Link className="dropdown-item" to="/dashboard" style={{fontSize: '0.9rem'}}>📊 Dashboard</Link></li>
                      <li><Link className="dropdown-item" to="/profile" style={{fontSize: '0.9rem'}}>👤 Profile</Link></li>
                      <li><Link className="dropdown-item" to="/bookmarks" style={{fontSize: '0.9rem'}}>📖 Bookmarks</Link></li>
                      <li><Link className="dropdown-item" to="/preferences" style={{fontSize: '0.9rem'}}>⚙️ Settings</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={handleLogout} style={{fontSize: '0.9rem'}}>
                          🚪 Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
