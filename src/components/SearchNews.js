import React, { Component } from 'react';
import NewsItems from './NewsItems';
import Spinner from './Spinner';
import './SearchNews.css';

export class SearchNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      query: '',
      category: 'all',
      sortBy: 'publishedAt',
      country: 'in',
      page: 1,
      totalResults: 0,
      hasSearched: false,
      error: null
    };
  }

  componentDidMount() {
    // Check for URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const queryFromUrl = urlParams.get('q');
    
    if (queryFromUrl) {
      this.setState({ query: queryFromUrl }, () => {
        this.handleSearch();
      });
    }
  }

  handleSearch = async (e) => {
    e?.preventDefault();
    if (!this.state.query.trim()) return;

    this.setState({ loading: true, error: null, hasSearched: true });

    try {
      const { query, category, sortBy, country, page } = this.state;
      let url = `/api/news/search?q=${encodeURIComponent(query)}&page=${page}&pageSize=12`;
      
      if (category !== 'all') url += `&category=${category}`;
      if (sortBy !== 'publishedAt') url += `&sortBy=${sortBy}`;
      if (country !== 'in') url += `&country=${country}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'ok' && data.articles) {
        this.setState({
          articles: page === 1 ? data.articles : [...this.state.articles, ...data.articles],
          totalResults: data.totalResults,
          loading: false,
          error: null
        });
      } else {
        this.setState({
          articles: [],
          totalResults: 0,
          loading: false,
          error: data.message || 'No articles found'
        });
      }
    } catch (error) {
      this.setState({
        articles: [],
        totalResults: 0,
        loading: false,
        error: 'Failed to search articles'
      });
    }
  };

  loadMore = async () => {
    this.setState({ page: this.state.page + 1 }, () => {
      this.handleSearch();
    });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  clearSearch = () => {
    this.setState({
      articles: [],
      query: '',
      hasSearched: false,
      totalResults: 0,
      page: 1,
      error: null
    });
  };

  render() {
    const { articles, loading, query, category, sortBy, country, hasSearched, totalResults, error } = this.state;

    return (
      <div className="search-news-container">
        {/* Hero Section */}
        <section className="search-hero animate-fade-in-down">
          <div className="container">
            <div className="hero-content">
              <h1 className="search-title text-gradient">🔍 Smart Search</h1>
              <p className="search-subtitle">
                Discover news articles with our intelligent search engine. Find exactly what you're looking for!
              </p>
              <div className="creator-badge animate-bounce-in">
                <span>🚀 Powered by MD Shakib's Search Algorithm</span>
              </div>
            </div>
          </div>
        </section>

        <div className="container">
          {/* Enhanced Search Form */}
          <div className="search-form-wrapper animate-fade-in-up animate-delay-1">
            <form onSubmit={this.handleSearch} className="advanced-search-form">
              <div className="search-input-group">
                <div className="search-input-container">
                  <input
                    type="text"
                    className="search-input"
                    name="query"
                    value={query}
                    onChange={this.handleInputChange}
                    placeholder="What news are you looking for today?"
                    required
                  />
                  <div className="search-input-icon">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
                
                <div className="filters-row">
                  <div className="filter-group animate-slide-in-left animate-delay-2">
                    <label className="filter-label">📁 Category</label>
                    <select
                      className="filter-select"
                      name="category"
                      value={category}
                      onChange={this.handleInputChange}
                    >
                      <option value="all">All Categories</option>
                      <option value="business">Business</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="general">General</option>
                      <option value="health">Health</option>
                      <option value="science">Science</option>
                      <option value="sports">Sports</option>
                      <option value="technology">Technology</option>
                    </select>
                  </div>
                  
                  <div className="filter-group animate-slide-in-up animate-delay-3">
                    <label className="filter-label">📈 Sort By</label>
                    <select
                      className="filter-select"
                      name="sortBy"
                      value={sortBy}
                      onChange={this.handleInputChange}
                    >
                      <option value="publishedAt">Latest</option>
                      <option value="relevancy">Relevance</option>
                      <option value="popularity">Popular</option>
                    </select>
                  </div>
                  
                  <div className="filter-group animate-slide-in-right animate-delay-4">
                    <label className="filter-label">🌍 Country</label>
                    <select
                      className="filter-select"
                      name="country"
                      value={country}
                      onChange={this.handleInputChange}
                    >
                      <option value="in">India</option>
                      <option value="us">United States</option>
                      <option value="gb">United Kingdom</option>
                      <option value="ca">Canada</option>
                      <option value="au">Australia</option>
                    </select>
                  </div>
                </div>
                
                <button type="submit" className={`search-btn btn-animated hover-glow ${loading ? 'loading' : ''}`} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search"></i>
                      <span>Search Articles</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        {hasSearched && (
          <div className="search-results-header animate-fade-in">
            <div className="results-info">
              <h3 className="results-count">
                {totalResults > 0 ? (
                  <>🎯 Found {totalResults} articles for "{query}"</>
                ) : (
                  <>🔍 No articles found for "{query}"</>
                )}
              </h3>
              <p className="results-details">
                {totalResults > 0 && `Showing ${Math.min(articles.length, totalResults)} results`}
              </p>
            </div>
            <button className="clear-search-btn btn-animated" onClick={this.clearSearch}>
              <i className="fas fa-times"></i>
              Clear Search
            </button>
          </div>
        )}

        {error && (
          <div className="alert alert-warning text-center mb-4">
            {error}
          </div>
        )}

        {loading && articles.length === 0 && <Spinner />}

        {/* Enhanced Articles Grid */}
        {articles.length > 0 && (
          <div className="search-results-grid">
            {articles.map((article, index) => (
              <div 
                className={`search-result-item animate-zoom-in animate-delay-${(index % 6) + 1}`} 
                key={`${article.url}-${index}`}
              >
                <NewsItems
                  title={article.title ? article.title.slice(0, 60) : ''}
                  des={article.description ? article.description.slice(0, 120) : ''}
                  imageUrl={article.urlToImage}
                  NewsUrl={article.url}
                  author={article.author}
                  publishedAt={article.publishedAt}
                  category={category !== 'all' ? category : 'news'}
                />
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Load More Button */}
        {articles.length > 0 && articles.length < totalResults && (
          <div className="load-more-section animate-fade-in">
            <button 
              className={`load-more-btn btn-animated hover-glow ${loading ? 'loading' : ''}`}
              onClick={this.loadMore}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Loading more...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-plus-circle"></i>
                  <span>Load More Articles</span>
                  <small>({totalResults - articles.length} remaining)</small>
                </>
              )}
            </button>
          </div>
        )}

        {!hasSearched && (
          <div className="search-placeholder animate-fade-in-up animate-delay-2">
            <div className="placeholder-content">
              <div className="placeholder-icon">🔍</div>
              <h3 className="placeholder-title">Ready to Search?</h3>
              <p className="placeholder-text">
                Enter keywords to discover news from thousands of sources worldwide.
                Use filters to narrow down your search and find exactly what interests you!
              </p>
              <div className="search-suggestions">
                <p className="suggestions-title">Popular searches:</p>
                <div className="suggestion-tags">
                  {['Technology', 'AI', 'Climate', 'Sports', 'Business'].map((tag, index) => (
                    <button 
                      key={tag}
                      className={`suggestion-tag animate-bounce-in animate-delay-${index + 3}`}
                      onClick={() => this.setState({ query: tag }, () => this.handleSearch())}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    );
  }
}

export default SearchNews;
