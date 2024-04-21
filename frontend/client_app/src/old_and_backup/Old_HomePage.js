import React, { useState, useEffect } from "react";
import Checkboxes from "../components/checkboxes";
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
//import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import SetRssDatabase from "../pages/setRssDatabase";
import {Outlet, json} from "react-router-dom";
import { Button } from "@mui/material";

function HomePage() {

  const [message, setMessage] = useState(""); 
  const [frequency, setFrequency] = useState('5');
  const [checkboxes, setCheckboxes] = useState({
    checkbox_prima: false,
    checkbox_novinky: false,
    checkbox_denik_zpravy: false,
    checkbox_denik_podnikani: false,
    checkbox_denik_sport: false,
    checkbox_denik_nazory: false,
    checkbox_denik_magazin: false,
  });  

  const [downloadMethods, setDownloadMethods] = useState({
    json: false,
    mongodb: false,
  })
  
  
  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  
  const handleCheckboxChange = (checkboxValues) => {
    setCheckboxes(checkboxValues);
  };

  const handleFrequencyChange = (event) => {
    setFrequency(event.target.value);
  };

  const handleMethodChange = (methodValue) => {
    setDownloadMethods((prevCheckboxes) => {
      // Create a new object to store the updated checkbox states
      const updatedCheckboxes = {};
      // Iterate over each key in prevCheckboxes
      Object.keys(prevCheckboxes).forEach((key) => {
        // Toggle the value of the current checkbox if it's the same as methodValue
        updatedCheckboxes[key] = key === methodValue ? !prevCheckboxes[key] : false;
      });
      // If the clicked checkbox was previously unchecked, check it
      if (!prevCheckboxes[methodValue]) {
        updatedCheckboxes[methodValue] = true;
      }
      // Log the updated checkboxes object
      console.log(updatedCheckboxes);
      // Return the updated checkboxes object
      return updatedCheckboxes;
    });
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can use the value of 'frequency' here for further processing
    console.log('Frequency:', frequency);
  };
  
  const sendDataToServer = async () => {
    try {
      const valuesToSend = {
        checkboxes, 
        frequency,
      }
      const response = await fetch('http://localhost:5000/api/postData', {
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
    <div className="App">
      <h1>{message}</h1>
      <p>Táto stránka vám zatiaľ pracuje len s RSS dátami</p>
      <p>Spôsob uloženia dát</p>

        {/*
        <FormControlLabel control={<Checkbox  checked={downloadMethods.json} onChange={() => handleMethodChange("json")}/>} label="JSON" />
        <FormControlLabel control={<Checkbox  checked={downloadMethods.mongodb} onChange={() => handleMethodChange("mongodb")}/>} label="MongoDB" />
        {downloadMethods.mongodb && <SetRssDatabase />}
        * */}
        <SetRssDatabase />
       <Outlet/>


      <Checkboxes onCheckboxChange={handleCheckboxChange} />

      <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }}
        noValidate
        onSubmit={handleSubmit}
        autoComplete="off"
      >
      
      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <OutlinedInput
            id="outlined-adornment-weight"
            endAdornment={<InputAdornment position="end">min</InputAdornment>}
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              'aria-label': 'weight',
            }}
            onChange={handleFrequencyChange}  
            defaultValue={5}
            />
            <FormHelperText id="outlined-weight-helper-text">Frekvencia</FormHelperText>
        </FormControl>
        </Box>

      <Button onClick={sendDataToServer}>Spustiť</Button> 
      
     </div>
    
  );
}

export default HomePage