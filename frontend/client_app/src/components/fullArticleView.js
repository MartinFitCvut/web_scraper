import React, { useState } from "react";
import DownloadButton from "../components/download";
import { Link } from "react-router-dom";

function FullArticleView({ article, index }) {
  const [isActive, setIsActive] = useState(false);

  const toggleItem = () => {
    setIsActive(!isActive);
  };

  return (
    <article className="searchArticlePlace">
      <h3 className="articleSourceId">{article.sourceID}</h3>
      <div className="articleLinkAndImage">
        <div className="searchArticleImage">
          <img src={article.image} alt={article["image:alt"]} />
        </div>
        <div style={{ position: "sticky", padding: "20px" }}>
          <span>
            <h1 className="searchArticleLink">{article.title}</h1>
            <span className="searchArticleDateGuid">
              <p>{article.pubdate}</p>
              <p>guid: {article.guid}</p>
            </span>
            <p>{article.description}</p>
            {isActive && (
              <div>
                {Object.entries(article).map(([key, value]) => {
                  if (
                    key !== "title" &&
                    key !== "link" &&
                    key !== "image" &&
                    key !== "description" &&
                    key !== "sourceID" &&
                    key !== "site_name" &&
                    key !== "type" &&
                    key !== "category" &&
                    key !== "image:height" &&
                    key !== "image:width" &&
                    key !== "image:alt" &&
                    key !== "pubdate" &&
                    key !== "guid"
                  ) {
                    if (key === "content") {
                      return (
                        <div key={key}>
                          <p>
                            <b>{key}</b>: {value}
                          </p>
                        </div>
                      );
                    } else {
                      return (
                        <div key={key}>
                          <p>
                            <b>{key}</b>:{" "}
                            {typeof value === "string"
                              ? value
                              : JSON.stringify(value)}
                          </p>
                        </div>
                      );
                    }
                  }
                  return null;
                })}
              </div>
            )}
            <button
              className="moreButton"
              style={{ width: "100px", marginRight: "20px" }}
              onClick={toggleItem}
            >
              {isActive ? "Menej" : "Viac"}
            </button>
            <Link
              to={article.link}
              target="_blank"
              style={{ width: "100px", marginRight: "20px" }}
            >
              <button className="moreButton"> Odkaz </button>
            </Link>
            <Link
              to={`/versions`}
              state={article.guid}
              style={{ width: "100px", marginRight: "20px" }}
            >
              <button className="moreButton"> Verzie </button>
            </Link>
            <div className="dropdown">
              <button className="dropbtn"> Stiahnuť </button>
              <div className="dropdown-content">
                <DownloadButton
                  data={article}
                  format="json"
                  filename={"article_JSON_" + article.guid}
                />
                <DownloadButton
                  data={[article]}
                  format="csv"
                  filename={"article_CSV_" + article.guid}
                />
                <DownloadButton
                  data={[article]}
                  format="xml"
                  filename={"article_XML_" + article.guid}
                />
              </div>
            </div>
          </span>
        </div>
      </div>
    </article>
  );
}

export default FullArticleView;
