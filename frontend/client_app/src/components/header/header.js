import React, { useState, useEffect, useRef } from "react";
import '../../css/header.css'
import logo from '../../images/homeIcon.png'
import { Link } from "react-router-dom";
import axios from "axios";


function Header(){

    const [sources, setSources] = useState([]);

    const handleGetData = async() =>{
        try {
            const response = await axios.get(`http://localhost:5000/`,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            });
        
            if (response.status == 200) {
              const data = await response.data;
              setSources(data);
              console.log(data);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
    }

    useEffect(() => {
        handleGetData();
    },[]);

    return(
    
        <div className="header">
            
            <nav className="menu">
                <span className='homeButtonIcon'>
                    <Link to='/' style={{textDecoration: 'none', color: 'black'}}>
                        <img src={logo} className="homeIcon"/>  
                    </Link>
                </span> 
                <div className="homeButtonText">
                    <div className="dropdownheader">
                        <button className="dropbtnheader">Vaše zdroje</button>
                        <div className="dropdownheader-content">   
                                {sources.map((source, index) => (
                                        <a href={`/setActive/${source.name}`} key={index}>
                                            <p>{source.name}</p>
                                        </a>
                                    
                                ))}
                        </div>
                    </div> 
                    <span className="homeButtonTextElements">
                        <Link to='/docs/general'style={{textDecoration: 'none', color: 'black'}} state={'search'}>Dokumentácia</Link>
                    </span>
                        
                    <span className="homeButtonTextElements">
                        <Link to='/search'style={{textDecoration: 'none', color: 'black'}} state={'search'}>Zobraziť články</Link>
                    </span>
                </div>
            </nav>        
        </div>   
             
    );
}

export default Header;