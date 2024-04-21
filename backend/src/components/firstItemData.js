async function firstItem(scraperConfig, firstRssData, semanticsData){
    try {
        let firstItems = firstRssData //await getFirstItem(address); //Získa RSS záznamu
        //const linkTo = firstItems.link;
        //console.log(linkTo)
        const pageMetadata = semanticsData //await analyzePage(linkTo); //Získa Sémantické dáta ak to je možné 
        //const sourceCollection = await connectSource(sourceData);
        //const query = { url: address };
        //const result = await sourceCollection.findOne(query);
        //const scraperConfig = result.scrapeConfiguration;//setupOfScrapperStructure 
        let newData = {};
            for(key in scraperConfig){

                if(key === "sourceID"){
                    newData[key] = scraperConfig[key];
                }
                const keyValue = scraperConfig[key];
                if(keyValue.source === 'RSS'){
                    //console.log( key, ' : ',firstItems[key]);
                    newData[key] = firstItems[key];
                }
                else if(keyValue.source === 'Semantics'){
                    if(key === 'link'){
                        newData[key] = pageMetadata['url'];
                    }
                    else{
                        newData[key] = pageMetadata[key]
                    }
        
                }
            }
        return newData;
        
    } catch (error) {
        console.error('Chyba pri načítaní RSS feedu:', error);
        throw error; // Vyhodenie chyby, ak nastane problém pri načítaní feedu
    }
}

module.exports = {
    firstItem
}