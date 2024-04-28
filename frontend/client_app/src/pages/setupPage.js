import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
//import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { format } from 'date-fns';
import LastRuns from "./lastruns";

//import SSEComponent from '../components/currentRuns';



function SetupPage() {
  const [bla, setBla] = useState(false);
  const [loading, setLoading] = useState(false);
  const { name } = useParams();
  const [data, setData] = useState(null);
  const [responseData, setResponceData] = useState('');
  const [isActive, setIsActive] = useState('');
  const [frequency, setFrequency] = useState('');
  const [frequencyHour, setFrequencyHour] = useState('');
  const [activeNow, setActiveNow] = useState(null);
  const [rssData, setRssData] = useState('');
  const [semanticsData, setSemanticsData] = useState('');
  const [checked, setChecked] = useState({
    onlyRSS: false,
    onlySemantics: false,
    rssAndSemantics: false
    });
  const [ableSend, setAbleSend] = useState(true);
  const [address, setAddress] = useState('');
  //const [setupdata, setSetupData] = useState('');
  const textareaRef = useRef(null);
  const [additionalData, setAdditionalData] = useState('');
  const [userInput, setUserInput] = useState({
    title: {source: ''},
    link: {source: ''},
    description: {source: ''}
  });
  const [mandatoryData, setMandatoryData] = useState({
    title: {source: ''},
    link: {source: ''},
    description: {source: ''}
  });
  const [helpSearch, setHelpSearch] = useState('');
  const [helpFindData, setHelpFindData] = useState('');
  const [showDataAsArticle, setShowDataAsArticle] = useState(true);
  const [combinedData, setCombinedData] = useState('');
  const [dataForm, setDataForm] = useState('insight');
  const [useJavaScript, setUseJavaScript] = useState(false);

  let timeout;

  const [err, setErr] = useState({
    title: false,
    link: false,
    des: false,
    other: false,
  });

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:5000/events/${name}`);
    eventSource.onopen = function(event) {
      console.log('Spojenie bolo úspešne nadviazané');
    };
    eventSource.onerror = function(event){ console.log("Error nepreipojené") }
    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      const newMessage = data.status;
      if(newMessage === 'run'){
        setIsActive('Scraper aktívne pracuje');
      }
      else if(newMessage === 'wait'){
        setIsActive('Scraper je v stave čakania');
      }
      else{
        setIsActive('Scraper je zastavený');
      }
    };
    return () => {
      console.log("Zatváram");
      eventSource.close();
    };
  }, [name]);

  const handleHelpSearchData = (event) => {
    const value = event.target.value;
    clearTimeout(timeout);
      timeout = setTimeout(() => {
        setHelpSearch(value);
        //console.log(helpSearch);
      }, 1000);
      
  }

/*
  const handleMandatoryArea = (event, name) => {
      const value = event.target.value.trim();
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setMandatoryData(prevState => ({
          ...prevState,
          [name]:{ source: value}
        }));
        console.log(value);
        console.log(mandatoryData);
        setChecked({
          onlyRSS: false,
          onlySemantics: false,
          rssAndSemantics: false
        });
        setActiveNow('clientConfig');
        //setActiveNow("");
      }, 500);
    //console.log(mandatoryData);
    //const mandatoryDataToJSON = JSON.stringify(mandatoryData, null, 2);
    //console.log(mandatoryDataToJSON);
  }*/
  /*
  const handleMandatoryArea = (name) => {
    const value = userInput[name].source;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // Update the mandatoryData state after the delay
      setMandatoryData((prevState) => ({
        ...prevState,
        [name]: { source: value },
      }));
    }, 500);
  };*/

  const handleUserInputChange = (event, name) => {
    if(bla === false){
      setBla(true);
    }
    
    const value = event.target.value;
    console.log(value);
    setUserInput((prevState) => ({
      ...prevState,
      [name]: { source: value },
    }));
  };

  let debounceTimer;

  const debounce = (func, delay) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      func();
    }, delay);
  };

  
  useEffect(() => {
    if(bla === true){
    debounce(() => {
        console.log(userInput);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setMandatoryData(userInput);
          console.log(mandatoryData);
          setChecked({
            onlyRSS: false,
            onlySemantics: false,
            rssAndSemantics: false
          });
          setActiveNow('clientConfig');
          //setActiveNow("");
        }, 500);
    }, 500);
    // Cleanup
    return () => {
      clearTimeout(debounceTimer);
    };
  }
  }, [userInput]);


  const handleTextArea = (event) => {
    console.log("Additional data");
    const value = event.target.value; // Trim whitespace from start and end
    const regex = /(?:"([^"]+)"|([\w:]+)):\s*([^\s;]+(?:\s+[^\s;]+)*)/g;
    let match;
    let jsonData = {};

    // Check if the input is not just empty or whitespace before proceeding
    if (value !== '') {
        while ((match = regex.exec(value)) !== null) {
            // Ensure matched value is not just whitespace or newline
            if (match[2] && match[3].trim() !== '') {
                const name = match[1] || match[2]; // If match[1] is undefined, use match[2]
                const val = match[3].trim(); // Trim value to remove leading/trailing whitespace
                jsonData[name] = { source: val };
            }
        }
    }
    
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        // Use JSON.stringify only if jsonData is not empty
        const additionalDataValue = Object.keys(jsonData).length === 0 ? '' : JSON.stringify(jsonData, null, 2);

        setAdditionalData(additionalDataValue);

        setChecked({
            onlyRSS: false,
            onlySemantics: false,
            rssAndSemantics: false
        });
        setActiveNow('clientConfig');
        console.log(additionalData);
    }, 1000);
};



  const handlaConfigEmptyData = () => {  
    if(mandatoryData.title.source === '' && mandatoryData.link.source === '' && mandatoryData.description.source === '' && additionalData === '' && activeNow !== null){
      setActiveNow('noData');
    } 
    //else if(activeNow === 'noData' && (mandatoryData.title.source !== '' || mandatoryData.link.source !== '' || mandatoryData.description.source !== '' || additionalData !== '')){
    //  setActiveNow('clientConfig');
    //}
  }
  useEffect (() => {
    handlaConfigEmptyData();
  }, [mandatoryData, additionalData]);

  /*
  useEffect (() => {
    const fetchData = async() => {
      try {
        const response = await fetch(`http://localhost:5000/api/getRSS/${name}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name: name})
        });
        if (response.ok) {
          const data = await response.text();
          const jsonData = JSON.parse(data);
          setRssData(jsonData);
          
          console.log(data);
          
        } else {
          console.error('Nepodarilo sa získať dáta');
        }
      } catch (error) {
        console.error('Chyba:', error);
      }
    }
    fetchData();
  }, [])

  useEffect (() => {
    const fetchData = async() => {
      try {
        const response = await fetch(`http://localhost:5000/api/getSemantics/${name}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name: name})
        });
        if (response.ok) {
          const data = await response.text();
          const jsonData = JSON.parse(data);
          setSemanticsData(jsonData);
          
          console.log(data);
          
        } else {
          console.error('Nepodarilo sa získať dáta');
        }
      } catch (error) {
        console.error('Chyba:', error);
      }
    }
    fetchData();
  }, [])
*/
  /*
  const handleTextArea = (event) => {
    const value = event.target.value;
    const regex = /(\w+):\s*([^,]+)/g; 
    let match;
    if((match = regex.exec(value)) !== null){
      setAdditionalData(value);
      console.log(additionalData);
    }
  }
  */
  
  const handleTextAsArticle = (value) =>{
    setShowDataAsArticle(value);
  }
  const handleFormOfData = (value) =>{
    setDataForm(value);
  }

  const handleChange = (key) => {
      
      setChecked(prevState => ({
        onlyRSS: key === "onlyRSS" ? !prevState.onlyRSS : false,
        onlySemantics: key === "onlySemantics" ? !prevState.onlySemantics : false,
        rssAndSemantics: key === "rssAndSemantics" ? !prevState.rssAndSemantics : false
    }));
    setActiveNow(prevState => {
      if(isActive !== 'clientConfig'){
        switch (key) {
          case "onlyRSS":
              return prevState === "onlyRSS" ? "noData" : "onlyRSS";
          case "onlySemantics":
              return prevState === "onlySemantics" ? "noData" : "onlySemantics";
          case "rssAndSemantics":
              return prevState === "rssAndSemantics" ? "noData" : "rssAndSemantics";
          default:
              return "";
            }
      }
      /*else if(isActive === 'clientConfig'){
        switch (key) {
          case "onlyRSS":
              return prevState === "onlyRSS" ? "clientConfig" : "onlyRSS";
          case "onlySemantics":
              return prevState === "onlySemantics" ? "clientConfig" : "onlySemantics";
          case "rssAndSemantics":
              return prevState === "rssAndSemantics" ? "clientConfig" : "rssAndSemantics";
          default:
              return "";
            }
      }*/
      
      
  });
  };

  const handleJavaScript = () => {
    setUseJavaScript(prevState => !prevState );
  }
  
  useEffect(() => {
    //console.log(combinedData);
    if(activeNow !== null){
      sendSetupDataToServer();
    }
  }, [combinedData]);

  useEffect(() => {
    // Assuming additionalData is a JSON string or similar,
    // and you want to combine it with mandatoryData into a single JSON object
    if(activeNow){
      const combined = {
        source: activeNow,
        ...mandatoryData,
        ...additionalData,
        ...useJavaScript
      };
      setCombinedData(combined);
    }
    else if(mandatoryData){
      const combined = {
        source: mandatoryData,
        ...activeNow,
        ...additionalData,
        ...useJavaScript,
      };
      setCombinedData(combined);
    }
    else if(additionalData){
      console.log('ADDITIONAL');
      const combined = {
      source: additionalData,
      ...mandatoryData,
      ...activeNow,
      ...useJavaScript,
    };
      setCombinedData(combined);
     // Convert to JSON string for consistency
    }
    else if(useJavaScript){
      console.log('ADDITIONAL');
      const combined = {
      source: useJavaScript,
      ...mandatoryData,
      ...additionalData,
      ...activeNow
    };
      setCombinedData(combined);
     // Convert to JSON string for consistency
    }
    //const combined = JSON.stringify(mandatoryData) + ' ' + JSON.stringify(additionalData) + ' ' + activeNow;
    //setCombinedData(combined); // Convert to JSON string for consistency
    console.log(combinedData);
  }, [additionalData, mandatoryData, activeNow, useJavaScript]); // This useEffect depends on additionalData and mandatoryData

  // Your component logic and return statement...

 /*
  useEffect(() => {
    sendHelpDataToServer();
  }, [helpSearch]);
*/
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/frame/${name}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.text();
          setAddress(data);
          console.log(data);
          
        } else {
          console.error('Nepodarilo sa získať dáta');
        }
      } catch (error) {
        console.error('Chyba:', error);
      }
      
    };
    fetchData();
  }, []);

  
  const handleFrequencyChangeMinutes = (event) => {
    const inputValue = event.target.value;
    // Kontrola, či je zadaná hodnota kladná
    console.log(frequencyHour);
    if(frequencyHour == 0){
      if(inputValue < 5){
        setFrequency(5);
      }
      if (inputValue >= 5 && inputValue <= 59) {
        setFrequency(inputValue);
      }
    }
    if(frequencyHour > 0 && frequencyHour < 24){
      if (inputValue >= 0 && inputValue <= 59) {
        setFrequency(inputValue);
      }
    }
    if(frequencyHour == 24){
      setFrequency(0);
    }
    
  };
  const handleFrequencyChangeHour = (event) => {
    const inputValue = event.target.value;
    // Kontrola, či je zadaná hodnota kladná
    if (inputValue >= 0 && inputValue <= 24) {
      if(inputValue == 24){
        setFrequency(0);
      }
      if(inputValue == 0 && frequency < 5){
        setFrequency(5);
      }
      setFrequencyHour(inputValue);
    }
  };

  const handleStartOnce = async () => {
    if(ableSend){
      setMessages('');
      try {
        const response = await fetch(`http://localhost:5000/api/setActive/${name}/setup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ start: true, frequency: 0, name: name , maindata: mandatoryData, additionaldata: additionalData, activeNow: activeNow, usejs: useJavaScript})
        });
        if (response.ok) {
          const jData = await response.json();
          setResponceData(jData);
        } else {
          console.error('Nepodarilo sa spustiť proces');
        }
      } catch (error) {
        console.error('Chyba:', error);
      }
    }
    else{
      setMessages('Nie sú dobre vyplnené údaje, prosím skontrolujte zadané selektory');
    }
    
  };

  const handleStart = async () => {
    if(ableSend){
      setMessages('');
      try {
        const response = await fetch(`http://localhost:5000/api/setActive/${name}/setup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ start: true, frequency: frequency, frequencyHour: frequencyHour,name: name , maindata: mandatoryData, additionaldata: additionalData, activeNow: activeNow, usejs: useJavaScript})
        });
        if (response.ok) {
          const jData = await response.json();
          setResponceData(jData);
          /*if(jData === 'Scraper started'){
            setIsActive('Scraper is activated and running');
          }*/
          
        } else {
          console.error('Nepodarilo sa spustiť proces');
        }
      } catch (error) {
        console.error('Chyba:', error);
      }
    }
    else{
      setMessages('Nie sú dobre vyplnené údaje, prosím skontrolujte zadané selektory');
    }
    
  };

  const handleStop = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/setActive/${name}/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ start: false, name: name })
      });
      if (response.ok) {
        const jData = await response.json();
        setResponceData(jData);
        /*setIsActive('Scraper is not running');*/
      } else {
        console.error('Nepodarilo sa zastaviť proces');
      }
    } catch (error) {
      console.error('Chyba:', error);
    }
  };

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const { current } = textareaRef;
      const start = current.selectionStart;
      const end = current.selectionEnd;
      const value = current.value;

      // Insert tabulation in the textarea at the current cursor position
      const newValue = value.substring(0, start) + "\t" + value.substring(end);
      current.value = newValue;

      // Move the cursor after the inserted tabulation
      current.selectionStart = current.selectionEnd = start + 1;
    }
  }
/*
  const sendHelpDataToServer = async() => {
    try{
      const response = await fetch(`http://localhost:5000/api/setActive/SetUp/${name}/helper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({helpData: helpSearch, name: name})
    });
    if (response.ok) {
      const jsonData = await response.json();
      setHelpFindData(jsonData);
      
    } else {
      console.error('Nepodarilo sa poslať dáta');
    }
    }
    catch (error) {
      console.error('Chyba:', error);
    }
};
*/
  function wrongSelector(jsondata){
    let canBeSend = true;
  
    for(const key in jsondata){
      if(jsondata[key] === '**/FALSE/**'){
        canBeSend = false;
        console.log(err)
        if(key === 'title'){
          setErr(prevErrors => ({
            ...prevErrors,
            title: true,
          }));
        }      
        if(key === 'link'){
          setErr(prevErrors => ({
            ...prevErrors,
            link: true,
          }));
        }      
        if(key === 'description'){
          setErr(prevErrors => ({
            ...prevErrors,
            des: true,
          }));
        }      
        if(key !== 'title' || key !== 'link' || key !== 'description'){
          setErr(prevErrors => ({
            ...prevErrors,
            other: true,
          }));
        }       
      }
      else{
        if(key === 'title'){
          setErr(prevErrors => ({
            ...prevErrors,
            title: false,
          }));
        }      
        if(key === 'link'){
          setErr(prevErrors => ({
            ...prevErrors,
            link: false,
          }));
        }      
        if(key === 'description'){
          setErr(prevErrors => ({
            ...prevErrors,
            des: false,
          }));
        }      
        if(key !== 'title' || key !== 'link' || key !== 'description'){
          setErr(prevErrors => ({
            ...prevErrors,
            other: false,
          }));
        }       
      }
    }
    if(canBeSend){
      setAbleSend(true);
      if(jsondata !== false){
        jsondata.pubdate = format(new Date(jsondata.pubdate), 'dd.MM.yyyy HH:mm:ss');
      }
      setData(jsondata);
    }
    else{
      setAbleSend(false);
      setData(jsondata);
    }
  }
  
  const sendSetupDataToServer = async() => {
      setLoading(true);
      try{
        console.log(mandatoryData);
        const response = await fetch(`http://localhost:5000/api/setActive/SetUp/${name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({maindata: mandatoryData, additionaldata: additionalData, name: name, activeNow: activeNow, usejs: useJavaScript})
      });
      if (response.ok) {
        const jsonData = await response.json();
        console.log(jsonData);
        wrongSelector(jsonData);
       
        /*
        const isOnlySpecificKeysDefined = Object.keys(jsonData).every(key => {
          return key === 'pubdate' || key === 'guid' || key === 'sourceID';
        });
      
        if (isOnlySpecificKeysDefined) {
          // Perform the desired action when only 'pubdate', 'guid', and 'sourceID' are defined
          console.log('Only pubdate, guid, and sourceID have values and no other keys are defined.');
          
          setActiveNow('noData');
          // Perform your action here ...
        }
        */
        
        
        //console.log("Data" + data);
        setLoading(false);
      }
      
      else {
        console.error('Nepodarilo sa zastaviť proces');
      }
      
      }
      catch (error) {
        console.error('Chyba:', error);
      }
  };
  
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        console.log(checked);
        console.log(activeNow);
        const response = await fetch(`http://localhost:5000/api/setActive/${name}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: name})
        });
        if (response.ok) {
          const jsonData = await response.json();
          const object = jsonData.source;
          const rss = jsonData.rssdata;
          const seman = jsonData.semantics;
          const active = object.activeConfiguration;
          const enable = object.enabled;
          const configData = object.scrapeConfiguration;
          setRssData(rss);
          setSemanticsData(seman);
          
          if(enable === 'run'){
            setIsActive('Scraper aktívne pracuje');
          }
          else if (enable === 'wait'){
            setIsActive('Scraper je v stave čakania');
          }
          else{
            setIsActive('Scraper je zastavený');
          }
          if(active === 'onlyRSS' || active === 'onlySemantics' || active === 'rssAndSemantics'){
            setChecked(prevState => ({
              ...prevState,
              [active]: true
            }));
            setActiveNow(active); 
          }
          else if (active === 'clientConfig') {
            setActiveNow(active); 
            setMandatoryData(() =>({
              title: { source: configData.title.source },
              link: { source: configData.link.source },
              description: { source: configData.description.source },
            }));
            setUserInput(() =>({
              title: { source: configData.title.source },
              link: { source: configData.link.source },
              description: { source: configData.description.source },
            }));
            const additionalKeys = Object.keys(configData).filter(
              (key) =>
                key !== 'sourceID' &&
                key !== 'title' &&
                key !== 'link' &&
                key !== 'description' &&
                key !== 'guid' &&
                key !== 'pubdate'
            );
  
            // Create additionalData string
            const additionalDataStr = additionalKeys
              .map((key) => `${key}: ${configData[key].source};`)
              .join('\n');
  
            // Set additionalData state
            //setAdditionalData(additionalDataStr);
            handleTextArea({ target: { value: additionalDataStr } });
            
            /*
            const additionalDataObj = {};
        
            // Iterate over the keys of configData
            for (const key in configData) {
                // Check if the key is not one of the specified keys
                if (!['title', 'link', 'description', 'pubdate', 'guid', 'sourceID'].includes(key)) {
                    // Include the key and its value in additionalDataObj
                    console.log(configData[key].source);
                    additionalDataObj[key] = { source: configData[key].source };
                }
            }
        
            // Set the additionalData state with the additionalDataObj
            setAdditionalData(JSON.stringify(additionalDataObj, null, 2));
            
            // Set mandatoryData with specified keys from configData
            setMandatoryData({
                title: { source: configData.title.source },
                link: { source: configData.link.source },
                description: { source: configData.description.source }
            });
        
            // Set activeNow to 'clientConfig'
            setActiveNow(active);
            */
          }
        
        } else {
          console.error('Nepodarilo sa získať dáta');
        }
        setLoading(false);
      } catch (error) {
        console.error('Chyba:', error);
      }
      
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>{name}</h1>
      <p>Pokiaľ nie je bližšie špecifikované ako sa dáta majú ukladať, teda ľavá strana je prázdna, potom sa zobrazí náhľad článku na základe predpripravených RSS a Semantických dát.</p>
      
      <h4>Web scraper obsahuje 5 povinných prvkov.</h4>
      <ul className="scraperInfo">
        <li><b>Title:</b> možné konfigurovať</li>
        <li><b>Link:</b> možné konfigurovať</li>
        <li><b>Description:</b> možné konfigurovať</li>
        <li><b>PubDate:</b> fixne dané - nedá sa zmeniť ani odstrániť</li>
        <li><b>Guid:</b> fixne dané - nedá sa zmeniť ani odstrániť</li>
      </ul>
      <p>Ak potrebujete poradiť s napísaním selektoru pre určité časti vložte text alebo príslušnú triedu do vyhľadávania</p>
    
      <p>Prednastavené vyhľadávanie pomocou RSS, Sémantických dát (OpenGraph), alebo ich kombinácia.</p>
    
      <h3>Scraper - nastavenie</h3>
    
      <FormControlLabel
            value="Use JavaScript"
            control={<Switch color="primary" onChange={handleJavaScript}/>}
            label="RSS"
            labelPlacement="top"
      />
      <h2>{isActive}</h2>
      <div className="templates">
        <div className="templateButtons">
          <button className={checked.onlyRSS ? ('active-button') : ('nonactive-button')} onClick={() => handleChange("onlyRSS")}>RSS</button>
          <button className={checked.onlySemantics ? ('active-button') : ('nonactive-button')} onClick={() => handleChange("onlySemantics")}>Semantické</button>
          <button className={checked.rssAndSemantics ? ('active-button') : ('nonactive-button')} onClick={() => handleChange("rssAndSemantics")}>RSS & Semantické</button>
        </div>
        <div className="templateButtons">
        <button className={showDataAsArticle ? ('nonactive-button') : ('active-button')} onClick={() => handleTextAsArticle(false)}>Zobraziť dáta</button>
        <button className={showDataAsArticle ? ('active-button') : ('nonactive-button')} onClick={() => handleTextAsArticle(true)}>Zobraziť ako článok</button>
        </div>
      </div>
      <div className="clearfix">
        <div className="textfield">
        {err.title ? (<TextField error label="Povinné" value={userInput.title.source} id="title" sx={{ m: 1, width: 'auto' }} onChange={(event) => {
            handleUserInputChange(event, 'title');
            //handleMandatoryArea(event, 'title');
          }}
            InputProps={{
              startAdornment: <InputAdornment position="start">title: </InputAdornment>,
            }}
          />) : (<TextField label="Povinné"  value={userInput.title.source} id="title" sx={{ m: 1, width: 'auto' }}  onChange={(event) => {
            handleUserInputChange(event, 'title');
            //handleMandatoryArea(event, 'title');
          }}
            InputProps={{
              startAdornment: <InputAdornment position="start">title: </InputAdornment>,
            }}
          />)}
          
          {err.link ? (<TextField error label="Povinné" value={userInput.link.source} id="link" sx={{ m: 1, width: 'auto' }} onChange={(event) => {
            handleUserInputChange(event, 'link');
            //handleMandatoryArea(event, 'link');
          }}
            InputProps={{
              startAdornment: <InputAdornment position="start">link: </InputAdornment>,
            }}
          />) : (<TextField label="Povinné" value={userInput.link.source} id="link" sx={{ m: 1, width: 'auto' }} onChange={(event) => {
            handleUserInputChange(event, 'link');
            //handleMandatoryArea(event, 'link');
          }}
            InputProps={{
              startAdornment: <InputAdornment position="start">link: </InputAdornment>,
            }}
          />)}
          
          {err.des ? (<TextField error label="Povinné" value={userInput.description.source} id="description" sx={{ m: 1, width: 'auto' }} onChange={(event) => {
            handleUserInputChange(event, 'description');
            //handleMandatoryArea(event, 'description');
          }}
            InputProps={{
              startAdornment: <InputAdornment position="start">description: </InputAdornment>,
            }}
          />) : (<TextField label="Povinné" value ={userInput.description.source} id="description" sx={{ m: 1, width: 'auto' }} onChange={(event) => {
            handleUserInputChange(event, 'description');
            //handleMandatoryArea(event, 'description');
          }}
            InputProps={{
              startAdornment: <InputAdornment position="start">description: </InputAdornment>,
            }}
          />) }
          
          {err.other ? (<textarea style={{border: 'red solid'}} ref={textareaRef} onKeyDown={handleKeyDown} onChange={handleTextArea} placeholder={additionalData}/>) : (<textarea ref={textareaRef} onKeyDown={handleKeyDown} onChange={handleTextArea} placeholder={additionalData}/>)}

          
        
        </div>
        {loading === false ? (<>
          
          {dataForm === 'insight' ? (
          <>
          {data ? (
            <div className="half">
              { showDataAsArticle ? (
              <article>
                <a href={data.link} target="_blank" className="articleLink"><h1>{data.title}</h1></a>
                <div className="articleInnerContent">
                    <h3>{data.sourceID}</h3>
                    <p>{data.site_name}</p>
                    <p>Kategória: {data.category}</p>
                    <p>Typ: {data.type}</p>
                </div>
                <img src={data.image} alt={data['image:alt'] ? data['image:alt'] : data.image_alt} className="articleImage"/>
                <div className="articleDesc">
                  <span className="date_content">
                    <p>{data.pubdate}</p>
                    <p>guid: {data.guid}</p>
                  </span>
                  <p>{data.description}</p>
                </div>
                <h2>Other content</h2>
                {Object.entries(data).map(([key, value]) => {
                  if (key !== 'title' && key !== 'link' && key !== 'image' && key !== 'description' && key !== 'sourceID' && key !== 'site_name' && key !== 'type' && key !== 'category' && key!== 'image:height' && key !== 'image:width' && key!== 'image:alt' && key!== 'pubdate' && key!== 'guid' && key !== 'image_alt') {
                    if(key === 'content'){
                      //const htmlContent = value.replace(/<[^>]+>/g, '').trim();
                      return (
                        <div key={key}>
                          <p><b>{key}</b>: {value}</p>
                        </div>
                      );}
                      else{
                        return(
                          <div key={key}>
                            <p><b>{key}</b>: {typeof value === 'string' ? value : JSON.stringify(value)}</p>
                          </div>
                        );
                      }
                  }
                  return null;
                })}
              </article> 
              ) : (
                <div>
                {Object.entries(data).map(([key, value]) => {
                  if(key === 'content'){
                    //const htmlContent = value.replace(/<[^>]+>/g, '').trim();
                    return (
                      <div key={key}>
                        <p><b>{key}</b>: {value}</p>
                      </div>
                    );}

                    else{
                      return(
                        <div key={key}>
                          <p><b>{key}</b>: {typeof value === 'string' ? value : JSON.stringify(value)}</p>
                        </div>
                      );
                    }
                })}
                </div>
              ) 
              }
            </div>
          ) : <div className="half"><h2 style={{"color": "red"}}> No data specified</h2></div>}
        </>) : dataForm === 'article' ? (<>
          <div className="iframeClass">
            <iframe src={address} title="Originálny článok">
            </iframe>
          </div> 
        </>) :
        dataForm === 'rss' ? (
          <div className="half">
                {Object.entries(rssData).map(([key, value]) => {
                  if(key === 'content'){
                    //const htmlContent = value.replace(/<[^>]+>/g, '').trim();
                    return (
                      <div key={key}>
                        <p><b>{key}</b>: {value}</p>
                      </div>
                    );}

                    else{
                      return(
                        <div key={key}>
                          <p><b>{key}</b>: {typeof value === 'string' ? value : JSON.stringify(value)}</p>
                        </div>
                      );
                    }
                })}
                </div>
        ) : dataForm === 'Semantics' ? (
          <div className="half">
          {Object.entries(semanticsData).map(([key, value]) => {
            if(key === 'content'){
              //const htmlContent = value.replace(/<[^>]+>/g, '').trim();
              return (
                <div key={key}>
                  <p><b>{key}</b>: {value}</p>
                </div>
              );}

              else{
                return(
                  <div key={key}>
                    <p><b>{key}</b>: {typeof value === 'string' ? value : JSON.stringify(value)}</p>
                  </div>
                );
              }
          })}
          </div>
        )
        
        :
        (<div> <h1>Status: Neznámy</h1></div>)}
        
        </>) : (
        <div className="spanLoader">
        <span className="loader"></span>
        </div>
        
        )}
        
            
        <div className="chooseFrom">
          <button className={dataForm === 'insight' ? 'active-menu-button' : 'nonactive-menu-button'} onClick={() => handleFormOfData('insight')}>Náhľad extrakcie</button>
          <button className={dataForm === 'rss' ? 'active-menu-button' : 'nonactive-menu-button'} onClick={() => handleFormOfData('rss')}> RSS </button>  
          <button className={dataForm === 'Semantics' ? 'active-menu-button' : 'nonactive-menu-button'} onClick={() => handleFormOfData('Semantics')}>Semantické dáta</button>
          <button className={dataForm === 'article' ? 'active-menu-button' : 'nonactive-menu-button'} onClick={() => handleFormOfData('article')}>Článok na portáli</button>
        </div>      
      </div>
        <h3>Spustenie Scraper</h3>
        <p>Spustiť scraper jednorázovo</p>
        <button onClick={handleStartOnce}>Spustiť</button>
        <p>Hodiny</p>
        <p>Minúty</p>
        <input type="number" placeholder="hodiny"  value={frequencyHour} onChange={handleFrequencyChangeHour} />
        <input type="number" placeholder="minúty"  value={frequency} onChange={handleFrequencyChangeMinutes} />
        <button onClick={handleStart}>Start</button>
        <button onClick={handleStop}>Stop</button>
        <p>{responseData}</p> 
        <p>{messages}</p>
        <LastRuns name={name}/>
        
    
    </div>
  );
}

