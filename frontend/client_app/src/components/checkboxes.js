import React, { useState, useEffect } from "react";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


function Checkboxes({ onCheckboxChange }) {
  
  const [checkboxes, setCheckboxes] = useState({
    checkbox_prima: false,
    checkbox_novinky: false,
    checkbox_denik_zpravy: false,
    checkbox_denik_podnikani: false,
    checkbox_denik_sport: false,
    checkbox_denik_nazory: false,
    checkbox_denik_magazin: false,
  });  
  
  const handleCheckboxChange = (checkboxName) => {
    setCheckboxes((prevCheckboxes) => {
      const updatedCheckboxes = {
        ...prevCheckboxes,
        [checkboxName]: !prevCheckboxes[checkboxName],
      };
  
      // Check if the checkbox is active
      return updatedCheckboxes;
    });
  };

  useEffect(() => {
    onCheckboxChange(checkboxes);
  }, [onCheckboxChange, checkboxes]);

 return (
    <div className="Form">

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkboxes.checkbox_prima}
              onChange={() => handleCheckboxChange("checkbox_prima")}
            />
          }
          label={'Prima CNN'}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkboxes.checkbox_novinky}
              onChange={() => handleCheckboxChange("checkbox_novinky")}
            />
          }
          label={'Novinky.cz'}
        />
        
            <FormControlLabel
            control={
                <Checkbox
                checked={checkboxes.checkbox_denik_zpravy}
                onChange={() => handleCheckboxChange("checkbox_denik_zpravy")}
                />
            }
            label={'Denník.cz - Zprávy' }
            />
            <FormControlLabel
            control={
                <Checkbox
                checked={checkboxes.checkbox_denik_podnikani}
                onChange={() => handleCheckboxChange("checkbox_denik_podnikani")}
                />
            }
            label={'Denník.cz - Podnikání'}
            />
            <FormControlLabel
            control={
                <Checkbox
                checked={checkboxes.checkbox_denik_sport}
                onChange={() => handleCheckboxChange("checkbox_denik_sport")}
                />
            }
            label={'Denník.cz - Sport' }
            />
            <FormControlLabel
            control={
                <Checkbox
                checked={checkboxes.checkbox_denik_nazory}
                onChange={() => handleCheckboxChange("checkbox_denik_nazory")}
                />
            }
            label={'Denník.cz - Názory' }
            />
            <FormControlLabel
            control={
                <Checkbox
                checked={checkboxes.checkbox_denik_magazin}
                onChange={() => handleCheckboxChange("checkbox_denik_magazin")}
                />
            }
            label={'Denník.cz - Magazín' }
            />
        
      </FormGroup>
      
    </div>
  );
}

export default Checkboxes