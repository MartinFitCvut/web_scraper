import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import '../css/lastruns.css'

function LastRuns({ name }) {
 

  const [lastRuns, setLastRuns] = useState([]);
  const [show, setShow] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const handleLastRuns = async () => {
    console.log(name);  // Log the name prop
    try {
      const response = await fetch(`http://localhost:5000/api/getRuns/${name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
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
  const toggleItem = (index) => {
    setActiveItem(activeItem === index ? null : index);
  };

  return (
    <div>
      <button onClick={handleLastRuns}>Poslené behy</button>
      <button onClick={() => {setShow(!show)}} className="showbutton" >{show ? (<p>skryť</p>):(<p>zobraziť</p>)}</button>
      <div className={show ? '' : 'nonactive'}>
        {lastRuns.map((run, index) => (
          <div key={index} className="lastRuns">
            <p>Name: {run.name}</p>
            <p>URL: {run.url}</p>
            <p>New Articles: {run.newArticles.length}</p>
            <p>Updated Articles: {run.updatedArticles.length}</p>
            <p>Creation Date: {new Date(run.creationDate).toLocaleString()}</p>
            <button  className='showbutton' onClick={() => toggleItem(index)}>
              {activeItem === index ? 'Skryť' : 'Zobraziť'}
            </button>
            {activeItem === index && (
              <div>
                
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LastRuns;
