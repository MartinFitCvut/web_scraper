

async function definedDataByUser(data, usejs){
    try{
        const firstItems = firstRssData //await getFirstItem(address)//rssFeed.items[0];   // Získa prvý záznam z RSS a uloží si dáta do  šablóny
    //const rssData = await parseString(address)
        
        let newData = {};
        const linkTo = firstItems.link;
        const pageMetadata = semanticsData // await analyzePage(linkTo); //Získa Sémantické dáta ak to je možné 
    
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