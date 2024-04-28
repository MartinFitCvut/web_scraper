import React, { useState } from 'react';
import { diffWords } from 'diff';
import FullArticleView from './fullArticleView';
import ArticleView from './articleView';

const OneArticleComparison = ({ currentArticle, articleVersions }) => {
  const [currentArticleState] = useState(currentArticle);
  const [articles] = useState(articleVersions);

  const getAllUniqueKeys = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    // Spojíme obidva zoznamy kľúčov a odstránime duplikáty
    const uniqueKeys = [...new Set([...keys1, ...keys2])];
    
    return uniqueKeys;
  };
  
  const renderDiff = (text1, text2) => {
    if (text1 === undefined && text2 === undefined) {
      return null; // Ak sú oba texty undefined, nezobrazujeme žiadne rozdiely
    }
  
    const differences = diffWords(text1 || '', text2 || ''); // Vynecháme undefined hodnoty a použijeme prázdne reťazce
    
    return differences.map((part, index) => {
      const style = part.added 
        ? { backgroundColor: 'lightgreen' } 
        : part.removed ? { backgroundColor: 'lightpink' } 
        : null;
      return <span key={index} style={style}>{part.value}</span>;
    });
  };
  

  return (
    <div>
      <h2>Aktuálne uložený článok</h2>
        <FullArticleView article={currentArticleState}/>
      <h2>Verzie článku</h2>
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

                // Porovnáme hodnoty
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
