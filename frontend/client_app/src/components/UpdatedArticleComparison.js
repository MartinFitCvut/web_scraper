import React, { useState } from 'react';
import { diffWords } from 'diff';
import FullArticleView from './fullArticleView';


const OneArticleComparison = ({ currentArticle, articleVersions }) => {
  const [currentArticleState] = useState(currentArticle);
  const [articles] = useState(articleVersions);

  const getAllUniqueKeys = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    const uniqueKeys = [...new Set([...keys1, ...keys2])];

    return uniqueKeys;
  };

  const renderDiff = (text1, text2) => {
    try {
      if (text1 === undefined && text2 === undefined) {
        return null; 
      }

      const differences = diffWords(text1 || '', text2 || ''); 

      return differences.map((part, index) => {
        const style = part.added
          ? { backgroundColor: 'lightgreen' }
          : part.removed ? { backgroundColor: 'lightpink' }
            : null;
        return <span key={index} style={style}>{part.value}</span>;
      });
    }
    catch (error) {
      console.log(error);
    }
  };


  return (
    <div style={{background: '#e9e9e9', padding: '10px', marginBottom: '30px'}}>
      <h1>Aktuálne uložený článok</h1>
      <FullArticleView article={currentArticleState} />
      <h1>Verzie článku</h1>
      {articleVersions && currentArticle ? (
        <div>
          <article className="searchArticlePlace">
            <h3 className="articleSourceId">{articles.sourceID}</h3>
            <div className="articleFullLinkAndImage">
              <div className="searchArticleImageVer">
                <img src={articles.image} alt={articles['image:alt']} />

              </div>
              <div className='spaceforarticle'>
                <span>
                  <h1 className="searchArticleLink">{renderDiff(currentArticleState.title, articles.title)}</h1>
                  <span className="">
                    <p>{renderDiff(currentArticleState.pubdate, articles.pubdate)}</p>
                    <p>guid: {renderDiff(currentArticleState.guid, articles.guid)}</p>
                    <p>{renderDiff(currentArticleState.link, articles.link)}</p>
                  </span>
                  <p>{renderDiff(currentArticleState.description, articles.description)}</p>
                </span>
                {getAllUniqueKeys(currentArticleState, articles).map((key) => {
                  if (
                    key !== 'title' &&
                    key !== 'link' &&
                    key !== 'image' &&
                    key !== 'description' &&
                    key !== 'sourceID' &&
                    key !== 'pubdate' &&
                    key !== 'guid' &&
                    key !== '_id'
                  ) {
                    const currentValue = currentArticleState[key];
                    const versionValue = articles[key];

                   
                    const diff = renderDiff(currentValue, versionValue);

                    return (
                      <div key={key}>
                        <p><b>{key}</b>: {diff}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </article>
        </div>
      ) : (null)}


    </div>
  );
};

export default OneArticleComparison;
