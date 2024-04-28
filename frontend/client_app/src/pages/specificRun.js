import React from "react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ArticleComparison from "../components/articleComparison";
import OneArticleComparison from "../components/UpdatedArticleComparison";
import { Link } from 'react-router-dom';
import DownloadButton from "../components/download";
import download from '../images/download.png';
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
    const [activeItems, setActiveItems] = useState([]);
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
            setNewArticles(data.newarticles);
            setUpdatedArticles(data.updatearticles);
            setNew_Update(data.newUpdatearticles);   
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
    };

    const toggleItem = (index) => {
        if (activeItems.includes(index)) {
            setActiveItems(activeItems.filter(item => item !== index));
        } else {
            setActiveItems([...activeItems, index]);
        }
    };

    useEffect(()=>{
        handleRunsSpecific();
    },[])

    return(
        <div className='version_articles'>
            <button onClick={() => setNews(true)}>Novo pridané články</button>
            <button onClick={() => setNews(false)}>Zmenené články</button>
            {news ? (
                <div>
                  <h2>Novo pridané články</h2>
                  <ArticleView articles={newArticles}/>
                </div>
                ) : (

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
            )}

           
        </div>
    );    
}

export default SpecificRun;


/*
                <article>
                    {newArticles.map((newarticles, index) => (
                      <div key={index}>
                        <article className="searchArticlePlace">
                          <h3 className="articleSourceId">{newarticles.sourceID}</h3>
                          <div className="articleLinkAndImage">
                            <div className="searchArticleImage">
                              <img src={newarticles.image} alt={newarticles['image:alt']}/>
                            </div>
                            <div style={{position: 'sticky', padding: '20px'}}>
                              <span>
                                <h1 className="searchArticleLink">{newarticles.title}</h1>
                                <span className="searchArticleDateGuid">
                                  <p>{newarticles.pubdate}</p>
                                  <p>guid: {newarticles.guid}</p>
                                </span>
                                <p>{newarticles.description}</p>
                                {activeItems.includes(index) &&  (
                                  <div>
                                  {Object.entries(newarticles).map(([key, value]) => {
                                    if (key !== 'title' && key !== 'link' && key !== 'image' && key !== 'description' && key !== 'sourceID' && key !== 'site_name' && key !== 'type' && key !== 'category' && key!== 'image:height' && key !== 'image:width' && key!== 'image:alt' && key!== 'pubdate' && key!== 'guid') {
                                      if(key === 'content'){
                                        //const htmlContent = value.replace(/<[^>]+>/g, '').trim();
                                        return (
                                          <div key={key}>
                                            <p><b>{key}</b>: {value}</p>
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
                                  </div>
                                )}
                                      <button className='moreButton' onClick={() => toggleItem(index)}>
                                          {activeItems.includes(index) ? 'Menej' : 'Viac'}
                                      </button>
                                      
                            
                                    <Link to={newarticles.link} target="_blank" style={{width: '100px', marginRight: '20px'}}>
                                      <button className="moreButton"> Odkaz </button>
                                    </Link>
                                    <Link to={`/versions`} state={newarticles.guid} style={{width: '100px', marginRight: '20px'}}> 
                                      <button className="moreButton"> Versions </button>
                                    </Link>
                                    <div className="dropdown">
                                      <img src={download} className="dropbtn"/>  
                                      <div className="dropdown-content">
                                        <DownloadButton data={newarticles} format="json" filename={'article_JSON_' + newarticles.guid} />
                                        <DownloadButton data={[newarticles]} format="csv" filename={'article_CSV_' + newarticles.guid}/>
                                        <DownloadButton data={[newarticles]} format="xml" filename={'article_XML_' + newarticles.guid}/>
                                      </div>
                                  </div>
                                  
                                  
                                
                              </span> 

                            </div>
                    
                          </div>
                          
                        </article>           
                      </div>
                        ))}
                  
                   
                    </article>


                    */