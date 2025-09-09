import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  const [darkMode, setDarkMode] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('creatorPhoto') || null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setProfilePhoto(imageDataUrl);
        localStorage.setItem('creatorPhoto', imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    document.getElementById('profile-photo-upload').click();
  };


  const pageStyle = {
    backgroundColor: darkMode ? '#1a202c' : '#ffffff',
    color: darkMode ? '#e2e8f0' : '#2d3748',
    minHeight: '100vh',
    paddingTop: '100px',
    fontFamily: 'Poppins, sans-serif'
  };

  const cardStyle = {
    backgroundColor: darkMode ? '#2d3748' : '#ffffff',
    color: darkMode ? '#e2e8f0' : '#2d3748',
    border: `1px solid ${darkMode ? '#4a5568' : '#e2e8f0'}`,
    borderRadius: '16px',
    boxShadow: darkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)'
  };

  const features = [
    {
      icon: '🔥',
      title: 'Real-Time News',
      description: 'Get breaking news and trending stories as they happen with our live news feed powered by multiple trusted sources.'
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Advanced search capabilities with filters by category, date, relevance, and source to find exactly what you\'re looking for.'
    },
    {
      icon: '📚',
      title: 'Personal Library',
      description: 'Save articles to your personal library, organize them by categories, and track your reading progress with analytics.'
    },
    {
      icon: '📊',
      title: 'Reading Analytics',
      description: 'Get insights into your reading habits, discover your interests, and see personalized recommendations.'
    },
    {
      icon: '🌐',
      title: 'Global Coverage',
      description: 'Access news from around the world with support for multiple countries and languages, all in one place.'
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your data is secure with us. We use industry-standard encryption and never share your personal information.'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Articles Served', value: '1M+' },
    { label: 'News Sources', value: '500+' },
    { label: 'Countries', value: '195' }
  ];

  return (
    <div style={pageStyle}>
      {/* Hero Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div style={{ padding: '2rem 0' }}>
                <h1 style={{ 
                  fontSize: '3.5rem', 
                  fontWeight: '700', 
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  About NewsBoard
                </h1>
                <p style={{ fontSize: '1.3rem', lineHeight: '1.8', marginBottom: '2rem', opacity: 0.8 }}>
                  Your intelligent news companion for staying informed in the digital age. We combine cutting-edge technology with intuitive design to deliver personalized news experiences.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link to="/NewsMonkey" className="btn btn-primary btn-lg" style={{ 
                    borderRadius: '50px',
                    padding: '12px 30px',
                    background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
                    border: 'none',
                    fontWeight: '600'
                  }}>
                    📰 Start Reading
                  </Link>
                  <Link to="/contact" className="btn btn-outline-primary btn-lg" style={{ 
                    borderRadius: '50px',
                    padding: '12px 30px',
                    fontWeight: '600'
                  }}>
                    💬 Contact Us
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
                  borderRadius: '20px',
                  padding: '3rem',
                  color: 'white',
                  boxShadow: '0 20px 40px rgba(78, 84, 200, 0.3)'
                }}>
                  <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀 Join the Revolution</h3>
                  <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Be part of the next generation of news readers who stay informed with intelligence and style.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5" style={{ backgroundColor: darkMode ? '#2d3748' : '#f7fafc' }}>
        <div className="container">
          <div className="row">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 col-6 mb-4 text-center">
                <div style={{ padding: '1.5rem' }}>
                  <h2 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '700', 
                    color: '#4e54c8',
                    marginBottom: '0.5rem'
                  }}>
                    {stat.value}
                  </h2>
                  <p style={{ fontSize: '1.1rem', opacity: 0.8, fontWeight: '500' }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>Why Choose NewsBoard?</h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>Discover the features that make us the preferred choice for news enthusiasts worldwide.</p>
          </div>
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100" style={{
                  ...cardStyle,
                  padding: '2rem',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = darkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(0,0,0,0.15)';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = darkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)';
                }}>
                  <div className="text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{feature.icon}</div>
                    <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>{feature.title}</h4>
                    <p style={{ opacity: 0.8, lineHeight: '1.6' }}>{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-5" style={{ backgroundColor: darkMode ? '#2d3748' : '#f7fafc' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>Built with Modern Technology</h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Powered by cutting-edge technologies for optimal performance and reliability.</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card" style={{ ...cardStyle, padding: '2.5rem' }}>
                <div className="row text-center">
                  <div className="col-md-4 mb-4">
                    <h5 style={{ color: '#4e54c8', fontWeight: '600', marginBottom: '1rem' }}>Frontend</h5>
                    <p>React • React Router • Bootstrap • CSS3 • Responsive Design</p>
                  </div>
                  <div className="col-md-4 mb-4">
                    <h5 style={{ color: '#10b981', fontWeight: '600', marginBottom: '1rem' }}>Backend</h5>
                    <p>Node.js • Express • MongoDB • JWT Auth • RESTful API</p>
                  </div>
                  <div className="col-md-4 mb-4">
                    <h5 style={{ color: '#f59e0b', fontWeight: '600', marginBottom: '1rem' }}>Infrastructure</h5>
                    <p>GNews API • Secure Proxy • Real-time Updates • Cloud Hosting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="py-5 creator-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="animate-fade-in" style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>Meet the Creator</h2>
            <p className="animate-fade-in" style={{ fontSize: '1.2rem', opacity: 0.8 }}>The visionary behind NewsBoard</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="creator-card animate-slide-up" style={{
                ...cardStyle,
                padding: '3rem',
                textAlign: 'center',
                background: darkMode ? 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
                border: `2px solid ${darkMode ? '#4e54c8' : '#e2e8f0'}`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div className="creator-bg-animation"></div>
                <div className="creator-photo-container" style={{
                  position: 'relative',
                  width: '150px',
                  height: '150px',
                  margin: '0 auto 2rem',
                  zIndex: 2
                }}>
                  <div className="creator-photo" style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    color: 'white',
                    boxShadow: '0 10px 30px rgba(78, 84, 200, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={handlePhotoClick}
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector('.photo-overlay').style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector('.photo-overlay').style.opacity = '0';
                  }}>
                    {profilePhoto ? (
                      <img 
                        src={profilePhoto} 
                        alt="MD Shakib" 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '50%'
                        }}
                      />
                    ) : (
                      <span>👨‍💻</span>
                    )}
                    <div className="photo-overlay" style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.5)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      color: 'white',
                      fontSize: '1rem'
                    }}>
                      <i className="fas fa-camera"></i>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    id="profile-photo-upload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </div>
                <h3 style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  marginBottom: '0.5rem',
                  background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  position: 'relative',
                  zIndex: 2
                }}>MD Shakib</h3>
                <p style={{ 
                  fontSize: '1.1rem', 
                  color: '#4e54c8', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  position: 'relative',
                  zIndex: 2
                }}>Full Stack Developer & UI/UX Designer</p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.95rem',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-phone" style={{ color: '#4e54c8', width: '16px' }}></i>
                    <span style={{ color: '#718096' }}>+91 9534439956</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-envelope" style={{ color: '#4e54c8', width: '16px' }}></i>
                    <span style={{ color: '#718096' }}>md.shakib@newsboard.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#4e54c8', width: '16px' }}></i>
                    <span style={{ color: '#718096' }}>Mumbai, India</span>
                  </div>
                </div>
                <p style={{ 
                  fontSize: '1rem', 
                  lineHeight: '1.8', 
                  opacity: 0.8,
                  marginBottom: '2rem',
                  position: 'relative',
                  zIndex: 2
                }}>Passionate about creating intuitive and powerful web applications. NewsBoard is crafted with love for news enthusiasts who appreciate both functionality and beautiful design. Connect with me for collaborations or technical discussions!</p>
                <div className="creator-skills" style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {['React', 'Node.js', 'MongoDB', 'Express', 'CSS3', 'JavaScript'].map((skill, index) => (
                    <span key={index} className="skill-tag animate-bounce-in" style={{
                      background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '25px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      animationDelay: `${index * 0.1}s`
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5">
        <div className="container">
          <div className="text-center">
            <div className="cta-card animate-pulse" style={{
              background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
              borderRadius: '20px',
              padding: '3rem 2rem',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="cta-bg-effect"></div>
              <h2 className="animate-fade-in" style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>Ready to Get Started?</h2>
              <p className="animate-fade-in" style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9, position: 'relative', zIndex: 2 }}>Join thousands of users who trust NewsBoard for their daily news consumption.</p>
              <div className="animate-slide-up" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
                <Link to="/signup" className="btn btn-light btn-lg glow-button" style={{
                  borderRadius: '50px',
                  padding: '12px 30px',
                  fontWeight: '600',
                  color: '#4e54c8',
                  transition: 'all 0.3s ease'
                }}>
                  🚀 Sign Up Free
                </Link>
                <Link to="/trending" className="btn btn-outline-light btn-lg glow-button" style={{
                  borderRadius: '50px',
                  padding: '12px 30px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>
                  🔥 Explore Trending
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Mode Toggle */}
      <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
        <button 
          onClick={toggleDarkMode}
          className="btn btn-primary"
          style={{
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            fontSize: '1.5rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            border: 'none',
            background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)'
          }}
          title={darkMode ? 'Enable Light Mode' : 'Enable Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  );
}
