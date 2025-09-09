import React, { Component } from "react";
import { Link } from "react-router-dom";
import NewsItems from './NewsItems';
import "./HomePage.css";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featuredNews: [],
      loading: true,
      stats: {
        totalArticles: '10K+',
        categories: '8',
        users: '1K+',
        bookmarks: '50K+'
      }
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch('/api/news/top?category=general&pageSize=3&country=in');
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles) {
          this.setState({ 
            featuredNews: data.articles.slice(0, 3),
            loading: false 
          });
          return;
        }
      }
      
      // If API fails or backend is not running, use fallback data
      this.loadFallbackNews();
      
    } catch (error) {
      console.error('Failed to load featured news:', error);
      // Use fallback data when backend is not running
      this.loadFallbackNews();
    }
  }
  
  loadFallbackNews = () => {
    const fallbackNews = [
      {
        title: "Welcome to NewsBoard - Your Intelligent News Platform",
        description: "Stay informed with the latest news, trending topics, and personalized feeds. Browse our shop for developer tools and premium products.",
        urlToImage: "https://picsum.photos/400/200?random=news1",
        url: "#",
        author: "NewsBoard Team",
        publishedAt: new Date().toISOString()
      },
      {
        title: "Technology Trends in 2024 - AI, Web Development, and Innovation",
        description: "Explore the latest trends in technology including artificial intelligence, modern web development frameworks, and innovative solutions.",
        urlToImage: "https://picsum.photos/400/200?random=news2",
        url: "#",
        author: "Tech Reporter",
        publishedAt: new Date().toISOString()
      },
      {
        title: "Global Business Updates - Markets, Economy, and Growth",
        description: "Get insights into global business trends, market updates, economic indicators, and growth opportunities worldwide.",
        urlToImage: "https://picsum.photos/400/200?random=news3",
        url: "#",
        author: "Business Analyst",
        publishedAt: new Date().toISOString()
      }
    ];
    
    this.setState({ 
      featuredNews: fallbackNews,
      loading: false 
    });
  }

  render() {
    const { featuredNews, loading, stats } = this.state;
    
    const categories = [
      {name: 'Business', icon: '💼', path: '/business', bgColor: '#3b82f6', bgColorLight: '#60a5fa'},
      {name: 'Technology', icon: '💻', path: '/technology', bgColor: '#10b981', bgColorLight: '#34d399'},
      {name: 'Health', icon: '🏥', path: '/health', bgColor: '#f59e0b', bgColorLight: '#fbbf24'},
      {name: 'Entertainment', icon: '🎬', path: '/entertainment', bgColor: '#ec4899', bgColorLight: '#f472b6'},
      {name: 'Sports', icon: '⚽', path: '/NewsMonkey', bgColor: '#8b5cf6', bgColorLight: '#a78bfa'},
      {name: 'Science', icon: '🔬', path: '/science', bgColor: '#06b6d4', bgColorLight: '#22d3ee'}
    ];
    
    return (
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-particles"></div>
            <div className="hero-gradient-overlay"></div>
          </div>
          <div className="container">
            <div className="hero-content animate-fade-in-up">
              <div className="hero-badge animate-bounce-in animate-delay-1">
                <span className="badge-icon">⚡</span>
                <span className="badge-text">Welcome to the Future of News</span>
              </div>
              
              <h1 className="hero-title text-gradient animate-fade-in-down animate-delay-2">
                <span className="title-icon animate-float">🗞️</span>
                <span className="title-main">NewsBoard</span>
                <span className="title-subtitle">by MD Shakib</span>
              </h1>
              
              <p className="hero-subtitle animate-fade-in-up animate-delay-3">
                Experience the next generation of news consumption with our intelligent platform featuring 
                <span className="highlight">AI-powered insights</span>, 
                <span className="highlight">smart bookmarking</span>, and 
                <span className="highlight">personalized feeds</span>. 
                Stay ahead with real-time updates from around the globe.
              </p>
              
              <div className="hero-features animate-fade-in-up animate-delay-4">
                <div className="feature-item hover-lift">
                  <span className="feature-icon">🚀</span>
                  <span className="feature-text">Real-time Updates</span>
                </div>
                <div className="feature-item hover-lift">
                  <span className="feature-icon">🎯</span>
                  <span className="feature-text">Personalized Feed</span>
                </div>
                <div className="feature-item hover-lift">
                  <span className="feature-icon">🛍️</span>
                  <span className="feature-text">Premium Shop</span>
                </div>
              </div>
              
              <div className="cta-buttons animate-slide-in-up animate-delay-5">
                <Link to="/trending" className="cta-btn cta-btn-primary btn-animated hover-glow">
                  <span className="btn-icon">🔥</span>
                  <span className="btn-text">Explore Trending</span>
                  <span className="btn-arrow">→</span>
                </Link>
                <Link to="/shop" className="cta-btn cta-btn-secondary btn-animated hover-lift">
                  <span className="btn-icon">🛍️</span>
                  <span className="btn-text">Visit Shop</span>
                  <span className="btn-arrow">→</span>
                </Link>
                <Link to="/NewsMonkey" className="cta-btn cta-btn-outline btn-animated">
                  <span className="btn-icon">📰</span>
                  <span className="btn-text">Read News</span>
                </Link>
              </div>
              
              <div className="hero-scroll-indicator animate-bounce-in animate-delay-6">
                <span className="scroll-text">Scroll to explore</span>
                <span className="scroll-arrow animate-float">↓</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section fade-in">
          <div className="container">
            <div className="text-center mb-5 scale-in">
              <h2 className="section-title">Powerful Features</h2>
              <p className="section-subtitle">Everything you need for a perfect news reading experience</p>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-6 mb-4 animate-fade-in-up animate-delay-1">
                <div className="feature-card hover-lift interactive-card card-animated">
                  <div className="feature-icon-container">
                    <span className="feature-icon animate-float">🔥</span>
                  </div>
                  <h3 className="feature-title text-gradient">Trending Topics</h3>
                  <p className="feature-description">Discover what's happening right now with AI-powered trending topic detection and real-time updates.</p>
                  <div className="feature-footer">
                    <Link to="/trending" className="feature-link btn-animated">
                      Explore Trends <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-4 animate-fade-in-up animate-delay-2">
                <div className="feature-card hover-lift interactive-card card-animated">
                  <div className="feature-icon-container">
                    <span className="feature-icon animate-float">🔍</span>
                  </div>
                  <h3 className="feature-title text-gradient">Smart Search</h3>
                  <p className="feature-description">Find exactly what you're looking for with intelligent search filters and category-based results.</p>
                  <div className="feature-footer">
                    <Link to="/search" className="feature-link btn-animated">
                      Start Searching <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-4 animate-fade-in-up animate-delay-3">
                <div className="feature-card hover-lift interactive-card card-animated">
                  <div className="feature-icon-container">
                    <span className="feature-icon animate-float">📖</span>
                  </div>
                  <h3 className="feature-title text-gradient">Smart Bookmarks</h3>
                  <p className="feature-description">Save, organize, and manage your reading list with advanced bookmark features and reading analytics.</p>
                  <div className="feature-footer">
                    <Link to="/bookmarks" className="feature-link btn-animated">
                      My Bookmarks <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-4 animate-fade-in-up animate-delay-4">
                <div className="feature-card hover-lift interactive-card card-animated">
                  <div className="feature-icon-container">
                    <span className="feature-icon animate-float">🤖</span>
                  </div>
                  <h3 className="feature-title text-gradient">AI Assistant</h3>
                  <p className="feature-description">Get personalized news recommendations and insights powered by advanced AI technology.</p>
                  <div className="feature-footer">
                    <button onClick={() => window.dispatchEvent(new CustomEvent('toggleChatBot'))} className="feature-link btn-animated">
                      Chat with AI <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section fade-in">
          <div className="container">
            <div className="row">
              <div className="col-md-3 col-6 slide-in-left">
                <div className="stat-card hover-glow">
                  <span className="stat-number pulse-animation">{stats.totalArticles}</span>
                  <span className="stat-label">Articles</span>
                </div>
              </div>
              <div className="col-md-3 col-6 fade-in-delay-1">
                <div className="stat-card hover-glow">
                  <span className="stat-number pulse-animation">{stats.categories}</span>
                  <span className="stat-label">Categories</span>
                </div>
              </div>
              <div className="col-md-3 col-6 fade-in-delay-2">
                <div className="stat-card hover-glow">
                  <span className="stat-number pulse-animation">{stats.users}</span>
                  <span className="stat-label">Active Users</span>
                </div>
              </div>
              <div className="col-md-3 col-6 slide-in-right">
                <div className="stat-card hover-glow">
                  <span className="stat-number pulse-animation">{stats.bookmarks}</span>
                  <span className="stat-label">Bookmarks</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured News Section */}
        {!loading && featuredNews.length > 0 && (
          <section className="news-preview-section fade-in">
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="section-title">📰 Today's Headlines</h2>
                <p className="section-subtitle">Stay informed with the latest breaking news and trending stories</p>
              </div>
              <div className="row justify-content-center">
                {featuredNews.map((article, index) => (
                  <div key={index} className="col-lg-4 col-md-6 mb-4">
                    <NewsItems
                      title={article.title ? article.title.slice(0, 65) : ''}
                      des={article.description ? article.description.slice(0, 120) : ''}
                      imageUrl={article.urlToImage}
                      NewsUrl={article.url}
                      author={article.author}
                      publishedAt={article.publishedAt}
                      category="featured"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <Link to="/NewsMonkey" className="cta-btn cta-btn-primary">
                  View All News →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section className="features-section fade-in">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="section-title">🗂️ Browse Categories</h2>
              <p className="section-subtitle">Explore news by your interests and discover new topics</p>
            </div>
            <div className="categories-grid">
              {categories.map((category, index) => (
                <Link 
                  key={index} 
                  to={category.path} 
                  className={`category-card hover-lift interactive-card fade-in-delay-${index + 1}`}
                  style={{
                    '--bg-color': category.bgColor,
                    '--bg-color-light': category.bgColorLight,
                    animationDelay: `${(index + 1) * 0.1}s`
                  }}
                >
                  <span className="category-icon pulse-animation">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{background: '#2d3748', color: '#fff', padding: '40px 0', textAlign: 'center'}}>
          <div className="container">
            <div className="row">
              <div className="col-md-8 mx-auto">
                <h5 style={{marginBottom: '1rem', fontWeight: '600'}}>NewsBoard</h5>
                <p style={{opacity: 0.8, marginBottom: '1.5rem'}}>Your intelligent news companion for staying informed in the digital age.</p>
                <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem'}}>
                  <Link to="/about" style={{color: '#a0aec0', textDecoration: 'none'}}>About</Link>
                  <Link to="/contact" style={{color: '#a0aec0', textDecoration: 'none'}}>Contact</Link>
                  <Link to="/privacy" style={{color: '#a0aec0', textDecoration: 'none'}}>Privacy</Link>
                  <Link to="/terms" style={{color: '#a0aec0', textDecoration: 'none'}}>Terms</Link>
                </div>
                <p style={{opacity: 0.6, fontSize: '0.9rem'}}>
                  &copy; {new Date().getFullYear()} NewsBoard. Built with ❤️ for news enthusiasts.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
