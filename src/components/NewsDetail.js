import React, { Component } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './NewsDetail.css';

// Wrapper component to use hooks with class component
function NewsDetailWrapper() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  
  return <NewsDetail {...params} navigate={navigate} article={state?.article} />;
}

class NewsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: props.article || null,
      loading: !props.article,
      relatedArticles: [],
      showShareMenu: false
    };
  }

  componentDidMount() {
    if (!this.state.article) {
      // If no article passed, redirect back
      this.props.navigate('/');
    }
    this.fetchRelatedArticles();
  }

  fetchRelatedArticles = async () => {
    try {
      const category = this.state.article?.category || 'general';
      const response = await fetch(`/api/news/top?category=${category}&pageSize=3&country=in`);
      const data = await response.json();
      
      if (data.status === 'ok' && data.articles) {
        // Filter out current article
        const related = data.articles.filter(a => a.url !== this.state.article?.url);
        this.setState({ relatedArticles: related.slice(0, 3) });
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
    }
  };

  handleShare = (platform) => {
    const { article } = this.state;
    const shareUrl = article.url;
    const shareText = article.title;
    
    let shareLink = '';
    
    switch(platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        return;
      default:
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
    this.setState({ showShareMenu: false });
  };

  render() {
    const { article, relatedArticles, showShareMenu } = this.state;
    
    if (!article) {
      return (
        <div className="news-detail-container">
          <div className="loading-container">
            <p>Loading article...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="news-detail-container">
        <div className="news-detail-wrapper">
          {/* Back Button */}
          <button 
            className="back-button"
            onClick={() => this.props.navigate(-1)}
          >
            <i className="fas fa-arrow-left"></i> Back to News
          </button>

          {/* Article Header */}
          <div className="article-header">
            <div className="article-category">
              {article.category || 'News'}
            </div>
            <h1 className="article-title">{article.title}</h1>
            
            <div className="article-meta">
              <span className="article-author">
                <i className="fas fa-user-circle"></i> {article.author || 'Unknown Author'}
              </span>
              <span className="article-date">
                <i className="fas fa-clock"></i> 
                {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Article Image */}
          {article.urlToImage && (
            <div className="article-image-container">
              <img 
                src={article.urlToImage} 
                alt={article.title}
                className="article-image"
                onError={(e) => {
                  e.currentTarget.src = "https://picsum.photos/800/400?random=" + Math.random();
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <div className="article-content">
            <p className="article-description">
              {article.description || 'No description available.'}
            </p>
            
            {article.content && (
              <div className="article-full-content">
                {article.content}
              </div>
            )}

            {/* Action Buttons */}
            <div className="article-actions">
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="read-original-btn"
              >
                <i className="fas fa-external-link-alt"></i> Read Original Article
              </a>
              
              <div className="share-container">
                <button 
                  className="share-btn"
                  onClick={() => this.setState({ showShareMenu: !showShareMenu })}
                >
                  <i className="fas fa-share-alt"></i> Share
                </button>
                
                {showShareMenu && (
                  <div className="share-menu">
                    <button onClick={() => this.handleShare('twitter')} className="share-option">
                      <i className="fab fa-twitter"></i> Twitter
                    </button>
                    <button onClick={() => this.handleShare('facebook')} className="share-option">
                      <i className="fab fa-facebook"></i> Facebook
                    </button>
                    <button onClick={() => this.handleShare('whatsapp')} className="share-option">
                      <i className="fab fa-whatsapp"></i> WhatsApp
                    </button>
                    <button onClick={() => this.handleShare('linkedin')} className="share-option">
                      <i className="fab fa-linkedin"></i> LinkedIn
                    </button>
                    <button onClick={() => this.handleShare('copy')} className="share-option">
                      <i className="fas fa-copy"></i> Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="related-articles">
              <h3>Related Articles</h3>
              <div className="related-grid">
                {relatedArticles.map((related, index) => (
                  <div 
                    key={index} 
                    className="related-card"
                    onClick={() => {
                      this.setState({ article: related }, () => {
                        this.fetchRelatedArticles();
                        window.scrollTo(0, 0);
                      });
                    }}
                  >
                    <img 
                      src={related.urlToImage || `https://picsum.photos/300/200?random=${index}`} 
                      alt={related.title}
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/300/200?random=${index}`;
                      }}
                    />
                    <h4>{related.title?.slice(0, 60)}...</h4>
                    <p>{related.description?.slice(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default NewsDetailWrapper;
