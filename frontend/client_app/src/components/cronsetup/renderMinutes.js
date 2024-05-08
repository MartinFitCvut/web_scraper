import React from "react";

//Formát zobrazovania času
function RenderMinutes({values}){

    const formatDate = (date) => {
        const options = {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
       
        };
        return date.toLocaleString(undefined, options);
    }
    
    return(
        <div className="resultDates">
            <h4>Náhľad nastavenia</h4>
            <div className="resultDatesCenter">
                {values && values.map((item, index) => (
                <p key={index}>{formatDate(new Date(item))}</p>))}
            </div>
        </div>  
    );
}

export default RenderMinutes;