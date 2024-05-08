import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import ArticleComparison from '../components/articleComparison.js';
import axios from "axios";

function ArticleVersions(){
    const [versionGuid, setVersionGuid] = useState('');
    const [articles, setArticles] = useState(null);
    const [currentArticle, setCurrentArticle] = useState(null);
    const location = useLocation();

    useEffect(() => {
        setVersionGuid(location.state);
        searchForVersions();
    }, [])

    const searchForVersions = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/versions', {
                versionguid: location.state
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 200) {
                const data = response.data;
                console.log(data.versions);
                console.log(data.current);
                setArticles(data.versions);
                setCurrentArticle(data.current);
            } else {
                console.error('Nepodarilo sa poslať dáta');
            }
        } catch (error) {
            console.error('Chyba:', error);
        }
    };
   
    return(
        <div>
            {articles && currentArticle ? (<ArticleComparison currentArticle={currentArticle} articleVersions={articles} />) : (<p>No data</p>) }        
        </div>
    );
}

export default ArticleVersions;

