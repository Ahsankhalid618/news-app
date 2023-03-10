import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [articles, setArticles] = useState([]); //array [] symbol was missing
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState();
  const newsUpdate = async () => {
    props.SetProgress(0);
    const Url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    let data = await fetch(Url);
    props.SetProgress(30);
    let parseData = await data.json();
    props.SetProgress(70);
    console.log(parseData);
    setArticles(parseData.articles);
    setTotalResults(parseData.totalResults);

    props.SetProgress(100);
    // data.preventDefault();
  };
  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} | NewsApp`;
    newsUpdate();
  }, []);

  const fetchMoreData = async () => {
    setPage(page + 1);
    const Url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&apiKey=${props.apiKey}&page=${
      page + 1
    }&pageSize=${props.pageSize}`;

    let data = await fetch(Url);
    let parseData = await data.json();
    // console.log(parseData);
    setArticles(articles.concat(parseData.articles));
    setTotalResults(parseData.totalResults);
  };

  //  const nextbtn = async () => {
  //     setPage(page + 1);
  //     newsUpdate();
  //   };
  //  const prevbtn = async () => {
  //     setPage(page - 1);
  //     newsUpdate();
  //   };

  return (
    <div className="container">
      <h1 className="text-center mb-5 mt-5">
        News App | Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles !== totalResults}
        loader={!totalResults && <h4 className="text-center">Loading...</h4>}
      >
        <div className="container">
          <div
            className="row"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
            }}
          >
            {articles?.map((element) => {
              return (
                <div className="col-md-3 my-2 mb" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 45) : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 62)
                        : ""
                    }
                    urlToImage={element.urlToImage}
                    newsUrl={element.url}
                    date={element.publishedAt}
                    author={element.author ? element.author : "Unknown"}
                    source={
                      element.source.name ? element.source.name : "Unknown"
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>

      {/* <div className="d-flex justify-content-between"> */}
      {/* <button
            disabled={this.state.page <= 1}
            type="button"
            onClick={this.prevbtn}
            className="btn btn-dark"
          >
            &larr; prev
          < disabled={
              this.state.page + 1 > Math.ceil(this.state.totalResults / 10)
            }
            onClick={this.nextbtn}
            className="btn btn-dark"
          >
            Nex/button>
          <button
            type="button"
           t &rarr;
          </button> */}
      {/* </div> */}
    </div>
  );
};

News.defaultProps = {
  country: "us",
  category: "general",
  key: "general",
};

News.propTypes = {
  country: PropTypes.string,
  category: PropTypes.string,
  key: PropTypes.string,
};

export default News;
