import { Container } from "@mui/material";
import React from "react";
import appStoreIcon from "./images/appStore.png";
import playStoreIcon from "./images/playStore.png";
import "./NewsContent.css";
import NewsCard from "../NewsCard/NewsCard";

function NewsContent({ newsArray, newsResults, loadMore, setLoadMore }) {
  return (
    <Container maxWidth="md">
      <div className="content">
        <div className="downloadMessage">
          <span className="downloadText">
            For the best experience use inshots appon your smartphone
          </span>
          <img alt="app store" height="65%" src={appStoreIcon} />
          <img alt="play store" height="90%" src={playStoreIcon} />
        </div>
        {newsArray.map((newsItem) => (
          <NewsCard newsItem={newsItem} key={newsItem.title} />
        ))}
        {loadMore <= newsResults && (
          <>
            <hr />
            <button
              className="loadMore"
              onClick={() => setLoadMore(loadMore + 20)}
            >
              Load more
            </button>
          </>
        )}
      </div>
    </Container>
  );
}

export default NewsContent;
