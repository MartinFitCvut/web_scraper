const { getCache, setCache } = require('../utils/cache');
const {findElements} = require('../utils/findElements');
const {getFirstItem} = require('./getFirstRSSItem');
const {analyzePage} = require('./analyzePage');
const {getPageContent} = require('./puppeteerPage');

async function definedDataByUser(address, name, data, usejs){
    try{

        let firstItems
        if(!getCache(`${name}_rss`)){
            const rss = await getFirstItem(address); 
            setCache(`${name}_rss`, rss, 300);   
            firstItems = rss;
        }
        else{
            firstItems = getCache(`${name}_rss`);
        }   
    
        let newData = {};
        const linkTo = firstItems.link;
        let pageMetadata;
        if(!getCache(`${name}_semantics`)){
            const seman = await analyzePage(linkTo);
            setCache(`${name}_semantics`, seman, 300);
            pageMetadata = seman;
        }
        else{
            pageMetadata = getCache(`${name}_semantics`);
        }
        let loadHTML
        if(!getCache(`${name}_loadHTML`)){
            loadHTML = getPageContent(linkTo)
            setCache(`${name}_loadHTML`, loadHTML);
        }
        else{
            loadHTML = getCache(`${name}_loadHTML`);
        }
        
        for(key in data){ // Definovaná štruktúra od používateľa - teda jeho vytvorená šablóna na extrahovanie dát
            const keyValue = data[key];
            if(key === "sourceID"){
                newData[key] = data[key];
            }
           
           
            else if(keyValue.source.trim() === 'RSS'){   //Ak sú definované RSS
                //console.log( key, ' : ',firstItems[key]); 
                newData[key] = firstItems[key];
            }
            else if(keyValue.source.trim() === 'Semantics'){ // Ak sú definované Semantics
                if(key === 'link'){
                    newData[key] = pageMetadata['url'];
                }
                else{
                    newData[key] = pageMetadata[key]
                }
            }
            else if(keyValue.source.trim() !== 'RSS' && keyValue.source.trim() !== 'Semantics' && keyValue.source !== '' && key !== 'sourceID'){ // ak nie sú definované ani jedno tak vie že ide o klientske vyhľadávanie na základe cheerio 
                //console.log(keyValue.source);
                let findElementValue
                if(usejs){
                    findElementValue = await findElements(linkTo, keyValue.source, loadHTML); 
                }                                                                                               // funkcia vyhľadá dáta na základe selektora ktorý používateľ definoval 
                else{
                    findElementValue = await findElements(linkTo, keyValue.source, null);
                }
        
                //console.log(findElementValue);
                if(findElementValue === false){
                    newData[key] = '**/FALSE/**';    
                }
                else{
                    newData[key] = findElementValue;
                }
                console.log('newData: ', findElementValue);
                
            }
            else{
                newData[key] = data[key].source;
            }
        }
    return newData;
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    definedDataByUser
}