const express = require('express');
const router = express.Router();

// Mock news data for fallback
const getMockNews = (category, pageSize) => {
  const mockArticles = {
    general: [
      {
        title: "Breaking: Major Technology Breakthrough Announced",
        description: "Scientists have made a significant discovery that could revolutionize the tech industry. This development promises to change how we interact with digital devices.",
        url: "https://example.com/tech-breakthrough",
        urlToImage: "https://via.placeholder.com/400x200/007bff/ffffff?text=Tech+News",
        author: "Tech Reporter",
        publishedAt: new Date().toISOString(),
        source: { name: "NewsBoard" }
      },
      {
        title: "Global Climate Summit Reaches Historic Agreement",
        description: "World leaders have reached a consensus on new climate policies that will shape environmental regulations for the next decade.",
        url: "https://example.com/climate-summit",
        urlToImage: "https://via.placeholder.com/400x200/28a745/ffffff?text=Climate+News",
        author: "Environment Correspondent",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: { name: "NewsBoard" }
      },
      {
        title: "Economic Markets Show Strong Recovery Signs",
        description: "Financial analysts report positive trends across major stock exchanges as investor confidence continues to grow.",
        url: "https://example.com/market-recovery",
        urlToImage: "https://via.placeholder.com/400x200/ffc107/000000?text=Economy+News",
        author: "Financial Analyst",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: { name: "NewsBoard" }
      }
    ],
    business: [
      {
        title: "Startup Raises $100M in Series A Funding",
        description: "A promising tech startup has secured significant funding to expand their innovative platform globally.",
        url: "https://example.com/startup-funding",
        urlToImage: "https://via.placeholder.com/400x200/007bff/ffffff?text=Business+News",
        author: "Business Reporter",
        publishedAt: new Date().toISOString(),
        source: { name: "NewsBoard" }
      }
    ],
    technology: [
      {
        title: "AI Revolution: New Model Surpasses Human Performance",
        description: "A new artificial intelligence model has achieved unprecedented results in complex reasoning tasks.",
        url: "https://example.com/ai-breakthrough",
        urlToImage: "https://via.placeholder.com/400x200/6f42c1/ffffff?text=AI+News",
        author: "AI Researcher",
        publishedAt: new Date().toISOString(),
        source: { name: "NewsBoard" }
      }
    ],
    health: [
      {
        title: "Medical Breakthrough in Cancer Treatment",
        description: "Researchers have developed a new treatment approach that shows promising results in early clinical trials.",
        url: "https://example.com/medical-breakthrough",
        urlToImage: "https://via.placeholder.com/400x200/dc3545/ffffff?text=Health+News",
        author: "Medical Correspondent",
        publishedAt: new Date().toISOString(),
        source: { name: "NewsBoard" }
      }
    ],
    entertainment: [
      {
        title: "Hollywood Announces Major Film Production",
        description: "A highly anticipated movie project has been greenlit with an all-star cast and acclaimed director.",
        url: "https://example.com/hollywood-news",
        urlToImage: "https://via.placeholder.com/400x200/ffc107/000000?text=Entertainment",
        author: "Entertainment Reporter",
        publishedAt: new Date().toISOString(),
        source: { name: "NewsBoard" }
      }
    ],
    sports: [
      {
        title: "Championship Finals Set Record Viewership",
        description: "The recent championship match attracted millions of viewers worldwide, breaking previous viewership records.",
        url: "https://example.com/sports-championship",
        urlToImage: "https://via.placeholder.com/400x200/17a2b8/ffffff?text=Sports+News",
        author: "Sports Reporter",
        publishedAt: new Date().toISOString(),
        source: { name: "NewsBoard" }
      }
    ]
  };

  const articles = mockArticles[category] || mockArticles.general;
  return articles.slice(0, pageSize);
};

// Base route for news - redirects to top headlines
router.get('/', async (req, res) => {
  // Redirect to /top with query parameters
  const queryString = new URLSearchParams(req.query).toString();
  return res.redirect(`/api/news/top${queryString ? '?' + queryString : ''}`);
});

