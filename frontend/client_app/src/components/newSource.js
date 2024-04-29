import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import '../css/newSource.css'

function AddNewSource() {

    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [message, setMessage] = useState('');
    const [isTrue, setIsTrue] = useState(false);

    const handleNameChange = (event) => {
        setName(event.target.value);

    };
    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    };



    const handleNewData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/newSource', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, url: url }),
            })
            if (response.ok) {
                const jData = await response.json();
                console.log(jData);
                if (jData === true) {
                    setIsTrue(true)
                    window.location.reload();
                }
                else{
                    setIsTrue(false)
                }
                setMessage(jData);
                
                //
            }
            else {
                console.error('Nepodarilo sa spustiť proces');
            }
        }
        catch (error) {
            console.error('Chyba:', error);
        }
    }


    return (
        <div className="newSource">
                <div className="newSourceBox">
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'baseline',
                                '& > :not(style)': { m: 1 },
                                width: "fit-content",
                            }}
                        >
                            <TextField
                                helperText="Zadajte názov zdroja"
                                label="Názov"
                                onChange={handleNameChange}
                                
                            />
                            <TextField
                                helperText="Zadajte RSS adresu zdroja"
                                label="URL"
                                onChange={handleUrlChange}
                            />
                        </Box>
                        <Alert sx={{ width: "500px", margin: "auto", display: "none" }} id="alert" severity="error">Please enter data</Alert>
                        <Button variant="outlined" onClick={handleNewData} sx={{background: '#5588ff', color: 'black'}}>Pridať zdroj</Button>
                        { isTrue ? <p style={{color: 'black'}}>{message}</p> : <p style={{color: 'red'}}>{message}</p>}
                    </div>

            <div className="supportText">
                <h1>Vložte nový zdroj</h1>
                <p>Webový scraper získavá články z RSS záznamov</p>
                <p>Vložte si nový zdroj odkiaľ chcete dáta extrahovať</p>
                <p>Stačí len zadať <b>názov</b> a <b>RSS adresu</b> vybraného spravodajského portálu</p>
            </div>
        </div>
    );
}

export default AddNewSource;

// <Button variant="outlined" onClick={() => handleNewData(document.getElementById("nameField").value)}>Set Up</Button>