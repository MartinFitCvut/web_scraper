import React, { useState, useEffect, useRef } from "react";
import "../filter.css";
import { useLocation } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from '@mui/material/Button';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import TextField from '@mui/material/TextField';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { json, useAsyncError } from "react-router";
import { Link } from 'react-router-dom';
import DownloadButton from "../components/download";
import download from '../images/download.png';


function ClientSearch(){

    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);

    const [timeFrom, setTimeFrom] = useState(null);
    const [timeTo, setTimeto] = useState(null);

    const [sourceid, setSourceID] = useState(null);

    const [setupGuid, setSetupGuid] = useState(null);


    const [articles, setArticles] = useState(null);

    const [startIndex, setStartIndex] = useState(() => {
      const storedIndex = localStorage.getItem('startIndex');
      return storedIndex !== null ? parseInt(storedIndex) : 0;
    });
    const [sortDirection, setSortDirection] = useState(1);
    const articlesPerPage = 10;

    const [scrollPosition, setScrollPosition] = useState(0);

    const [activeItems, setActiveItems] = useState([]);


    let location = useLocation();
    console.log(location.state);
    
   
    const toggleItem = (index) => {
      if (activeItems.includes(index)) {
          setActiveItems(activeItems.filter(item => item !== index));
      } else {
          setActiveItems([...activeItems, index]);
      }
  };
  

    const handleSourceIDChange = (event) => {
      if(event.target.value.trim() !== ''){
        setSourceID(event.target.value);
      }
      else{
        setSourceID(null);
      }
      
    };

    const handleGuidChange = (event) => {
        if(event.target.value.trim() !== ''){
          setSetupGuid(event.target.value);
        }
        else{
          setSetupGuid(null)
        }
    
    };
    
    const handleDateFrom = (event) => {
      //console.log(new Date(event));
      if(event != null){
        setDateFrom(new Date(event));
      }
      else{
        setDateFrom(null);
      }
    }

    const handleDateTo = (event) => {
      if(event !== null){
        setDateTo(new Date(event));
      }
      else{
        setDateTo(null);
      }
    }
    
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

    const handleNextClick = () => {
      scrollToTop();  
      setStartIndex(startIndex + articlesPerPage);
      localStorage.setItem('startIndex', startIndex + articlesPerPage);
    };
  
    const handlePrevClick = () => {
      scrollToTop();  
      setStartIndex(Math.max(startIndex - articlesPerPage, 0));
      localStorage.setItem('startIndex', Math.max(startIndex - articlesPerPage, 0));
    };

    

