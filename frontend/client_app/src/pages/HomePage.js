import React from "react";
import { useState, useEffect } from "react";
import SourcesBox from "../components/sourcesBox";
import AddNewSource from "../components/newSource";
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import '../css/homepage.css';


function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const arrowClass = scrollY > 50 ? 'arrow hideArrow' : 'arrow';
  
  const handleNextScroll = () => {
    setScrollY(800);
    window.scrollTo({
      top: 800,
      behavior: 'smooth'
    })
  } 


 return (
    <div className="App">
      <div className="homepage">
      </div>
      <div className="mainIntro">
        <div className="mainIntroTitle"> 
          <h1>Majte dnešné aktuality rýchlo a podľa vašich špecifikácií </h1>
          <p>Webový scraper získava články z RSS záznamov spravodajských portálov a na základe Vašich špecifikácií a nastavení dáta z článkov extrahuje.</p>  
        </div>
        <div className="mainIntroImage"> 
        </div>
        <img className="scraperimage" src={require('../images/pcscraper.png')} />
      </div>
      <div className={arrowClass} onClick={handleNextScroll}>
        <p>Pokračovať</p>
        <p>🢃</p>
      </div>
      <AddNewSource/>
      <SourcesBox />      
     </div>
    
  );
}

export default HomePage