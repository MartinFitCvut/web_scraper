import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

function SetRssDatabase() {
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
            <p>Pre túto variantu je potrebné mať vytvorenú MongoDB databázu do ktorej sa RSS údaje budú ukladať. Ak tak ešte nemáte, prosím vytvorte si databázu. </p>
            <TextField label="Databáza" value={databaseName} onChange={handleDatabaseNameChange} required id="required_database" helperText="Názov MongoDB databázi" />
            <div className="DataSetup">
                <TextField label="PrimaCNN" value={primaCnnCollection} onChange={handlePrimaCollectionChange} required id="required_prima" helperText="Názov kolekcie pre Prima CNN - RSS"/>
                <TextField label="Novinky.cz" value={novinkyCollection} onChange={handleNovinkyCollectionChange} required id="required_novinky" helperText="Názov kolekcie pre Novinky.cz - RSS"/>
                <TextField label="Denik.cz" value={denikCollection} onChange={handleDenikCollectionChange} required id="required_denik" helperText="Názov kolekcie pre Denik.cz - RSS"/>
            </div>
            <Button variant="contained" endIcon={<SendIcon />} onClick={sendDataToServer}> Send </Button>
        </div>
  );
}

export default SetRssDatabase;