/*
    const scrollToObject = () => {
      const storedScrollPosition = localStorage.getItem('scrollPosition');  
        console.log(parseInt(storedScrollPosition));
        window.scrollTo({
          top: storedScrollPosition,
          behavior: "smooth"
        })
    }
*/
    /*
    useEffect(() => {
      // Save scroll position to local storage
      localStorage.setItem('scrollPosition', scrollPosition);
    }, [scrollPosition]);*/
    
    const handleScroll = () => {
      localStorage.setItem('scrollPosition', window.scrollY);
    }

    useEffect(() => {
        if(localStorage.getItem('articles') !== null){
          setArticles(JSON.parse(localStorage.getItem('articles'))); 
        }
        else{
          handleSearch();
        } 
        console.log(localStorage.getItem('scrollPosition'));
        console.log(articles)
        if(localStorage.getItem('scrollPosition') !== null){
          console.log(localStorage.getItem('scrollPosition'));
          setScrollPosition(parseInt(localStorage.getItem('scrollPosition')));
        }
    }, []);

    useEffect(() => {
      window.scrollTo({top: scrollPosition});
    }, [scrollPosition]);

    
    /*
    if(localStorage.getItem('articles') !== null){
      setArticles(JSON.parse(localStorage.getItem('articles')));
    }*/
   
    
    /*
    useEffect(() => {
      const storedScrollPosition = localStorage.getItem('scrollPosition');
      console.log(parseInt(storedScrollPosition));
      window.scrollTo({top: parseInt(storedScrollPosition)});
    }, [articles]);*/

    const handleSearch = async() => {
       try{
            //console.log(dateFrom, dateTo);
            console.log('handleSearch');
            const response = await fetch(`http://localhost:5000/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({datefrom: dateFrom, dateto: dateTo, timefrom: timeFrom, timeto: timeTo, sourceid: sourceid, setupGuid: setupGuid})
            });
            if (response.ok) {
                const data = await response.json();
                //localStorage.removeItem('articles');
                //localStorage.setItem('articles', JSON.stringify(data));
                setArticles(data);
                localStorage.setItem('articles', JSON.stringify(data));
                //console.log(data);
            } else {
                console.error('Nepodarilo sa poslať dáta');
            }
       }
       catch(error){
        console.log(error);
       }
    };

    const handleSort = (direction) => {
        if(articles){
          const sortedArticles = [...articles].sort((a, b) => {
              // Compare the pubdate of articles based on the sort direction
              return direction === 1 ? new Date(a.pubdate) - new Date(b.pubdate) : new Date(b.pubdate) - new Date(a.pubdate);
          });
          setArticles(sortedArticles); // Update the state with sorted articles
          localStorage.setItem('articles', JSON.stringify(sortedArticles));
          setSortDirection(direction); // Toggle sort direction
        }
      };
    /*
    useEffect(() => {
        const handleScroll = () => {
          const scrollY = window.scrollY;
          console.log('Scroll position:', scrollY);
          localStorage.setItem('scrollPosition', window.scrollY);
          // You can store the scrollY position in state or perform other actions here
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
      */
    const handleClick = () => {
      // Navigate back to the homepage
      console.log('Bye');
      window.location.href = '/';
    };

    return(
        <div>
            <h1> Client Search </h1>
            
            <nav className="sort_and_volume">
             
              <button onClick={() => handleSort(-1)}>Sort Newest</button>
              <button onClick={() => handleSort(1)}>Sort Oldest</button>
              {articles !== null ? (<p>Num of results: {articles.length}</p>) : (<p>Num of results: 0</p>)}
              <DownloadButton data={articles} format="json" filename="articles_JSON" />
              <DownloadButton data={articles} format="csv" filename="articles_CSV"/>
            </nav>
            <div className="filter_place">
                <div className="filter_bar">
                    <span className="datePicker">
                        <p>Dátum od - do</p>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} >
                                <DatePicker 
                                label="Date from" 
                                onChange={handleDateFrom}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} >
                                <DatePicker
                                label="Date to"
                                onChange={handleDateTo}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </span>

                    <span className="datePicker">
                        <p>Presný čas od - do</p>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimePicker']}>
                            {dateFrom !== null ? (
                              <TimePicker
                                  label="Time from"
                                  viewRenderers={{
                                      hours: renderTimeViewClock,
                                      minutes: renderTimeViewClock,
                                      seconds: renderTimeViewClock,
                                  }}
                                  value={timeFrom}
                                  onChange={(newValue) => setTimeFrom(newValue)}/>
                                ) : (
                                <div style={{display: 'flex',  alignItems: 'center'}}>  
                                <TimePicker
                                label="Please pick a Date From"
                                disabled sx={{backgroundColor: 'white'}}/>
                                <p style={{paddingLeft: '5px', fontWeight: 'bold', color: 'red', fontSize: '35px', margin: '0px'}}>!</p>
                                </div>
                                )}
                            </DemoContainer>
                        </LocalizationProvider>

                        
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimePicker']}>
                            {dateTo !== null ? (
                              <TimePicker
                                  label="Time to"
                                  viewRenderers={{
                                      hours: renderTimeViewClock,
                                      minutes: renderTimeViewClock,
                                      seconds: renderTimeViewClock,
                                  }}
                                  value={timeTo}
                                  onChange={(newValue) => setTimeto(newValue)}/>
                                ) : (
                                <div style={{display: 'flex',  alignItems: 'center'}}>  
                                <TimePicker
                                label="Please pick a Date To"
                                disabled sx={{backgroundColor: 'white'}}/>
                                <p style={{paddingLeft: '5px', color: 'red', fontWeight: 'bold', fontSize: '35px', margin: '0px'}}>!</p>
                                </div>
                                )}
                            </DemoContainer>
                        </LocalizationProvider>
                    </span>
                    <span className="datePicker">
                    <p>SourceID</p>
                      <TextField label="sourceID" variant="outlined"  onChange={handleSourceIDChange}/>
                    </span>
                    <span className="datePicker">
                      <p>Guid</p>
                      <TextField label="guid" variant="outlined" onChange={handleGuidChange}/>
                    </span>
                    <p>title ?</p>
                    <p>Content ?</p>
                    <Button variant="contained" onClick={handleSearch}>Search</Button>
                </div>
                <article>
                {articles ? (
                    <div>
                    {articles.slice(startIndex, startIndex + articlesPerPage).map((article, index) => (
                      <div key={index}>
                        <article className="searchArticlePlace">
                          <h3 className="articleSourceId">{article.sourceID}</h3>
                          <div className="articleLinkAndImage">
                            <div className="searchArticleImage">
                              <img src={article.image} alt={article['image:alt']}/>
                            </div>
                            <div style={{position: 'sticky', padding: '20px'}}>
                              <span>
                                <h1 className="searchArticleLink">{article.title}</h1>
                                <span className="searchArticleDateGuid">
                                  <p>{article.pubdate}</p>
                                  <p>guid: {article.guid}</p>
                                </span>
                                <p>{article.description}</p>
                                {activeItems.includes(index) &&  (
                                  <div>
                                  {Object.entries(article).map(([key, value]) => {
                                    if (key !== 'title' && key !== 'link' && key !== 'image' && key !== 'description' && key !== 'sourceID' && key !== 'site_name' && key !== 'type' && key !== 'category' && key!== 'image:height' && key !== 'image:width' && key!== 'image:alt' && key!== 'pubdate' && key!== 'guid') {
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
                                  </div>
                                )}
                                      <button className='moreButton' onClick={() => toggleItem(index)}>
                                          {activeItems.includes(index) ? 'Menej' : 'Viac'}
                                      </button>
                                      
                            
                                    <Link to={article.link} target="_blank" style={{width: '100px', marginRight: '20px'}}>
                                      <button className="moreButton"> Odkaz </button>
                                    </Link>
                                    <Link to={`/versions`} state={article.guid} style={{width: '100px', marginRight: '20px'}}> 
                                      <button className="moreButton" onClick={handleScroll}> Versions </button>
                                    </Link>
                                    <div className="dropdown">
                                      <img src={download} className="dropbtn"/>  
                                      <div className="dropdown-content">
                                        <DownloadButton data={article} format="json" filename={'article_JSON_' + article.guid} />
                                        <DownloadButton data={[article]} format="csv" filename={'article_CSV_' + article.guid}/>
                                      </div>
                                  </div>
                                  
                                  
                                
                              </span> 

                            </div>
                    
                          </div>
                          
                        </article> 
                        {/*
                        })} */}
                        
                      </div>
                        ))}
                      <div>
                        <button onClick={handlePrevClick} disabled={startIndex === 0}>Previous</button>
                        <button onClick={handleNextClick} disabled={startIndex + articlesPerPage >= articles.length}>Next</button>
                    </div>
                    </div>
                    ):(null)
                    } 
                    </article>
            </div>
        </div>
    );
}

export default ClientSearch;

/**<a href={article.link} target="_blank" className="searchArticleLink"> */
