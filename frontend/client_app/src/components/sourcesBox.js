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
    <div className="yourSources"> 
      <div style={{textAlign: 'left', marginRight: '20px'}}>
        <h1>Vaše zdroje</h1>
        <p>Vaše uložené zdroje, ktoré zobrazujú v akom stave scraper je</p>
        <p>Cez tieto zdroje sa dostaneme do nastavení scrapera</p>
      </div>
      <div style={{marginTop: '50px'}}>
        {data.map((item, index) => (
          <DataComponent key={index} data={item} handleDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

function DataComponent({ data, handleDelete }) {
    return (
    <div>
      <div className={`sourcesBox ${data.enabled === 'run' ? ('active') : data.enabled === 'wait' ? ('wait') : ('')}`}>
        <div className="sourcesBoxButton">
          <Tooltip title={<p style={{fontSize: '14px'}}>Nastavenie zdroja. Tu si nastavíte ako scraper bude extrahovať dáta z článkov</p>} placement="top" arrow>
            <Link to={`/setActive/${data.name}`} className={data.enabled === 'run' ? 'active-text' : ''}>
              <TuneIcon color="default" fontSize="large"/>
            </Link>
          </Tooltip>
          
        </div>
        <div className="sourcesBoxDiv">
          <Tooltip className={data.enabled === 'run' ? 'active-text' : ''} title={<p style={{fontSize: '14px'}}>{data.url}</p>} placement="top" sx={{fontSize: '25px'}} arrow>
            <p className={data.enabled === 'run' ? 'active-text' : ''}>Zdroj: {data.name}</p>
          </Tooltip>
          <Tooltip arrow placement="top" title={<p style={{fontSize: '14px'}}>Aktuálny stav v akom sa zdroj nachádza</p>}>
            <p className={data.enabled === 'run' ? 'active-text' : ''}>Aktívny: {data.enabled === 'run' ? ('Áno') : data.enabled === 'stop' ? ('Nie') : data.enabled === 'wait' ? ('čaká') : (null)}</p>
          </Tooltip>
          <Tooltip arrow placement="top" title={<p style={{fontSize: '14px'}}>Nastavená frekvencia vo forme <b>cron</b>. Pre viac informácií kliknite sem</p>}>
            <p className={data.enabled === 'run' ? 'active-text' : ''}>Frekvencia: {data.frequency}</p>
          </Tooltip>
          
        </div>
        <Tooltip arrow placement="top" title={<p style={{fontSize: '14px'}}>Zmazanie zdroja</p>}>
          <IconButton aria-label="delete" size="large" onClick={() => handleDelete(data.name)}>
              <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        
        
      </div>
      
    </div>
    );
}



export default SourcesBox;