// GET /api/news/top?country=in&category=sports&page=1&pageSize=6
// Proxies requests to GNews API while keeping a consistent response shape for the frontend.
router.get('/top', async (req, res) => {
  try {
    const country = req.query.country || 'in';
    const category = req.query.category || 'general';
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize || req.query.max) || 6;

    const apiKey = process.env.GNEWS_API_KEY || '634c71d3a3b44539a03e33700e929183';
    console.log('Using API key:', apiKey ? 'Present' : 'Missing');
    
    const url = new URL('https://gnews.io/api/v4/top-headlines');
    url.searchParams.set('country', country);
    url.searchParams.set('category', category);
    url.searchParams.set('lang', 'en');
    url.searchParams.set('max', String(pageSize));
    url.searchParams.set('token', apiKey); // GNews uses 'token' not 'apikey'

    try {
      // Node 18+ has global fetch
      console.log('Fetching from:', url.toString());
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'NewsBoard/1.0',
          'Accept': 'application/json'
        }
      });
      
      if (!resp.ok) {
        console.log('API Response not OK:', resp.status, resp.statusText);
        throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
      }
      
      const data = await resp.json();
      console.log('API Response status:', resp.status, 'Articles:', data.articles?.length || 0);

      if (data && data.articles && data.articles.length > 0) {
        // Success with real API
        const unique = dedupeArticles(data.articles);
        return res.json({
          status: 'ok',
          totalResults: data.totalArticles || data.totalResults || unique.length,
          articles: unique,
          source: 'gnews'
        });
      } else {
        console.log('API returned no articles, using fallback');
        throw new Error('No articles returned from API');
      }
    } catch (apiError) {
      console.log('GNews API failed, using mock data:', apiError.message);
      // Fall back to mock data
      const mockArticles = getMockNews(category, pageSize);
      return res.json({
        status: 'ok',
        totalResults: mockArticles.length * 10, // Simulate more articles exist
        articles: mockArticles,
        source: 'mock-fallback'
      });
    }
  } catch (err) {
    console.error('News proxy error:', err);
    // Ultimate fallback
    const mockArticles = getMockNews('general', pageSize);
    return res.json({
      status: 'ok',
      totalResults: mockArticles.length,
      articles: mockArticles,
      source: 'mock-fallback'
    });
  }
});

// Utility: ensure unique articles by URL/title
function dedupeArticles(articles = []) {
  const seen = new Set();
  const out = [];
  for (const a of articles) {
    const key = (a.url || a.title || '').toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      out.push(a);
    }
  }
  return out;
}

