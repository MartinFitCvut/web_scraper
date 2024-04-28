import React from "react";
import { useEffect, useState } from "react";
import '../../css/cron.css';
import axios from "axios";
import RenderMinutes from "./renderMinutes";

function CronScheduler({scheduledCronValue}){

    const [textColor, setTextColor] = useState('black');

    const [ableSend, setAbleSend] = useState(false);
    const [onePerDay, setOnePerDay] = useState(true);
    const [minuteHour, setMinuteHour] = useState(true);

    const [cronValue, setCronValue] = useState('');
    const [testValues, setTestValues] = useState([]); 

    const [repHoureVal, setRepHoureVal] = useState({
        hour: 1,
        minutes: 0
    })


    const [minuteValues, setMinutesValues] = useState(1);
    const [hourValue, setHourValue] = useState(0);
    
    const handleFreqChange = (value) =>{
        setMinuteHour(value);
    }

    const handleMinuteValue = (event) =>{
        const value = event.target.value;
        if(value >= 5 && value <= 59){
            if(!ableSend){
                setAbleSend(true);
            }
            setMinutesValues(value);
            setCronValue(`*/${value} * * * *`);
            setTextColor('black');
            if(ableSend){
                scheduledCronValue(`*/${value} * * * *`);
            }
        }
        else{
            setAbleSend(false);
            setMinutesValues(value);
            setTextColor('red');
        }
    }

    const handleHourValue = (event) =>{
        if(!ableSend){
            setAbleSend(true);
        }
        const value = event.target.value.split(':');
        console.log(value[0]);
        setHourValue(value);
        setCronValue(`${value[1]} ${value[0]} * * *`);
        if(ableSend){
            scheduledCronValue(`${value[1]} ${value[0]} * * *`);
        }
    }

    const handleRepHourValue = (event, name) => {
        const value = event.target.value;
        console.log(value, name);
        if (name === 'hour' && (value <= 23 && value > 0)) {
          setRepHoureVal({ ...repHoureVal, [name]: value });
          if(repHoureVal.minutes >= 0 && repHoureVal.minutes <= 59){
            if(!ableSend){
                setAbleSend(true);
            }
            setCronValue(`${repHoureVal.minutes} */${value} * * *`);
            if(ableSend){
                scheduledCronValue(`${repHoureVal.minutes} */${value} * * *`);
            }
          }
          
        }
        if (name === 'minutes' && (value <= 59 && value >= 0)) {
          setRepHoureVal({ ...repHoureVal, [name]: value });
          if(repHoureVal.hour > 0 && repHoureVal.hour <= 24){
            if(!ableSend){
                setAbleSend(true);
            }
            setCronValue(`${value} */${repHoureVal.hour} * * *`);
            if(ableSend){
                scheduledCronValue(`${value} */${repHoureVal.hour} * * *`);
            }
          }
        }
      };
      

    const handleSendData = async() => {
            try{
                const response = await axios.post('http://localhost:5000/api/cronValuesTester/', {
                    value: cronValue
                }, {
                    headers: {
                      'Content-Type': 'application/json'
                        }
                    }
                )
                if (response.status == 200) {
                    const data = await response.data;
                    console.log(data);
                    setTestValues(data);
                    //console.log(testValues);
                  }
            }
            catch(error){
                console.log(error)
            }
    }

    useEffect(() => {
        handleSendData();
    }, [minuteValues, hourValue, repHoureVal])

    return(
        <div className="cronscheduler">
            <div className="cronbuttons">
                <button onClick={() => handleFreqChange(true)} className={minuteHour ? "activebutton" : "noactive"}>Minúty</button>
                <button onClick={() => handleFreqChange(false)} className={!minuteHour ? "activebutton" : "noactive"}>Hodiny</button>
            </div>
            <div>
                {minuteHour ? (
                    <div className="cronminutes">
                        <h3 style={{borderBottom: '1px solid #dedede', width: '95%'}}>Minúty</h3>
                        <p>▪️ Nastavovanie frekvencie iba v minútach</p>
                        <p>▪️ Scraper sa bude opakovane spúšťať každú <b>x-tú</b> minútu</p>
                        <p style={{marginBottom: '20px'}}>▪️ Nastavený počet minút automaticky zobrazí časový náhľad v akom bude scraper spúšťaný </p>
                        <span style={{display: 'flex', justifyContent: 'space-between', width: '50%', margin: 'auto', alignItems: 'baseline'}}>
                            <p>Každú: </p>
                            <input id='minutes' type="number" placeholder="počet v minútach" value={minuteValues} style={{height: '30px', color: `${textColor}`}} onChange={handleMinuteValue}></input>
                            <p>minútu</p>
                        </span>
                        <RenderMinutes values={testValues}/>
                    </div>

                ) : (<div className="cronminutes">
                    <h3 style={{borderBottom: '1px solid #dedede', width: '95%'}}>Presný čas alebo hodinové opakovanie<p style={{fontWeight: 'lighter', color: '##b1b1b1', fontSize: 'small'}}>* Možné zvoliť iba jednu z možností</p></h3>
                    
                    <p>▪️ Nastavenie presného času znamená, že sa scraper spustí raz za 24hod. v čase ktorý nastavíte</p>
                    <div className="cronOneDayDiv">
                        <input type="checkbox" checked={onePerDay} onChange={() => setOnePerDay(true)}/>
                        <p>Presný čas</p>
                        <input type="time" className="cronOneDay" onChange={handleHourValue} disabled={!onePerDay}/> 
                    </div>
                   
                    <p>▪️ Nastavenie spustí scraper každú <b>x-tú</b> hodinu v poradí pre nastavenú minútu</p>

                    <div className="cronOneDayDiv">
                        <input type="checkbox" checked={!onePerDay} onChange={() => setOnePerDay(false)}/> 
                        <p>Každú</p>
                        <input type="number" value={repHoureVal.hour} style={repHoureVal.hour < 1 || repHoureVal.hour > 24 ? ({color: 'red', width: '50px'}) : ({color: 'black', width: '50px'})} className="cronOneDay" disabled={onePerDay} onChange={(event) => handleRepHourValue(event, 'hour')}/>
                        <p>hodinu</p>
                        <input type="number" value={repHoureVal.minutes} className="cronOneDay" style={{width: '50px'}} disabled={onePerDay} onChange={(event) => handleRepHourValue(event, 'minutes')}/> 
                        <p>v minúte</p>
                    </div>

                    <RenderMinutes values={testValues}/>


                </div>)}
            </div>
        
        </div>
    );    
}

export default CronScheduler;