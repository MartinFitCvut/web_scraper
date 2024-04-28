
const dotenv = require('dotenv');
const parseString = require('rss-url-parser');
const {connectSource} = require('./connectMongo');
const {updateSourceData, updateFrequencyData} = require('./updateFrequency');
const mainStruct = ["rss:title", "rss:description", "rss:pubdate", "rss:link", "rss:guid", "media:content", "rss:category", "content:encoded"];
const { getCache, setCache } = require('./cache');
const {analyzePage} = require('./analyzePage');
const {getPageContent} = require('./puppeteerPage');
const {findElements} = require('./findElements');
require('../utils/global');
const axios = require('axios');
dotenv.config();



async function findNameByUrl(url) {
    try {
 // Názov vášho databázového schematu
      const collection = await connectSource(process.env.SOURCEDATA); // Názov vášho kolekcie
      // Vyhľadanie záznamu podľa zadaného URL
      const query = { url: url };
      const result = await collection.findOne(query);
      // Ak sa záznam nenašiel, vráti sa null
      if (!result) {
          return null;
      }
      // Ak sa záznam našiel, vráti sa hodnota v stĺpci "name"
      return result.name;
  } catch (error) {
      console.error('Chyba pri vyhľadávaní v databáze:', error);
      throw error;
  } 
}

function emitScraperEvent(scraperId, event) {
    global.eventEmitter.emit(`${scraperId}-${event}`, { scraperId, status: event });
}


function compareRecords(newData, record) {
    const differences = [];

    function compareNestedObjects(obj1, obj2, prefix) {
        for (let key in obj1) {
            if (key === '_id') continue;
            if (key === 'exec_date') continue;
            const value1 = obj1[key];
            const value2 = obj2[key];
            if(key === 'pubdate'){
                console.log(obj1[key], obj2[key]);
            }
            // Preskočte porovnanie, ak je hodnota z obj2 undefined
            if (value2 === undefined) {
                differences.push({ key: `${prefix}.${key}`, value: value1 });
                continue;
            }

            if (typeof value1 === 'object' && value1 !== null) {
                compareNestedObjects(value1, value2, `${prefix}.${key}`);
            } else if (value1 !== value2) {
                differences.push({ key: `${prefix}.${key}`, value: value1 });
            }
        }
    }

    compareNestedObjects(newData, record, '');
 
    return differences;
}