// GET /api/news/search?q=bitcoin&category=business&sortBy=relevancy&page=1&pageSize=12
// Search news articles
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ status: 'error', message: 'Search query is required' });
    }

    const category = req.query.category;
    const sortBy = req.query.sortBy || 'publishedAt';
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    const country = req.query.country;

      const apiKey = process.env.GNEWS_API_KEY || '634c71d3a3b44539a03e33700e929183';
      const url = new URL('https://gnews.io/api/v4/search');
      url.searchParams.set('q', query);
      url.searchParams.set('lang', 'en');
      url.searchParams.set('max', String(pageSize));
      url.searchParams.set('sortby', sortBy);
      if (category && category !== 'all') url.searchParams.set('category', category);
      if (country && country !== 'all') url.searchParams.set('country', country);
      url.searchParams.set('token', apiKey);

    try {
      const resp = await fetch(url);
      const data = await resp.json();

      if (resp.ok && data && data.articles) {
        const unique = dedupeArticles(data.articles);
        return res.json({
          status: 'ok',
          totalResults: data.totalArticles || data.totalResults || unique.length,
          articles: unique,
          source: 'gnews-search'
        });
      } else {
        throw new Error('Search API failed');
      }
    } catch (apiError) {
      console.log('Search API failed, using mock search results:', apiError.message);
      // Generate mock search results based on query
      const mockResults = [
        {
          title: `Breaking: Latest developments in ${query}`,
          description: `Comprehensive coverage of recent ${query} related news and updates from our editorial team.`,
          url: `https://example.com/search-${query.replace(/\s+/g, '-')}`,
          urlToImage: `https://placehold.co/400x200?text=${encodeURIComponent(query)}`,
          author: "NewsBoard Editor",
          publishedAt: new Date().toISOString(),
          source: { name: "NewsBoard" }
        },
        {
          title: `Analysis: Understanding the impact of ${query}`,
          description: `Expert analysis on how ${query} is shaping current events and future trends.`,
          url: `https://example.com/analysis-${query.replace(/\s+/g, '-')}`,
          urlToImage: `https://placehold.co/400x200?text=Analysis`,
          author: "NewsBoard Analyst",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: "NewsBoard" }
        }
      ];
      
      return res.json({
        status: 'ok',
        totalResults: mockResults.length * 5, // Simulate more results
        articles: dedupeArticles(mockResults).slice(0, pageSize),
        source: 'mock-search'
      });
    }
  } catch (err) {
    console.error('News search error:', err);
    // Ultimate fallback
    const mockResults = [{
      title: "Search functionality temporarily unavailable",
      description: "We're working to restore full search capabilities. Please try again later.",
      url: "https://example.com/search-error",
      urlToImage: "https://via.placeholder.com/400x200/dc3545/ffffff?text=Search+Error",
      author: "NewsBoard Team",
      publishedAt: new Date().toISOString(),
      source: { name: "NewsBoard" }
    }];
    
    return res.json({
      status: 'ok',
      totalResults: 1,
      articles: mockResults,
      source: 'error-fallback'
    });
  }
});

// GET /api/news/trending?topics=5
// Get trending topics based on recent popular searches
router.get('/trending', async (req, res) => {
  try {
    const topicsCount = parseInt(req.query.topics) || 10;
    const country = req.query.country || 'in';

    // Popular trending topics (can be enhanced with real trending data)
    const trendingTopics = [
      'artificial intelligence', 'climate change', 'cryptocurrency', 
      'space exploration', 'renewable energy', 'cybersecurity',
      'electric vehicles', 'quantum computing', 'biotechnology',
      'social media', 'pandemic recovery', 'economic growth'
    ];

    const topics = trendingTopics.slice(0, topicsCount);
    
    // Fetch sample articles for trending topics
    const apiKey = process.env.GNEWS_API_KEY || '634c71d3a3b44539a03e33700e929183';
    const promises = topics.slice(0, 3).map(async topic => {
      try {
        const url = new URL('https://gnews.io/api/v4/search');
        url.searchParams.set('q', topic);
        url.searchParams.set('lang', 'en');
        url.searchParams.set('max', '2');
        url.searchParams.set('country', country);
        url.searchParams.set('token', apiKey);
        
        console.log('Fetching trending for:', topic);
        const resp = await fetch(url);
        const data = await resp.json();
        
        if (resp.ok && data.articles) {
          return {
            topic,
            articles: data.articles,
            totalResults: data.totalArticles || data.articles.length
          };
        } else {
          throw new Error('No articles for topic');
        }
      } catch (error) {
        console.log('Trending topic failed:', topic, error.message);
        // Return mock data for this topic
        return { 
          topic, 
          articles: getMockNews('general', 2).map(article => ({
            ...article,
            title: `${topic.charAt(0).toUpperCase() + topic.slice(1)}: ${article.title}`,
            description: `Latest developments in ${topic}. ${article.description}`
          })), 
          totalResults: 10 
        };
      }
    });

    const trendingData = await Promise.all(promises);
    
    return res.json({
      status: 'ok',
      trending: topics,
      trendingWithArticles: trendingData,
      source: 'generated-trending'
    });
  } catch (err) {
    console.error('Trending topics error:', err);
    return res.status(500).json({ status: 'error', message: 'Failed to get trending topics' });
  }
});

module.exports = router;
