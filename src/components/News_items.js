import React, { Component } from 'react'

export class NewsItems extends Component {
  render() {
  let {title, des ,imageUrl, NewsUrl, author, publishedAt} = this.props;
    return (
      <div>
        <div className="card" style={{width: "18rem"}}>
  <img src={!imageUrl ? "https://images.wsj.net/im-99995962/social" : imageUrl} className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">{title}...</h5>
    <p className="card-text">{des}... </p>
     <p className="card-text"><small className="text-body-secondary">By {author} : {new Date(publishedAt).toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium", 
  timeStyle: "short"   
  })}</small></p>
  <a href={NewsUrl} target='_blank' rel="noopener noreferrer" className="btn btn-sm btn-dark">Read More</a>
  </div>
</div>
      </div>
    )
  }
}

export default NewsItems;
