import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NewsItems from './NewsItems';
import Spinner from './Spinner';

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: null,
      recentBookmarks: [],
      personalizedNews: [],
      loading: true,
      error: null,
      user: null
    };
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
    }
  };

  fetchPersonalizedNews = async () => {
    try {
      // Get user's most bookmarked category for personalized feed
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

  render() {
    const { stats, recentBookmarks, personalizedNews, loading, error } = this.state;

    if (loading) return <Spinner />;

    if (error) {
      return (
        <div className="container" style={{ marginTop: '80px', paddingTop: '20px' }}>
          <div className="alert alert-warning text-center">
            {error}
            <div className="mt-3">
              <Link to="/login" className="btn btn-primary">Login</Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container" style={{ 
        marginTop: '80px', 
        paddingTop: '20px',
        minHeight: '100vh'
      }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="mb-0" style={{
            background: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>📊 Your Dashboard</h1>
          <span className="text-muted">Welcome back!</span>
        </div>

        {/* Stats Cards with enhanced styling */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card border-0 shadow-sm" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}>
              <div className="card-body text-center text-white p-4">
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                  {stats?.totalBookmarks || 0}
                </div>
                <p className="mb-0 mt-2" style={{ fontSize: '0.9rem', opacity: 0.95 }}>Total Bookmarks</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card border-0 shadow-sm" style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '15px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(240, 147, 251, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}>
              <div className="card-body text-center text-white p-4">
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                  {stats?.readStatusStats?.find(s => s._id === 'completed')?.count || 0}
                </div>
                <p className="mb-0 mt-2" style={{ fontSize: '0.9rem', opacity: 0.95 }}>Articles Read</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card border-0 shadow-sm" style={{
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              borderRadius: '15px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(250, 112, 154, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}>
              <div className="card-body text-center text-white p-4">
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                  {stats?.readStatusStats?.find(s => s._id === 'unread')?.count || 0}
                </div>
                <p className="mb-0 mt-2" style={{ fontSize: '0.9rem', opacity: 0.95 }}>To Read</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card border-0 shadow-sm" style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '15px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(79, 172, 254, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}>
              <div className="card-body text-center text-white p-4">
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                  {stats?.categoryStats?.length || 0}
                </div>
                <p className="mb-0 mt-2" style={{ fontSize: '0.9rem', opacity: 0.95 }}>Categories</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Category Statistics */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <div className="card-header" style={{
                background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 1.5rem'
              }}>
                <h5 className="mb-0">📈 Your Reading Interests</h5>
              </div>
              <div className="card-body">
                {stats?.categoryStats?.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {stats.categoryStats.slice(0, 5).map((cat, index) => (
                      <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <span style={{ textTransform: 'capitalize' }}>{cat._id}</span>
                        <span className="badge bg-primary rounded-pill">{cat.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No reading data yet. Start bookmarking articles!</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Bookmarks */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <div className="card-header d-flex justify-content-between align-items-center" style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 1.5rem'
              }}>
                <h5 className="mb-0">🔖 Recent Bookmarks</h5>
                <Link to="/bookmarks" className="btn btn-sm" style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>View All</Link>
              </div>
              <div className="card-body">
                {recentBookmarks.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {recentBookmarks.map((bookmark, index) => (
                      <div key={index} className="list-group-item">
                        <h6 className="mb-1">{bookmark.title.slice(0, 50)}...</h6>
                        <small className="text-muted">
                          {new Date(bookmark.bookmarkedAt).toLocaleDateString()} • {bookmark.category}
                        </small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No bookmarks yet. Start saving interesting articles!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personalized News Feed */}
        {personalizedNews.length > 0 && (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>🎯 Recommended for You</h3>
              <small className="text-muted">
                Based on your reading preferences
              </small>
            </div>
            <div className="row">
              {personalizedNews.map((article, index) => (
                <div key={index} className="col-md-3 mb-3">
                  <NewsItems
                    title={article.title ? article.title.slice(0, 45) : ''}
                    des={article.description ? article.description.slice(0, 80) : ''}
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

        {/* Quick Actions with enhanced styling */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
          <div className="card-header" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 1.5rem'
          }}>
            <h5 className="mb-0">🚀 Quick Actions</h5>
          </div>
          <div className="card-body" style={{ padding: '1.5rem' }}>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/search" className="btn" style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '0.6rem 1.2rem',
                transition: 'transform 0.2s',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                🔍 Search News
              </Link>
              <Link to="/trending" className="btn" style={{
                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '0.6rem 1.2rem',
                transition: 'transform 0.2s',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                🔥 Trending Topics
              </Link>
              <Link to="/bookmarks" className="btn" style={{
                background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '0.6rem 1.2rem',
                transition: 'transform 0.2s',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                📖 My Bookmarks
              </Link>
              <Link to="/preferences" className="btn" style={{
                background: 'linear-gradient(135deg, #fa709a, #fee140)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '0.6rem 1.2rem',
                transition: 'transform 0.2s',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                ⚙️ Settings
              </Link>
              <Link to="/shop" className="btn" style={{
                background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
                color: '#333',
                border: 'none',
                borderRadius: '10px',
                padding: '0.6rem 1.2rem',
                transition: 'transform 0.2s',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                🛍️ Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
