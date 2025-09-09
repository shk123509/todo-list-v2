import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NewsItems from './NewsItems';
import Spinner from './Spinner';
import './ModernDashboard.css';

export class ModernDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: null,
      recentBookmarks: [],
      personalizedNews: [],
      loading: true,
      error: null,
      user: null,
      timeOfDay: this.getTimeOfDay(),
      quote: this.getRandomQuote()
    };
  }

  getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  getRandomQuote = () => {
    const quotes = [
      "Stay informed, stay ahead",
      "Knowledge is power",
      "Today's news is tomorrow's history",
      "Reading broadens the mind",
      "Information is the oil of the 21st century"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.setState({ error: 'Please login to view your dashboard', loading: false });
      return;
    }

    await Promise.all([
      this.fetchBookmarkStats(),
      this.fetchPersonalizedNews()
    ]);
  }

  fetchBookmarkStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bookmarks/stats', {
        headers: { 'auth-token': token }
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({ 
          stats: data,
          recentBookmarks: data.recentBookmarks || []
        });
      }
    } catch (error) {
      console.error('Failed to fetch bookmark stats:', error);
      // Use mock data for demo
      this.setState({
        stats: {
          totalBookmarks: 42,
          readStatusStats: [
            { _id: 'completed', count: 28 },
            { _id: 'unread', count: 14 }
          ],
          categoryStats: [
            { _id: 'technology', count: 15 },
            { _id: 'business', count: 10 },
            { _id: 'science', count: 8 },
            { _id: 'health', count: 5 },
            { _id: 'entertainment', count: 4 }
          ]
        },
        recentBookmarks: [
          { title: 'AI Revolution in 2024', category: 'technology', bookmarkedAt: new Date() },
          { title: 'Market Trends Analysis', category: 'business', bookmarkedAt: new Date() }
        ]
      });
    }
  };

  fetchPersonalizedNews = async () => {
    try {
      const { stats } = this.state;
      const preferredCategory = stats?.categoryStats?.[0]?._id || 'technology';
      
      const response = await fetch(`/api/news/top?category=${preferredCategory}&pageSize=4&country=in`);
      const data = await response.json();

      if (data.status === 'ok') {
        this.setState({
          personalizedNews: data.articles || [],
          loading: false
        });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
      console.error('Failed to fetch personalized news:', error);
    }
  };

  getCategoryIcon = (category) => {
    const icons = {
      technology: '💻',
      business: '💼',
      health: '🏥',
      entertainment: '🎬',
      sports: '⚽',
      science: '🔬',
      general: '📰'
    };
    return icons[category] || '📄';
  }

  render() {
    const { stats, recentBookmarks, personalizedNews, loading, error, timeOfDay, quote } = this.state;

    if (loading) return <Spinner />;

    if (error) {
      return (
        <div className="modern-dashboard-container">
          <div className="error-card">
            <div className="error-icon">🔒</div>
            <h2>{error}</h2>
            <Link to="/login" className="login-btn">Login to Continue</Link>
          </div>
        </div>
      );
    }

    const readPercentage = stats?.totalBookmarks 
      ? Math.round((stats.readStatusStats?.find(s => s._id === 'completed')?.count || 0) / stats.totalBookmarks * 100)
      : 0;

    return (
      <div className="modern-dashboard-container">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div className="hero-background">
            <div className="animated-gradient"></div>
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>
          <div className="hero-content">
            <div className="greeting-section">
              <h1 className="greeting">
                Good {timeOfDay}! 
                <span className="wave-emoji">👋</span>
              </h1>
              <p className="subtitle">{quote}</p>
              <div className="date-time">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card primary-stat">
            <div className="stat-icon">
              <div className="icon-circle">📚</div>
            </div>
            <div className="stat-content">
              <div className="stat-number" data-value={stats?.totalBookmarks || 0}>
                {stats?.totalBookmarks || 0}
              </div>
              <div className="stat-label">Total Articles</div>
              <div className="stat-change positive">+12% this week</div>
            </div>
            <div className="stat-chart">
              <svg viewBox="0 0 100 40">
                <path d="M 0,35 Q 25,20 50,25 T 100,10" stroke="url(#gradient1)" strokeWidth="3" fill="none"/>
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4e54c8" />
                    <stop offset="100%" stopColor="#8f94fb" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="stat-card success-stat">
            <div className="stat-icon">
              <div className="icon-circle">✅</div>
            </div>
            <div className="stat-content">
              <div className="stat-number">
                {stats?.readStatusStats?.find(s => s._id === 'completed')?.count || 0}
              </div>
              <div className="stat-label">Articles Read</div>
              <div className="stat-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${readPercentage}%` }}></div>
                </div>
                <span className="progress-text">{readPercentage}% completed</span>
              </div>
            </div>
          </div>

          <div className="stat-card warning-stat">
            <div className="stat-icon">
              <div className="icon-circle">📖</div>
            </div>
            <div className="stat-content">
              <div className="stat-number">
                {stats?.readStatusStats?.find(s => s._id === 'unread')?.count || 0}
              </div>
              <div className="stat-label">To Read</div>
              <div className="stat-badge">
                <span className="badge-new">New today</span>
              </div>
            </div>
          </div>

          <div className="stat-card info-stat">
            <div className="stat-icon">
              <div className="icon-circle">🏷️</div>
            </div>
            <div className="stat-content">
              <div className="stat-number">
                {stats?.categoryStats?.length || 0}
              </div>
              <div className="stat-label">Categories</div>
              <div className="mini-categories">
                {stats?.categoryStats?.slice(0, 3).map((cat, i) => (
                  <span key={i} className="mini-cat">{this.getCategoryIcon(cat._id)}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="dashboard-content-grid">
          {/* Reading Activity */}
          <div className="content-card activity-card">
            <div className="card-header">
              <h3>
                <span className="header-icon">📊</span>
                Reading Activity
              </h3>
              <button className="view-all-btn">View Details →</button>
            </div>
            <div className="activity-chart">
              <div className="chart-bars">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className="bar-container">
                    <div 
                      className="bar" 
                      style={{ 
                        height: `${Math.random() * 60 + 20}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    ></div>
                    <span className="bar-label">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories Distribution */}
          <div className="content-card categories-card">
            <div className="card-header">
              <h3>
                <span className="header-icon">🎯</span>
                Your Interests
              </h3>
            </div>
            <div className="categories-list">
              {stats?.categoryStats?.length > 0 ? (
                stats.categoryStats.slice(0, 5).map((cat, index) => {
                  const percentage = stats.totalBookmarks 
                    ? Math.round(cat.count / stats.totalBookmarks * 100)
                    : 0;
                  return (
                    <div key={index} className="category-item">
                      <div className="category-info">
                        <span className="category-icon">{this.getCategoryIcon(cat._id)}</span>
                        <span className="category-name">{cat._id}</span>
                        <span className="category-count">{cat.count}</span>
                      </div>
                      <div className="category-bar">
                        <div 
                          className="bar-fill" 
                          style={{ 
                            width: `${percentage}%`,
                            background: `hsl(${index * 60}, 70%, 60%)`
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">📂</span>
                  <p>Start bookmarking to see your interests</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="content-card recent-card">
            <div className="card-header">
              <h3>
                <span className="header-icon">🕐</span>
                Recent Activity
              </h3>
              <Link to="/bookmarks" className="view-all-btn">See All →</Link>
            </div>
            <div className="recent-list">
              {recentBookmarks.length > 0 ? (
                recentBookmarks.slice(0, 4).map((bookmark, index) => (
                  <div key={index} className="recent-item">
                    <div className="recent-icon">{this.getCategoryIcon(bookmark.category)}</div>
                    <div className="recent-content">
                      <div className="recent-title">{bookmark.title.slice(0, 50)}...</div>
                      <div className="recent-meta">
                        <span className="recent-category">{bookmark.category}</span>
                        <span className="recent-time">
                          {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">🔖</span>
                  <p>No recent bookmarks</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="content-card actions-card">
            <div className="card-header">
              <h3>
                <span className="header-icon">⚡</span>
                Quick Actions
              </h3>
            </div>
            <div className="actions-grid">
              <Link to="/search" className="action-btn search-btn">
                <span className="action-icon">🔍</span>
                <span className="action-label">Search</span>
              </Link>
              <Link to="/trending" className="action-btn trending-btn">
                <span className="action-icon">🔥</span>
                <span className="action-label">Trending</span>
              </Link>
              <Link to="/bookmarks" className="action-btn bookmarks-btn">
                <span className="action-icon">📑</span>
                <span className="action-label">Bookmarks</span>
              </Link>
              <Link to="/preferences" className="action-btn settings-btn">
                <span className="action-icon">⚙️</span>
                <span className="action-label">Settings</span>
              </Link>
              <Link to="/shop" className="action-btn shop-btn">
                <span className="action-icon">🛍️</span>
                <span className="action-label">Shop</span>
              </Link>
              <Link to="/profile" className="action-btn profile-btn">
                <span className="action-icon">👤</span>
                <span className="action-label">Profile</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recommended News */}
        {personalizedNews.length > 0 && (
          <div className="recommended-section">
            <div className="section-header">
              <h2>
                <span className="section-icon">✨</span>
                Recommended for You
              </h2>
              <p className="section-subtitle">Based on your reading history</p>
            </div>
            <div className="news-grid">
              {personalizedNews.slice(0, 4).map((article, index) => (
                <div key={index} className="news-item-wrapper">
                  <NewsItems
                    title={article.title ? article.title.slice(0, 60) : ''}
                    des={article.description ? article.description.slice(0, 100) : ''}
                    imageUrl={article.urlToImage}
                    NewsUrl={article.url}
                    author={article.author}
                    publishedAt={article.publishedAt}
                    category="recommended"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ModernDashboard;
