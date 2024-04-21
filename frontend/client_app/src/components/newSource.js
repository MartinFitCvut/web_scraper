import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import  Button  from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import './newSource.css'

function AddNewSource(){

    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [message, setMessage] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
        
    };
    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    };

   

    const handleNewData = async() =>{
        try{
            const response = await fetch('http://localhost:5000/api/newSource', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: name, url: url}),
            })
            if(response.ok){
                const jData = await response.json();
                console.log(jData);
                setMessage(jData);
                if(jData === true){
                    window.location.reload();
                }
                //
            }
            else {
                console.error('Nepodarilo sa spustiť proces');
              }
        }
        catch(error) {
            console.error('Chyba:', error);
        }    
    }
    

    return(
        <div className="newSource">
        <h3>Add new scraper source</h3>
        <Box
        sx={{
            display: 'flex',
            alignItems: 'baseline',
            '& > :not(style)': { m: 1 },
            margin: "auto",
            width: "fit-content",
          }}
        >
        <TextField
          helperText="Please enter your name"
          label="Name"
          onChange={handleNameChange}
          
        />
        <TextField
          helperText="Please enter new url"
          label="URL"
          onChange={handleUrlChange}
          
        />
    

        </Box>
        <Alert sx={{width: "500px", margin:"auto", display: "none"}} id="alert" severity="error">Please enter data</Alert>
        <Button variant="outlined" onClick={handleNewData}>Set Up</Button>
        <p>{message}</p>

      </div>
    );
}

export default AddNewSource;

// <Button variant="outlined" onClick={() => handleNewData(document.getElementById("nameField").value)}>Set Up</Button>