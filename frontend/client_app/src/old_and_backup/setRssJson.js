import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

function SetRssJson() {
    const [databaseName, setDatabaseName] = useState(""); 
    const [primaCnnCollection, setPrimaCnnCollection] = useState(""); 
    const [novinkyCollection, setNovinkyCollection] = useState(""); 
    const [denikCollection, setDenikCollection] = useState(""); 

    const handleDatabaseNameChange = (event) => {
        setDatabaseName(event.target.value);
    }

    const handlePrimaCollectionChange = (event) => {
        setPrimaCnnCollection(event.target.value);
    }

    const handleNovinkyCollectionChange = (event) => {
        setNovinkyCollection(event.target.value);
    }

    const handleDenikCollectionChange = (event) => {
        setDenikCollection(event.target.value);
    }

    const sendDataToServer = async () => {
        try {
          const valuesToSend = {
            databaseName,
            primaCnnCollection,
            novinkyCollection,
            denikCollection,
          }
          const response = await fetch('http://localhost:5000/api/setDatabase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(valuesToSend),
          });
    
          if (response.ok) {
            const responseData = await response.json();
            console.log(responseData.message);
          } else {
            console.error('Failed to send data to the server');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    return (
        <div className="Setup">
            <p>Pre túto variantu budú dáta ukladané do JSON file. Každý zdroj má špecifický JSON file do ktorého budú dáta ukladané</p>
            <Button variant="contained" endIcon={<SendIcon />} onClick={sendDataToServer}> Send </Button>
        </div>
  );
}

export default SetRssJson;
