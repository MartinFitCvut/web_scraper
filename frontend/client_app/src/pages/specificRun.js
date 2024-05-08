import React from "react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import OneArticleComparison from "../components/UpdatedArticleComparison";
import ArticleView from "../components/articleView";

function SpecificRun(){
    const [newArticles, setNewArticles] = useState('');
    const [updatedArticles, setUpdatedArticles] = useState('');
    const [new_update, setNew_Update] = useState('');
    const [news, setNews] = useState(true);
    const location = useLocation();
    const data = location.state;
    const { name } = useParams();
    const { creation } = useParams();
    console.log(name, creation, data);

    const handleRunsSpecific = async() => {
        try {
          const response = await axios.post(`http://localhost:5000/api/getSpecificRun/${name}`, {
            name: name,
            newArticles: data.news,
            updatedArticles: data.update,
            exec_date: new Date(creation)
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          if (response.status == 200) {
            const data = await response.data;
            console.log(data.newarticles);
            setNewArticles(data.newarticles);
            setUpdatedArticles(data.updatearticles);
            setNew_Update(data.newUpdatearticles);   
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
    };


    useEffect(()=>{
        handleRunsSpecific();
    },[])

    return(
        <div className='version_articles'>
            <button className={news ? 'lastrunsbuttonsactive' : 'lastrunsbuttons'} onClick={() => setNews(true)}>Novo pridané články</button>
            <button className={news ? 'lastrunsbuttons' : 'lastrunsbuttonsactive'} onClick={() => setNews(false)}>Zmenené články</button>
            {news ? (
              newArticles && newArticles.length > 0 ? (
                <div>
                  <h2>Novo pridané články</h2>
                  <ArticleView articles={newArticles}/>
                </div>) 
                : 
                (<h1 style={{color: 'darkred'}}>Neboli pridané žiadne nové články</h1>)
                
                ) : (
                  new_update && new_update.length > 0 ? (
                  <div>
                    {new_update && new_update.map((article, index) => {
                        // Nájdite odpovedajúci záznam v updatedArticles na základe guid
                        const updatedArticle = updatedArticles.find(updatedArticle => updatedArticle.guid === article.guid);
                        
                        // Ak sa nájde odpovedajúci záznam, zavolajte komponent ArticleComparison
                        if (updatedArticle) {
                        return (
                            <OneArticleComparison key={index} currentArticle={article} articleVersions={updatedArticle} />
                        );
                        } else {
                        // Ak sa pre článok nenájde žiadna verzia, zobrazte správu o chýbajúcich dátach
                        return (
                            <p key={index}>No corresponding version found for article with guid {article.guid}</p>
                        );
                        }
                    })}
                </div>
                ) : (<h1 style={{color: 'darkred'}}>Neboli upravené žiadne články</h1>)
                
            )}

           
        </div>
    );    
}

export default SpecificRun;
