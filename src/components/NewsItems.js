import React, { Component } from 'react'
import './NewsItems.css'

export class NewsItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBookmarked: false,
      bookmarking: false
    };
  }

  componentDidMount() {
    this.checkBookmarkStatus();
  }

  checkBookmarkStatus = async () => {
    const authToken = localStorage.getItem('token');
    if (!authToken) return;

    try {
      const response = await fetch(`/api/bookmarks/check?url=${encodeURIComponent(this.props.NewsUrl)}`, {
        headers: {
          'auth-token': authToken
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({ isBookmarked: data.isBookmarked });
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  handleBookmark = async () => {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      alert('Please login to bookmark articles');
      return;
    }

    this.setState({ bookmarking: true });

    try {
      const { title, des, NewsUrl, imageUrl, author, publishedAt, category } = this.props;
      
      if (this.state.isBookmarked) {
        // Remove bookmark functionality would require bookmark ID, 
        // which we don't have here. For now, just show message.
        alert('Article is already bookmarked. You can manage it from the Bookmarks page.');
        return;
      }

      const response = await fetch('/api/bookmarks/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken
        },
        body: JSON.stringify({
          title,
          description: des,
          url: NewsUrl,
          urlToImage: imageUrl,
          author: author || 'Unknown',
          publishedAt,
          category: category || 'general'
        })
      });

      if (response.ok) {
        this.setState({ isBookmarked: true });
        alert('Article bookmarked successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to bookmark article');
      }
    } catch (error) {
      console.error('Error bookmarking article:', error);
      alert('Failed to bookmark article');
    } finally {
      this.setState({ bookmarking: false });
    }
  };

  render() {
    let {title, des ,imageUrl, NewsUrl, author, publishedAt} = this.props;
    const { isBookmarked, bookmarking } = this.state;
    
    // Use a fallback image that's reliable
    const defaultImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80";
    const displayImage = imageUrl && imageUrl !== "" ? imageUrl : defaultImage;
    
    return (
      <div className="news-item-container animate-fade-in-up">
        <div className="news-card card-animated hover-lift">
          <div className="news-image-container">
            <img 
              src={displayImage} 
              className="news-image" 
              alt={title || "News thumbnail"}
              loading="lazy"
              onError={(e) => {
                // Prevent infinite error loop and use a reliable fallback
                if (e.currentTarget.src !== defaultImage) {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultImage;
                }
              }}
            />
            <div className="news-overlay">
              <div className="news-category-badge">
                {this.props.category || 'News'}
              </div>
            </div>
          </div>
          <div className="news-content">
            <h5 className="news-title text-gradient">
              {title && title.length > 60 ? title.slice(0, 60) + '...' : title}
            </h5>
            <p className="news-description">
              {des && des.length > 100 ? des.slice(0, 100) + '...' : des}
            </p>
            <div className="news-meta">
              <span className="news-author">
                <i className="fas fa-user-circle"></i> {author || 'Unknown'}
              </span>
              <span className="news-date">
                <i className="fas fa-clock"></i> 
                {new Date(publishedAt).toLocaleDateString("en-IN", {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="news-actions">
              <a 
                href={NewsUrl} 
                target='_blank' 
                rel="noopener noreferrer" 
                className="btn-read-more btn-animated hover-glow"
              >
                <span>Read More</span>
                <i className="fas fa-arrow-right"></i>
              </a>
              <button 
                className={`btn-bookmark ${isBookmarked ? 'bookmarked' : ''} ${bookmarking ? 'loading' : ''}`}
                onClick={this.handleBookmark}
                disabled={bookmarking}
                title={isBookmarked ? 'Already bookmarked' : 'Bookmark this article'}
              >
                {bookmarking ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <i className={`fas ${isBookmarked ? 'fa-bookmark' : 'fa-bookmark'}`}></i>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default NewsItems;
