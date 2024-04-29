import React, { useState } from 'react';
import { diffWords } from 'diff';
import FullArticleView from './fullArticleView';

const ArticleComparison = ({ currentArticle, articleVersions }) => {
  const [currentArticleState] = useState(currentArticle);
  
  const getAllUniqueKeys = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    // Spojíme obidva zoznamy kľúčov a odstránime duplikáty
    const uniqueKeys = [...new Set([...keys1, ...keys2])];
    
    return uniqueKeys;
  };

  const renderDiff = (text1, text2) => {
    try{
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
    }
    catch(error){
      
    }
  };
  

  return (
    <div className='version_articles'>
      <div>
          <h2>Aktuálne uložený článok</h2>
          <FullArticleView article={currentArticleState}/>
      </div>
      <h2>Verzie článku</h2>
      {articleVersions && currentArticle ? (
        <div>
        {articleVersions.map((version, index) => (
          <div key={index}>
            <h3>{version.version}</h3>
            <article className="searchArticlePlace">
              <h3 className="articleSourceId">{version.sourceID}</h3>
              <div className="articleFullLinkAndImage">
                <div className="searchArticleImageVer">
                  <img src={version.image} alt={version['image:alt']} />
                </div>
                <div className='spaceforarticle'>
                <span>
                  <h1 className="searchArticleLink">{renderDiff(currentArticleState.title, version.title)}</h1>
                  <span className="">
                    <p>{renderDiff(currentArticleState.pubdate, version.pubdate)}</p>
                    <p>guid: {renderDiff(currentArticleState.guid, version.guid)}</p>
                  </span>
                  <p>{renderDiff(currentArticleState.description, version.description)}</p>
                </span>
                {getAllUniqueKeys(currentArticleState, version).map((key) => {
                  if (
                      key !== 'title' &&
                      key !== 'link' &&
                      key !== 'image' &&
                      key !== 'description' &&
                      key !== 'sourceID' &&
                      key !== 'pubdate' &&
                      key !== 'guid' &&
                      key !== '_id'
                    ) 
                    {
                        const currentValue = currentArticleState[key];
                        const versionValue = version[key];

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
                ))}
        </div>
      ) : (null)}
      
    </div>
  );
};

export default ArticleComparison;
