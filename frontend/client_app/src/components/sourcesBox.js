import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/Tune';
import Tooltip from '@mui/material/Tooltip';

function SourcesBox() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData("http://loalhost:5000");
  }, []);

    const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (name) => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete/Source/${name}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Aktualizovať údaje po vymazaní
        await fetchData();
      } else {
        console.error('Nepodarilo sa vymazať zdroj');
      }
    } catch (error) {
      console.error('Chyba:', error);
    }
  };

  return (
    <div>
      {data.map((item, index) => (
        <DataComponent key={index} data={item} handleDelete={handleDelete} />
      ))}
    
    </div>
  );
};

function DataComponent({ data, handleDelete }) {
    return (
    <div>
      <div className={`sourcesBox ${data.enabled === 'run' ? ('active') : data.enabled === 'wait' ? ('wait') : ('')}`}>
        <div className="sourcesBoxButton">
          {/* Použitie komponentu Link pre presmerovanie */}
          <Link to={`/setActive/${data.name}`} className={data.enabled === 'run' ? 'active-text' : ''}>
            <TuneIcon color="default" fontSize="large"/>
          </Link>
        </div>
        <div className="sourcesBoxDiv">
          <Tooltip className={data.enabled === 'run' ? 'active-text' : ''} title={data.url} placement="top" sx={{fontSize: '25px'}}>
            <p className={data.enabled === 'run' ? 'active-text' : ''}>Zdroj: {data.name}</p>
          </Tooltip>
          <p className={data.enabled === 'run' ? 'active-text' : ''}>Aktívny: {data.enabled === 'run' ? ('Áno') : data.enabled === 'stop' ? ('Nie') : data.enabled === 'wait' ? ('čaká') : (null)}</p>
          <p className={data.enabled === 'run' ? 'active-text' : ''}>Frekvencia: {data.frequency}</p>
        </div>
        <IconButton aria-label="delete" size="large" onClick={() => handleDelete(data.name)}>
            <DeleteIcon fontSize="inherit" />
        </IconButton>
        
      </div>
      
    </div>
    );
}



export default SourcesBox;
