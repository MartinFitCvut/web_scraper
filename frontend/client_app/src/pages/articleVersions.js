import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { useLocation } from 'react-router-dom';

function ArticleVersions(){
    const dataToSend = { key: 'article_versions' };
    const [versionGuid, setVersionGuid] = useState('');
    const [articles, setArticles] = useState(null);
    const [currentArticle, setCurrentArticle] = useState('');
    const location = useLocation();

    const [startIndex, setStartIndex] = useState(0);
    const articlesPerPage = 10;
    //setVersionGuid(location);
    console.log(location.state);

    const handleNextClick = () => {
        setStartIndex(startIndex + articlesPerPage);
        
      };
    
      const handlePrevClick = () => {
        setStartIndex(Math.max(startIndex - articlesPerPage, 0));
       
      };

    useEffect(() => {
        setVersionGuid(location.state);
        searchForVersions()
    }, [])

    const searchForVersions = async() =>{
        try{
            const response = await fetch(`http://localhost:5000/api/versions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({versionguid: location.state})
            });
            if(response.ok){
                const data = await response.json()
                setArticles(data.versions);
                setCurrentArticle(data.current);
            }
            else {
                console.error('Nepodarilo sa poslať dáta');
            }
        }
        catch(error){
            console.log(error);
        }
    } 
   
    return(
        <div>
               <article>
                    {articles ? (
                    <div>
                    {articles.slice(startIndex, startIndex + articlesPerPage).map((article, index) => (
                      <div key={index}>
                        <article className="searchArticlePlace">
                        <h3 className="articleSourceId">{article.sourceID}</h3>
                        <div className="articleLinkAndImage">
                            <div className="searchArticleImage">
                              <img src={article.image} alt={article['image:alt']}/>
                            </div>
                            <div>
                              <span>
                                <h1 className="searchArticleLink">{article.title}</h1>
                                <span className="">
                                  <p>{article.pubdate}</p>
                                  <p>guid: {article.guid}</p>
                                </span>
                                <p>{article.description}</p>
                              </span> 
                            </div>
                        </div>
                        {Object.entries(article).map(([key, value]) => {
                            if (key !== 'title' && key !== 'link' && key !== 'image' && key !== 'description' && key !== 'sourceID' && key!== 'pubdate' && key!== 'guid' && key !== '_id') {
                            if(key === 'content'){
                                const htmlContent = value.replace(/<[^>]+>/g, '').trim();
                                return (
                                <div key={key}>
                                    <p><b>{key}</b>: {htmlContent}</p>
                                </div>
                                );}
                                else{
                                return(
                                    <div key={key}>
                                    <p><b>{key}</b>: {typeof value === 'string' ? value : JSON.stringify(value)}</p>
                                    </div>
                                );
                                }
                            }
                            return null;
                        })}
                        </article> 
                        </div>
                        ))}
                    <div>
                        <button onClick={handlePrevClick} disabled={startIndex === 0}>Previous</button>
                        <button onClick={handleNextClick} disabled={startIndex + articlesPerPage >= articles.length}>Next</button>
                    </div>
                    </div>
                    ):(null)
                    } 

                </article>
        </div>
    );
}

export default ArticleVersions;

