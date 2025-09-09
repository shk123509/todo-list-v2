import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NewsItems from './NewsItems';
import Spinner from './Spinner';
import './UltraModernDashboard.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

export class UltraModernDashboard extends Component {
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
      quote: this.getRandomQuote(),
      currentTime: new Date(),
      weatherData: null,
      notifications: [
        { id: 1, text: "New article in Technology", time: "2 min ago", icon: "🔔" },
        { id: 2, text: "Your bookmark reached 100 views", time: "1 hour ago", icon: "🎯" },
        { id: 3, text: "Breaking news update", time: "3 hours ago", icon: "🚨" }
      ]
    };
  }

  componentDidMount() {
    this.loadDashboardData();
    this.startClock();
    this.loadWeatherData();
  }

  componentWillUnmount() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  startClock = () => {
    this.clockInterval = setInterval(() => {
      this.setState({ currentTime: new Date() });
    }, 1000);
  }

  loadWeatherData = async () => {
    try {
      // Use mock weather data for demo
      this.setState({
        weatherData: {
          temp: 28,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12,
          icon: '☁️'
        }
      });
    } catch (error) {
      console.error('Weather data error:', error);
    }
  }

  getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  getRandomQuote = () => {
    const quotes = [
      "📈 Stay informed, stay ahead in the digital age",
      "🎯 Knowledge is the new currency of success",
      "🚀 Today's news shapes tomorrow's decisions",
      "💡 Information empowers transformation",
      "🌟 Be the first to know, the first to grow"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  async loadDashboardData() {
    // Set demo data for stats
    this.setState({
      stats: {
        totalBookmarks: 156,
        articlesRead: 89,
        savedThisWeek: 23,
        trending: 45,
        readStatusStats: [
          { _id: 'completed', count: 89 },
          { _id: 'unread', count: 67 }
        ],
        categoryStats: [
          { _id: 'technology', count: 45 },
          { _id: 'business', count: 38 },
          { _id: 'science', count: 29 },
          { _id: 'health', count: 24 },
          { _id: 'entertainment', count: 20 }
        ]
      },
      recentBookmarks: [
        { 
          title: 'AI Revolution: GPT-5 Changes Everything', 
          category: 'technology', 
          bookmarkedAt: new Date(),
          image: 'https://via.placeholder.com/100x100/4F46E5/ffffff?text=AI'
        },
        { 
          title: 'Stock Market Hits Record High', 
          category: 'business', 
          bookmarkedAt: new Date(),
          image: 'https://via.placeholder.com/100x100/10B981/ffffff?text=$'
        },
        { 
          title: 'SpaceX Mars Mission Update', 
          category: 'science', 
          bookmarkedAt: new Date(),
          image: 'https://via.placeholder.com/100x100/F59E0B/ffffff?text=🚀'
        }
      ]
    });

    // Fetch personalized news
    await this.fetchPersonalizedNews();
  }

  fetchPersonalizedNews = async () => {
    try {
      const response = await fetch(`/api/news/top?category=technology&pageSize=6&country=in`);
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

  getCategoryColor = (category) => {
    const colors = {
      technology: '#4F46E5',
      business: '#10B981',
      health: '#EF4444',
      entertainment: '#F59E0B',
      sports: '#3B82F6',
      science: '#8B5CF6',
      general: '#6B7280'
    };
    return colors[category] || '#6B7280';
  }

  render() {
    const { stats, recentBookmarks, personalizedNews, loading, timeOfDay, quote, currentTime, weatherData, notifications } = this.state;

    if (loading) return <Spinner />;

    // Chart data
    const doughnutData = {
      labels: ['Read', 'Unread'],
      datasets: [{
        data: [89, 67],
        backgroundColor: ['#10B981', '#F3F4F6'],
        borderWidth: 0
      }]
    };

    const barData = {
      labels: stats?.categoryStats?.map(s => s._id) || [],
      datasets: [{
        label: 'Articles by Category',
        data: stats?.categoryStats?.map(s => s.count) || [],
        backgroundColor: [
          '#4F46E5',
          '#10B981',
          '#8B5CF6',
          '#EF4444',
          '#F59E0B'
        ],
        borderRadius: 8
      }]
    };

    const lineData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Reading Activity',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };

    return (
      <div className="ultra-dashboard-container">
        {/* Animated Background */}
        <div className="animated-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
          <div className="geometric-pattern"></div>
        </div>

        {/* Hero Header */}
        <div className="dashboard-header-3d">
          <div className="header-content">
            <div className="greeting-section-3d">
              <h1 className="greeting-3d">
                Good {timeOfDay}! 
                <span className="wave-emoji-3d">👋</span>
              </h1>
              <p className="subtitle-3d">{quote}</p>
              <div className="live-clock">
                <span className="clock-icon">🕐</span>
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit' 
                })}
              </div>
            </div>

            {/* Weather Widget */}
            {weatherData && (
              <div className="weather-widget-3d glass-effect">
                <div className="weather-icon-3d">{weatherData.icon}</div>
                <div className="weather-info">
                  <div className="weather-temp">{weatherData.temp}°C</div>
                  <div className="weather-condition">{weatherData.condition}</div>
                  <div className="weather-details">
                    <span>💧 {weatherData.humidity}%</span>
                    <span>💨 {weatherData.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3D Stats Cards */}
        <div className="stats-grid-3d">
          <div className="stat-card-3d glass-card hover-3d">
            <div className="stat-icon-3d">
              <div className="icon-3d-wrapper">
                <span className="icon-3d">📚</span>
              </div>
            </div>
            <div className="stat-content-3d">
              <div className="stat-number-3d" data-value={stats?.totalBookmarks || 0}>
                {stats?.totalBookmarks || 0}
              </div>
              <div className="stat-label-3d">Total Bookmarks</div>
              <div className="stat-trend positive">
                <span className="trend-icon">📈</span>
                +12% this week
              </div>
            </div>
            <div className="card-glow"></div>
          </div>

          <div className="stat-card-3d glass-card hover-3d">
            <div className="stat-icon-3d">
              <div className="icon-3d-wrapper">
                <span className="icon-3d">📖</span>
              </div>
            </div>
            <div className="stat-content-3d">
              <div className="stat-number-3d">{stats?.articlesRead || 0}</div>
              <div className="stat-label-3d">Articles Read</div>
              <div className="stat-trend positive">
                <span className="trend-icon">🎯</span>
                Goal: 100
              </div>
            </div>
            <div className="card-glow"></div>
          </div>

          <div className="stat-card-3d glass-card hover-3d">
            <div className="stat-icon-3d">
              <div className="icon-3d-wrapper">
                <span className="icon-3d">🔥</span>
              </div>
            </div>
            <div className="stat-content-3d">
              <div className="stat-number-3d">{stats?.trending || 0}</div>
              <div className="stat-label-3d">Trending Now</div>
              <div className="stat-trend">
                <span className="trend-icon">⚡</span>
                Live updates
              </div>
            </div>
            <div className="card-glow"></div>
          </div>

          <div className="stat-card-3d glass-card hover-3d">
            <div className="stat-icon-3d">
              <div className="icon-3d-wrapper">
                <span className="icon-3d">⭐</span>
              </div>
            </div>
            <div className="stat-content-3d">
              <div className="stat-number-3d">{stats?.savedThisWeek || 0}</div>
              <div className="stat-label-3d">Saved This Week</div>
              <div className="stat-trend positive">
                <span className="trend-icon">🚀</span>
                Keep going!
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section-3d">
          <div className="chart-card-3d glass-card">
            <h3 className="chart-title">Reading Progress</h3>
            <div className="chart-container">
              <Doughnut data={doughnutData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
              }} />
            </div>
          </div>

          <div className="chart-card-3d glass-card">
            <h3 className="chart-title">Category Distribution</h3>
            <div className="chart-container">
              <Bar data={barData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }} />
            </div>
          </div>

          <div className="chart-card-3d glass-card">
            <h3 className="chart-title">Weekly Activity</h3>
            <div className="chart-container">
              <Line data={lineData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }} />
            </div>
          </div>
        </div>

        {/* Recent Activity & Notifications */}
        <div className="activity-section-3d">
          <div className="activity-card-3d glass-card">
            <h3 className="section-title-3d">
              <span className="title-icon">🔔</span>
              Recent Notifications
            </h3>
            <div className="notifications-list">
              {notifications.map(notif => (
                <div key={notif.id} className="notification-item hover-lift">
                  <span className="notif-icon">{notif.icon}</span>
                  <div className="notif-content">
                    <p className="notif-text">{notif.text}</p>
                    <span className="notif-time">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="activity-card-3d glass-card">
            <h3 className="section-title-3d">
              <span className="title-icon">📑</span>
              Recent Bookmarks
            </h3>
            <div className="bookmarks-list-3d">
              {recentBookmarks.map((bookmark, index) => (
                <div key={index} className="bookmark-item-3d hover-lift">
                  <img src={bookmark.image} alt="" className="bookmark-image" />
                  <div className="bookmark-content">
                    <h4 className="bookmark-title">{bookmark.title}</h4>
                    <div className="bookmark-meta">
                      <span className="category-badge" style={{
                        backgroundColor: this.getCategoryColor(bookmark.category) + '20',
                        color: this.getCategoryColor(bookmark.category)
                      }}>
                        {this.getCategoryIcon(bookmark.category)} {bookmark.category}
                      </span>
                      <span className="bookmark-time">
                        {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-3d">
          <Link to="/trending" className="action-btn-3d gradient-btn">
            <span className="btn-icon">🔥</span>
            <span>Trending</span>
          </Link>
          <Link to="/bookmarks" className="action-btn-3d gradient-btn">
            <span className="btn-icon">📖</span>
            <span>Bookmarks</span>
          </Link>
          <Link to="/search" className="action-btn-3d gradient-btn">
            <span className="btn-icon">🔍</span>
            <span>Search</span>
          </Link>
          <Link to="/preferences" className="action-btn-3d gradient-btn">
            <span className="btn-icon">⚙️</span>
            <span>Settings</span>
          </Link>
        </div>

        {/* Personalized News */}
        <div className="news-section-3d">
          <h2 className="section-title-3d">
            <span className="title-icon">📰</span>
            Recommended For You
          </h2>
          <div className="news-grid-3d">
            {personalizedNews.slice(0, 6).map((article, index) => (
              <div key={index} className="news-card-3d glass-card hover-3d">
                <NewsItems
                  title={article.title}
                  des={article.description}
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
      </div>
    );
  }
}

export default UltraModernDashboard;
