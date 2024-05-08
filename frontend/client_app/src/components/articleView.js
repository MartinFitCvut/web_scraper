import React from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import DownloadButton from "../components/download";


function ArticleView({articles}){
    const [activeItems, setActiveItems] = useState([]);

    const toggleItem = (index) => {
        if (activeItems.includes(index)) {
            setActiveItems(activeItems.filter(item => item !== index));
        } else {
            setActiveItems([...activeItems, index]);
        }
    };
    
    return(

        <article>
                {articles && articles.map((articles, index) => (
                  <div key={index}>
                    <article className="searchArticlePlace">
                      <h3 className="articleSourceId">{articles.sourceID}</h3>
                      <div className="articleLinkAndImage">
                        <div className="searchArticleImage">
                          <img src={articles.image} alt={articles['image:alt']}/>
                        </div>
                        <div style={{position: 'sticky', padding: '20px'}}>
                          <span>
                            <h1 className="searchArticleLink">{articles.title}</h1>
                            <span className="searchArticleDateGuid">
                              <p>{articles.pubdate}</p>
                              <p>guid: {articles.guid}</p>
                            </span>
                            <p>{articles.description}</p>
                            {activeItems.includes(index) &&  (
                              <div>
                              {Object.entries(articles).map(([key, value]) => {
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
                                  <button className='moreButton' style={{ width: '100px', marginRight: '20px' }} onClick={() => toggleItem(index)}>
                                    {activeItems.includes(index) ? 'Menej' : 'Viac'}
                                  </button>
                                  <Link to={articles.link} target="_blank" style={{ width: '100px', marginRight: '20px' }}>
                                    <button className="moreButton"> Odkaz </button>
                                  </Link>
                                  <Link to={`/versions`} state={articles.guid} style={{ width: '100px', marginRight: '20px' }}>
                                    <button className="moreButton"> Verzie </button>
                                  </Link>
                                
                                <div className="dropdown">
                                  <button className="dropbtn"> Stiahnuť </button>
                                  <div className="dropdown-content">
                                    <DownloadButton data={articles} format="json" filename={'article_JSON_' + articles.guid} />
                                    <DownloadButton data={[articles]} format="csv" filename={'article_CSV_' + articles.guid}/>
                                    <DownloadButton data={[articles]} format="xml" filename={'article_XML_' + articles.guid}/>
                                  </div>
                                </div>
                          </span> 
                        </div>
                      </div>
                    </article>           
                  </div>
                    ))}
                </article>
        
    );

}

export default ArticleView;