export default SetupPage;


/*
<SSEComponent name={name}/>
  useEffect(() => {
    const mergedData = {
      ...setupdata,
      ...JSON.parse(additionalData || '{}') // Zabezpečuje, že sa nepokúšame parsovať prázdny reťazec
    };
    setSetupData(JSON.stringify(mergedData));
  }, [setupdata, additionalData]);
*/
/*
  const handleMandatoryArea = (event, name) => {
    const value = event.target.value;
    const regex = /(\w+):\s*([^,]+)/g; 
    const newData = `${name}: ${value}`;
    let match;
    if ((match = regex.exec(newData)) !== null) {
      setSetupData(newData);
    }
  }
*/

 //Handle na získanie dát z <TextField> a následné ich spracovanie a zapísanie do setupData
  /*
  const handleMandatoryArea = (event, name) => {
    const value = event.target.value;
    setMandatoryData(prevState => ({
      ...prevState,
      [name]: value
    }));
  
    const setupDataObject = { ...mandatoryData, [name]: value };
    const formattedString = Object.keys(setupDataObject)
      .map(key => `${key}: ${setupDataObject[key] || ''},`)
      .join('\n');
  
    setSetupData(formattedString);
  };
  */

/*
{data ? (
          <div className="half">
            {Object.entries(data).map(([key, value], index) => (
              <span key={index}>
                 {
                  key === 'link' ? <a href={value} target="_blank"><h1>{data['title']}</h1></a> : 
                  
                  key === 'status' ? <h2>{value}</h2> :
                  key === 'type' ? <p>{value}</p> :
                  key === 'site_name' ? <p>{value}</p> :
                  key === 'pubdate' ? <p>{value}</p> :
                  key === 'guid' ? <p>{value}</p> :
                  
                  key === 'description' ? <p>{value}</p> : 
                  key === 'image' ? <img src={value} /> : null
              }
              </span>
            ))}
          </div>
        ) : (
          <div className="half">
            <p>Loading data ...</p>
          </div>
        )}
*/  
/**
 <div className="helpSearchData">
      <TextField label="Vyhľadaj" sx={{ m: 1, width: '350px' }}
        onChange={handleHelpSearchData}
          InputProps={{
            startAdornment: <InputAdornment position="start">search: </InputAdornment>,
          }}
        />
      <p className="helpSearchBox">{helpFindData}</p>
      </div>
*/