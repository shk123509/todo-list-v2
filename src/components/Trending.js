import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NewsItems from './NewsItems';
import Spinner from './Spinner';

export class Trending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trending: [],
      trendingWithArticles: [],
      loading: true,
      error: null
    };
  }

  async componentDidMount() {
    await this.fetchTrending();
  }

  fetchTrending = async () => {
    this.setState({ loading: true, error: null });
    
    try {
      const response = await fetch('/api/news/trending?topics=8');
      const data = await response.json();
      
      if (data.status === 'ok') {
        this.setState({
          trending: data.trending || [],
          trendingWithArticles: data.trendingWithArticles || [],
          loading: false
        });
      } else {
        this.setState({
          error: 'Failed to load trending topics',
          loading: false
        });
      }
    } catch (error) {
      this.setState({
        error: 'Failed to load trending topics',
        loading: false
      });
    }
  };

  render() {
    const { trending, trendingWithArticles, loading, error } = this.state;

    if (loading) return <Spinner />;

    return (
      <div style={{ marginTop: '80px' }} className="container">
        <h1 className="text-center mb-4">🔥 Trending Now</h1>
        
        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}

        {/* Trending Topics Pills */}
        <div className="mb-5">
          <h3 className="mb-3">Popular Topics</h3>
          <div className="d-flex flex-wrap gap-2">
            {trending.map((topic, index) => (
              <Link
                key={index}
                to={`/search?q=${encodeURIComponent(topic)}`}
                className="btn btn-outline-primary btn-sm"
                style={{ 
                  borderRadius: '25px',
                  textTransform: 'capitalize'
                }}
              >
                #{topic.replace(' ', '')}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Articles from Trending Topics */}
        {trendingWithArticles.length > 0 && (
          <div>
            <h3 className="mb-4">Featured Articles</h3>
            {trendingWithArticles.map((topicData, index) => (
              <div key={index} className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0" style={{ textTransform: 'capitalize' }}>
                    📰 {topicData.topic}
                  </h5>
                  <Link 
                    to={`/search?q=${encodeURIComponent(topicData.topic)}`}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    View All ({topicData.totalResults})
                  </Link>
                </div>
                
                {topicData.articles.length > 0 ? (
                  <div className="row">
                    {topicData.articles.map((article, articleIndex) => (
                      <div key={articleIndex} className="col-md-6 mb-3">
                        <NewsItems
                          title={article.title ? article.title.slice(0, 50) : ''}
                          des={article.description ? article.description.slice(0, 100) : ''}
                          imageUrl={article.urlToImage}
                          NewsUrl={article.url}
                          author={article.author}
                          publishedAt={article.publishedAt}
                          category="trending"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No articles available for this topic.</p>
                )}
                
                {index < trendingWithArticles.length - 1 && <hr />}
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center py-5 bg-light rounded">
          <h4>Want to explore more?</h4>
          <p className="text-muted">Search for specific topics or browse by category</p>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <Link to="/search" className="btn btn-primary">
              Search Articles
            </Link>
            <Link to="/business" className="btn btn-outline-primary">
              Business
            </Link>
            <Link to="/technology" className="btn btn-outline-primary">
              Technology
            </Link>
            <Link to="/health" className="btn btn-outline-primary">
              Health
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Trending;
