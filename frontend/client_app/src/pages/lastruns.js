import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import '../css/lastruns.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function LastRuns({ name }) {

  const [lastRuns, setLastRuns] = useState([]);
  const [show, setShow] = useState(false);
  const [numofResults, setNumOfResults] = useState(10);

  const handleLastRuns = async () => {
    console.log(name);  // Log the name prop
    try {
      const response = await fetch(`http://localhost:5000/api/getRuns/${name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, number: numofResults })
      });

      if (response.ok) {
        const resData = await response.json();
        setLastRuns(resData);
        setShow(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleNumber = (event) => {
    const inputValue = event.target.value;
    // Kontrola, či je zadaná hodnota kladná
    if (inputValue >= 0) {
      setNumOfResults(inputValue);
    }
  };

  return (
    <div>
      <div className="lastRunsShow">
        <span style={{display: 'flex', alignItems:'center', padding: '5px', width:'88%'}}>
          <h3 style={{marginRight: '20px', marginLeft: '20px'}}>Zadajte počet záznamov</h3>
          <input type="number" placeholder="počet"  value={numofResults} onChange={handleNumber} style={{height: '30px', borderRadius: '5px'}}/>
        </span>
        <button className="dropbtn" style={{marginRight: '10px'}} onClick={handleLastRuns}>Vyhľadať</button>
      </div>
      <div className={show ? '' : 'nonactive'}>
        {lastRuns.map((run, index) => (
          <div key={index} className="lastRuns">
            <p>Name: {run.name}</p>
            <p>URL: {run.url}</p>
            <p>New Articles: {run.newArticles.length}</p>
            <p>Updated Articles: {run.updatedArticles.length}</p>
            <p>Creation Date: {new Date(run.creationDate).toLocaleString()}</p>
            <button  className='showbutton'>
              <Link to={`/lastRuns/${name}/${run.creationDate}`} state={{news: run.newArticles, update: run.updatedArticles}} style={{textDecoration: 'none', color: 'black'}}>  Zobraziť </Link>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LastRuns;
