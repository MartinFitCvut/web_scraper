import React from "react";
import SourcesBox from "../components/sourcesBox";
import AddNewSource from "../components/newSource";
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';


function HomePage() {
 return (
    <div className="App">
      <h1>Vitajte</h1>
      <h2>Zdroje</h2>
      <AddNewSource/>
      <SourcesBox />      
     </div>
    
  );
}

export default HomePage