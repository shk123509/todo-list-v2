import React, { Component } from "react";
import NewsItems from "./NewsItems";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
      error: null,
    };
  }
  async componentDidMount() {
    this.props.setProgress(10);
    // Use backend proxy to fetch news (avoids exposing API keys)
    let url = `/api/news/top?country=${this.props.country}&category=${this.props.category}&page=${this.state.page}&pageSize=${this.props.pageSize}`;

    this.setState({ loading: true, error: null });
    try {
      let data = await fetch(url);
      this.props.setProgress(30);
      let parData = await data.json();
      this.props.setProgress(70);
      if (parData.status !== "ok" || !parData.articles || parData.articles.length === 0) {
        this.setState({
          articles: [],
          totalResults: 0,
          loading: false,
          error: "No news articles found or API error."
        });
      } else {
        this.setState({
          articles: parData.articles,
          totalResults: parData.totalResults,
          loading: false,
          error: null
        });
      }
    } catch (err) {
      this.setState({
        articles: [],
        totalResults: 0,
        loading: false,
        error: "Failed to fetch news articles."
      });
    }
    this.props.setProgress(100);
  }
  handlepre = async () => {
    let url = `/api/news/top?country=${this.props.country}&category=${this.props.category}&page=${this.state.page}&pageSize=${this.props.pageSize}`;

    this.setState({ loading: true, error: null });
    try {
      let data = await fetch(url);
      let parData = await data.json();
      if (parData.status !== "ok" || !parData.articles || parData.articles.length === 0) {
        this.setState({
          page: this.state.page - 1,
          articles: [],
          loading: false,
          error: "No news articles found or API error."
        });
      } else {
        this.setState({
          page: this.state.page - 1,
          articles: parData.articles,
          loading: false,
          error: null
        });
      }
    } catch (err) {
      this.setState({
        page: this.state.page - 1,
        articles: [],
        loading: false,
        error: "Failed to fetch news articles."
      });
    }
  };
  fetchData = async () => {
    let url = `/api/news/top?country=${this.props.country}&category=${this.props.category}&page=${this.state.page}&pageSize=${this.props.pageSize}`;

    this.setState({ page: this.state.page + 1, error: null });
    try {
      let data = await fetch(url);
      let parData = await data.json();
      if (parData.status !== "ok" || !parData.articles || parData.articles.length === 0) {
        this.setState({
          articles: [],
          totalResults: 0,
          loading: false,
          error: "No news articles found or API error."
        });
      } else {
        this.setState({
          articles: this.state.articles.concat(parData.articles),
          totalResults: parData.totalResults,
          loading: false,
          error: null
        });
      }
    } catch (err) {
      this.setState({
        articles: [],
        totalResults: 0,
        loading: false,
        error: "Failed to fetch news articles."
      });
    }
  };
  handleNext = async () => {
    if (
      this.state.page + 1 >
      Math.ceil(this.state.totalResults / this.props.pageSize)
    ) {
    } else {
      let url = `/api/news/top?country=${this.props.country}&category=${this.props.category}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({ loading: true, error: null });
      try {
        let data = await fetch(url);
        let parData = await data.json();
        if (parData.status !== "ok" || !parData.articles || parData.articles.length === 0) {
          this.setState({
            page: this.state.page + 1,
            articles: [],
            loading: false,
            error: "No news articles found or API error."
          });
        } else {
          this.setState({
            page: this.state.page + 1,
            articles: parData.articles,
            loading: false,
            error: null
          });
        }
      } catch (err) {
        this.setState({
          page: this.state.page + 1,
          articles: [],
          loading: false,
          error: "Failed to fetch news articles."
        });
      }
    }
  };
  render() {
    return (
      <div style={{ marginTop: "80px" }}>
        <h1 className="text-center">
          NewsMonkey – Top Stories Around the World
        </h1>
        {this.state.error && (
          <div className="alert alert-danger text-center" style={{ marginTop: "20px" }}>
            {this.state.error}
          </div>
        )}
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="contanier">
            <div className="row">
              {this.state.articles.map((elements) => {
                return (
                  <div className="col-md-4" key={elements.url}>
                    <NewsItems
                      title={elements.title ? elements.title.slice(0, 30) : ""}
                      des={
                        elements.description
                          ? elements.description.slice(0, 70)
                          : " "
                      }
                      imageUrl={elements.urlToImage}
                      NewsUrl={elements.url}
                      author={elements.author}
                      publishedAt={elements.publishedAt}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}

export default News;
