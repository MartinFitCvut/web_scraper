import React, { useState} from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
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
        const checkName = name.trim();
        if (checkName !== '') {
            try {
                const response = await axios.post('http://localhost:5000/api/newSource', {
                    name: name,
                    url: url
                });
    
                if (response.status === 200) {
                    const jData = response.data;
                    console.log(jData);
                    if (jData === true) {
                        setIsTrue(true);
                        window.location.reload();
                    } else {
                        setIsTrue(false);
                    }
                    setMessage(jData);
                } else {
                    console.error('Nepodarilo sa spustiť proces');
                }
            } catch (error) {
                console.error('Chyba:', error);
            }
        } else {
            setMessage('Nemáte vyplnené všetky údaje');
            setTimeout(() => {
                setMessage('');
            }, 4000);
        }
    };


    return (
        <div className="newSource">
                <div className="newSourceBox">
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
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
                                label="RSS"
                                onChange={handleUrlChange}
                            />
                            <Tooltip title={<Link to="/docs/tutorial#newsource" style={{textDecoration: 'none', color:'white', fontSize:'14px', ':hover': {color: '#89CFF0'}}}>Pridajte adresu RSS kanálu. Pre viac INFO kliknite na sem</Link>}>
                                <p style={{margin: '0px', fontSize: '20px', cursor: 'pointer'}}>🛈</p>
                            </Tooltip>
                            
                        </Box>
                        <Alert sx={{ width: "500px", margin: "auto", display: "none" }} id="alert" severity="error">Please enter data</Alert>
                        <Button variant="outlined" onClick={handleNewData} sx={{background: '#5588ff', color: 'black'}}>Pridať zdroj</Button>
                        { isTrue ? <p style={{color: 'black'}}>{message}</p> : <p style={{color: 'red'}}>{message}</p>}
                    </div>

            <div className="supportText">
                <h1>Vložte nový RSS zdroj</h1>
                <p>Webový scraper získavá články z <b>RSS</b> záznamov</p>
                <p>Vložte si nový zdroj odkiaľ chcete dáta extrahovať</p>
                <p>Stačí len zadať <b>názov</b> a <b>RSS adresu</b> vybraného spravodajského portálu</p>
            </div>
        </div>
    );
}

export default AddNewSource;