async function setScraperActive(address, usejs) {
    try{
        const data = await parseString(address); //Získa RSS dáta, všetky záznami
        const collection = await connectSource(process.env.CURRENT);//Prístup ku aktuálne uloženým článkom 
        const sourceCollection = await connectSource(process.env.SOURCEDATA);//Prístup ku konf. zdrojom(primacnn,blesk....)
        const query = { url: address };//Definovanie query
        const result = await sourceCollection.findOne(query);//Nájde záznam na základe url adresy a vráti ho (konfigurak na nejaký zdroj)
        const scraperConfig = result.scrapeConfiguration;//Získa konfiguráciu pre extrahovanie dát
        const name = await findNameByUrl(address);//Nájde meno na základe url adresy teda výstup je (primacnn....)
        //console.log('Nastavenie scrapera ',scraperConfig);
       
        let newDataInRun = [];
        let upadatedDataInRun = [];
        const actualDate = new Date();
        emitScraperEvent(name, 'scraperRunning');
        await updateSourceData(name, 'run');
        for(const item of data) {  //Prechod cez všeztky RSS dáta
            //console.log('RSS Data');
            const nwdata = item;
            const template = {}
            mainStruct.forEach(key => {  //Definovanie RSS dát - čo všetko z dát má vytiahnuť
                if (nwdata[key]) {
                    if(key === "media:content"){
                        const some = nwdata[key]['@'];
                        template.image = some.url;
                    }
                    else{
                        if(key === "content:encoded"){
                            template[key.replace(/:encoded/g, '')] = nwdata[key]['#'];
                        }
                        else{
                        template[key.replace(/rss:|media:/g, '')] = nwdata[key]['#']; // Odstránenie prefixu a pridanie do nového objektu
                        }
                    }
                    
                }
            });
            const mainItem = template; //Získané RSS dáta pre daný záznam              
            global.scrapersInFunction[name] = true;  //označenie že scraper začal pracovať
            const linkTo = mainItem.link;
            const pageMetadata = await analyzePage(linkTo); //Získa Sémantické dáta ak to je možné  
            let dataHTML;
            if(usejs){  
                dataHTML = await getPageContent(linkTo);
            }
            else{
                try{
                    const response = await axios.get(linkTo, {
                        headers: {
                            'User-Agent': 'Master-thesis'
                        }
                    });
                    dataHTML = response.data;
                }
                catch(error){
                    console.log(error);
                }
            }
            let newData = {};
            for(key in scraperConfig){  //Prechod cez konfiguračný súbor - priradenie jednotlivých dát
                //console.log('Prechádzam na klúče')
                //console.log(key);
                if(key === "sourceID"){
                    newData[key] = scraperConfig[key];
                }
                if(key === "guid"){
                    if(!mainItem.hasOwnProperty('guid')){
                        console.log('No guid');
                        newData[key] = mainItem['link'];
                    }
                    else{
                        newData[key] = mainItem[key];
                    }
                }
    
                const keyValue = scraperConfig[key];
                if(keyValue.source === 'RSS' && key !== 'guid'){
                    if(mainItem.hasOwnProperty(key)){
                        if(key === 'pubdate'){
                            const newDate = new Date(mainItem[key]);  
                            console.log(new Date(newDate.toISOString()));
                            newData[key] = newDate;
                        }
                        else{
                            const StoredData = mainItem[key];
                            const testData = StoredData.replace(/<[^>]+>/g, '').trim();
                            newData[key] = testData;
                        }
                    }
                    
                }
                
                else if(keyValue.source === 'Semantics'){
                    if(key === 'link'){
                        newData[key] = pageMetadata['url'];
                    }
                    if(pageMetadata.hasOwnProperty(key) && key !=='link'){
                        const StoredData = pageMetadata[key];
                        const testData = StoredData.replace(/<[^>]+>/g, '').trim();
                        newData[key] = testData; 
                    }
                   
                }
                
                else if(keyValue.source !== 'RSS' && keyValue.source !== 'Semantics' && keyValue !== '' && key !== 'sourceID'){
                    console.log(keyValue.source);
                    let findElementValue = await findElements(linkTo, keyValue.source, dataHTML); 
                    newData[key] = findElementValue;
                }
            
            }
            // Teraz máme vytvorý záznam pre potenciálny článok
            //console.log(newData);
            const guid = newData.guid;
            const record = await collection.findOne({ guid: guid }); //Zistí či už záznam existuje v databáze 
            //console.log(record);
            if(record !== null){ //Double kontrola - či ak kontorlujeme jeden voči druhému tak či sú dáta rovnaké alebo nie    
                const differenceNewData = compareRecords(newData, record);
                const differenceRecord = compareRecords(record, JSON.parse(JSON.stringify(newData)));
                //console.log(differenceNewData, differenceRecord);
                if(differenceRecord.length !== 0 || differenceNewData.length !== 0){
                    
                    await collection.deleteOne(record); //Vymaže z Current Article kolekcie tento záznam 
                    console.log("Deleted one from current database");
                    upadatedDataInRun.push(newData.guid);
                    await collection.insertOne(newData);

                    const versionsCollection = await connectSource(process.env.VERSIONS); //prístup do kolekcie verzie v databáze
                    record['exec_date'] = actualDate;
                    try{
                        await versionsCollection.insertOne(record); // Vloží aktuálne uležený záznam 
                    }
                    catch(error){
                        console.log(error)
                    }
                    //console.log('Vložil sa nový záznam');
                    console.log('Difference newData:');
                    differenceNewData.forEach((difference, index) => {
                        console.log(`Difference ${index + 1}:`, difference);
                    });

                    // Vypíšte differences z record
                    console.log('Difference record:');
                    differenceRecord.forEach((difference, index) => {
                        console.log(`Difference ${index + 1}:`, difference);
                    });
                    console.log("New version added " + record.guid);
                    
                }
                else{
                    console.log(record.guid + " Už tam je ten istý záznam takže nepridávam nič")
                } 
            }
            else{
                newDataInRun.push(newData.guid);
                await collection.insertOne(newData); //Záznam sa nenachádza - vkladám článok do databázy
                console.log("New data added");
            }
        };
        //let scrapersInFunction = getCache('scrapersInFunction');
        delete global.scrapersInFunction[name];
        //setCache('scrapersInFunction', scrapersInFunction, 0);
               
        console.log("\nFUNCTION IS FINISHED\n");
        emitScraperEvent(name, 'scraperCompleted');
        await updateSourceData(name, 'wait');

        const runscollection = await connectSource(process.env.RUNSDATA);
        console.log('Pripojené' + runscollection);
        const runsData = {
            name: name,
            url: address,
            newArticles: newDataInRun,
            updatedArticles: upadatedDataInRun,
            creationDate: actualDate
        };
        console.log(runsData);
        await runscollection.insertOne(runsData);
    }
    catch (error) {

    }
}

module.exports = {
    setScraperActive
}