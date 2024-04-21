const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const express = require('express');
//const Parser = require('rss-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const {existingName, existingUrl, writeNewSource} = require('./components/new_source/checkExistingSource');
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
//var parseString = require('xml2js').parseString;
const { findElements } = require('./components/scrapers/findElement');
const { findParrentForElements } = require('./components/findParrentForElement');
const { getFirstItem } = require('./components/getFirstRRSItem');

const { createMainTemplate } = require('./components/createMainTeplate'); //Vytvorí hlavnú šablónu pre prácu s dátami ktorá je predefinovaná, sú to šablóny tvorené bud zo RSS alebo Semantics data  

const { firstItem } = require('./components/firstItemData');

const parseString = require('rss-url-parser');
const app = express(); 
const {analyzePage} = require('./components/scrapers/analyze');
const cron = require('node-cron');
const { post } = require('request');
const mainStruct = ["rss:title", "rss:description", "rss:pubdate", "rss:link", "rss:guid", "media:content", "rss:category", "content:encoded"];

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const {getPageContent} = require('./components/scrapers/puppeteerPage');
const { AxiosHeaders } = require('axios');

//const puppeteer = require('puppeteer');
let loadHTML;
let semanticsData;
let firstRssData;

//const fs = require('fs');
//const fastDeepEqual = require('fast-deep-equal');
//const { type } = require('os');

//const { pbkdf2 } = require('crypto');
//const { toNamespacedPath } = require('path');
//const Diff = require('diff');
//require('colors');


app.use(cors());
app.use(bodyParser.json());
dotenv.config();

const uri = process.env.DATABASE; 
const sourceData = process.env.SOURCEDATA;
const client = new MongoClient(uri);
let runningScrapers = {};
let scrapersInFunction = {};


//Pripojenie na databázu. Vráti collection s ktorou budeme pracovať
async function connectSource(collectionType){
    try {
        await client.connect();
        //console.log("Connected to the database");
        const db = client.db();
        const collection = db.collection(collectionType);
        return collection;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);    
    }
}

//Vráti "name" teda akésy id pre jednotlivé zdroje
async function findNameByUrl(url) {
      try {
        await client.connect(); // Pripojenie k databáze
        const database = client.db(); // Názov vášho databázového schematu
        const collection = database.collection(sourceData); // Názov vášho kolekcie
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

//získa prvý záznam z RSS a na základe jeho linku nájde článok a pokúsi sa získať OG data.
/*
async function firstItem(address, scraperConfig){
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
*/
//Skontroluje či sa záznam v databáze zhodeje s aktuálnym záznamom. Teda či je nový article rovnaký ako ten čo je v databáze. Funkcia ktorá rieši verzovanie
function compareRecords(newData, record) {
    const differences = [];

    function compareNestedObjects(obj1, obj2, prefix) {
        for (let key in obj1) {
            if (key === '_id') continue;

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

//Zisti či sme nedostali 403
async function checkForSemantics(data){
    if(data === "403"){
        return false;
    }
    else{
        return true;
    }
}
//Ak je 403 tak toto vytvorí šablónu iba z RSS dát.

//Funkcia ktorá spracováva dáta a prechádza celý RSS feed a postupne ukladá dáta pre jednotlivé články
/*
async function setScraperActive(address){
    try{

        let parser = new Parser();
        let rssFeed = await parser.parseURL(address);
        const collection = await connectSource(process.env.CURRENT);
        const sourceCollection = await connectSource(sourceData);
        const query = { url: address };
        const result = await sourceCollection.findOne(query);
        const scraperConfig = result.scrapeConfiguration;
        const name = findNameByUrl(address);
        //console.log(scraperConfig);
    
        for(const item of rssFeed.items) {
            scrapersInFunction[name] = true;
            const mainItem = item; //RSS záznam
            const linkTo = mainItem.link;
            const pageMetadata = await analyzePage(linkTo); //Získa Sémantické dáta ak to je možné  
            let newData = {};
            for(key in scraperConfig){
                if(key === "sourceID"){
                    newData[key] = scraperConfig[key];
                }
                const keyValue = scraperConfig[key];
                if(keyValue.source === 'RSS'){
                    newData[key] = mainItem[key];
                }
                else if(keyValue.source === 'Semantics'){
                    newData[key] = pageMetadata[key]
                }
            }
            //console.log(newData);
            const guid = newData.guid;
            const record = await collection.findOne({ guid: guid });
            if(record !== null){    
                const differenceNewData = compareRecords(newData, record);
                const differenceRecord = compareRecords(record, JSON.parse(JSON.stringify(newData)));
                if(differenceRecord.length !== 0 || differenceNewData.length !== 0){
                    const versionsCollection = await connectSource(process.env.VERSIONS);
                    await versionsCollection.insertOne(record);
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
                    await collection.deleteOne(record);
                    console.log("Deleted one from current database");
                    await collection.insertOne(newData);

                }
                else{
                    console.log(record.guid + " Už tam je ten istý záznam takže nepridávam nič")
                } 
            }
            else{
                await collection.insertOne(newData);
                console.log("New data added");
            }
        };

          console.log("New Data Inserted");
          delete scrapersInFunction[name];
          return "NEW DATA INSERTED";
    }
    catch (error) {
        console.error('Chyba pri načítaní RSS feedu:', error);
        throw error; // Vyhodenie chyby, ak nastane problém pri načítaní feedu
    }
}



*/
//Spustenie scrapera - slúži na hlavnú funkcionalitu scraperu kedy prejde všetky dáta z RSS a vykoná pre nich potrebné úkony podľa toho čo je definované v databáze
async function setScraperActive(address, usejs) {
    try{
        const data = await parseString(address); //Získa RSS dáta, všetky záznami
        const collection = await connectSource(process.env.CURRENT);//Prístup ku aktuálne uloženým článkom 
        const sourceCollection = await connectSource(sourceData);//Prístup ku konf. zdrojom(primacnn,blesk....)
        const query = { url: address };//Definovanie query
        const result = await sourceCollection.findOne(query);//Nájde záznam na základe url adresy a vráti ho (konfigurak na nejaký zdroj)
        const scraperConfig = result.scrapeConfiguration;//Získa konfiguráciu pre extrahovanie dát
        const name = await findNameByUrl(address);//Nájde meno na základe url adresy teda výstup je (primacnn....)
        console.log('Nastavenie scrapera ',scraperConfig);
        //console.log(data);
        /*
        for(const item of data){
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
            //console.log(mainItem);
            const linkTo = mainItem.link;
            const pageMetadata = await analyzePage(linkTo);
            //console.log(pageMetadata);
            let newData = {};
            //#########
            
            for(key in scraperConfig){
                console.log(key);
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
                    if(key === 'pubdate'){
                        newData[key] = mainItem[key];
                    }
                    else{
                        const StoredData = mainItem[key];
                        const testData = StoredData.replace(/<[^>]+>/g, '').trim();
                        newData[key] = testData;
                    }
                }
                
                else if(keyValue.source === 'Semantics'){
                    if(key === 'link'){
                        newData[key] = pageMetadata['url'];
                    }
                    else{
                        const StoredData = pageMetadata[key];
                        const testData = StoredData.replace(/<[^>]+>/g, '').trim();
                        newData[key] = testData;
                    }
                }

            }
            }
            */
            //#########
        
        let newDataInRun = [];
        let upadatedDataInRun = [];
        const actualDate = new Date();
        emitScraperEvent(name, 'scraperRunning');
        await updateSourceData(name, 'run');
        for(const item of data) {  //Prechod cez všeztky RSS dáta
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
            //console.log(mainItem);
            scrapersInFunction[name] = true;  //označenie že scraper začal pracovať
             //RSS záznam
            const linkTo = mainItem.link;
            const pageMetadata = await analyzePage(linkTo); //Získa Sémantické dáta ak to je možné  
            
            /*const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.setUserAgent('Master-thesis');
            await page.goto(linkTo);
            const html = await page.content();
            await browser.close();*/
            
            let newData = {};
            for(key in scraperConfig){  //Prechod cez konfiguračný súbor - priradenie jednotlivých dát
                
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
                    let findElementValue
                    if(usejs){
                        const dataHTML = await getPageContent(linkTo);
                        findElementValue = await findElements(linkTo, keyValue.source, dataHTML); 
                    }                                                                                               // funkcia vyhľadá dáta na základe selektora ktorý používateľ definoval 
                    else{
                        findElementValue = await findElements(linkTo, keyValue.source, null);
                    }
                    newData[key] = findElementValue;
                }
            
            }
            // Teraz máme vytvorý záznam pre potenciálny článok
            //console.log(newData);
            const guid = newData.guid;
            const record = await collection.findOne({ guid: guid }); //Zistí či už záznam existuje v databáze 
            if(record !== null){//Double kontrola - či ak kontorlujeme jeden voči druhému tak či sú dáta rovnaké alebo nie    
                const differenceNewData = compareRecords(newData, record);
                const differenceRecord = compareRecords(record, JSON.parse(JSON.stringify(newData)));
                if(differenceRecord.length !== 0 || differenceNewData.length !== 0){
                    const versionsCollection = await connectSource(process.env.VERSIONS); //prístup do kolekcie verzie v databáze
                    await versionsCollection.insertOne(record); // Vloží aktuálne uležený záznam 
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
                    await collection.deleteOne(record); //Vymaže z Current Article kolekcie tento záznam 
                    console.log("Deleted one from current database");
                    upadatedDataInRun.push(newData.guid);
                    await collection.insertOne(newData); //Vloží nový záznam pod týmto guid - teda dáta boli iné a nahrali sme novú verziu

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
        delete scrapersInFunction[name];
        /*
        const runscollection = await connectSource(process.env.RUNSDATA)
        const runsData = {
            name: name,
            url: url,
            newArticles: newDataInRun,
            updatedArticles: upadatedDataInRun,
            creationDate: actualDate
        };*/
        
        //await runscollection.insertOne(runsData);
        
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

//Vráti záznamy zdrojov. Pre frontend zobrazenie
async function getSourceData() {
    try {
        const collection = await connectSource(process.env.SOURCEDATA);
        const data = await collection.find({}).toArray();
        return data;
    } catch (error) {
        console.error('Chyba pri získavaní údajov:', error);
        throw error;
    }
}
//Main url - vráti záznam z kolekcie zdrojov
app.get("/", async (req, res) => {
    try {
        const data = await getSourceData();
        res.json(data); // Odpoveď s všetkými údajmi
    } catch (error) {
        console.error('Chyba:', error);
        res.status(500).json({ error: 'Nastala chyba pri spracovaní dát' });
    }
});


//Vráti mi url RSS zdroja podľa toho aké "name" - id zdroja máme. 
async function getAddress(name){
    try{
        const collection = await connectSource(process.env.SOURCEDATA);
        const existingData = await collection.findOne({ name: name });
        if (!existingData) {
            throw new Error('Záznam sa nenašiel');
        }
        const isAddress = existingData.url
        return isAddress;
    }
    catch (error) {
        console.error('Chyba pri aktualizácii údajov:', error);
        throw error;
    }
}


//Zistí či je daný zdroj aktívny alebo nie
async function isActivated(name){
    try{
        const collection = await connectSource(process.env.SOURCEDATA);
        const existingData = await collection.findOne({ name: name });
        if (!existingData) {
            throw new Error('Záznam sa nenašiel');
        }
        const isActive = existingData.enabled
        return isActive;
    }
    catch (error) {
        console.error('Chyba pri aktualizácii údajov:', error);
        throw error;
    }
}

//Zmení hodnotu "enabled" na základe toho aká bola predošlá (proste switch na hodnotu enabled)
async function updateSourceData(name, value) {
    try {
        const collection = await connectSource(process.env.SOURCEDATA);
        const existingData = await collection.findOne({ name: name });
        if (!existingData) {
            throw new Error('Záznam sa nenašiel');
        }
        const query = { name: name };
        await collection.updateOne(query, { $set: { enabled: value } });
        //client.close();
        
    } catch (error) {
        console.error('Chyba pri aktualizácii údajov:', error);
        throw error;
    }
}

// Scraper je spustený ale bol následne upravený časový interval
async function updateFrequencyData(name, value) {
    try {
        const collection = await connectSource(process.env.SOURCEDATA);
        const existingData = await collection.findOne({ name: name });
        if (!existingData) {
            throw new Error('Záznam sa nenašiel');
        }
        const query = { name: name };
        await collection.updateOne(query, { $set: { frequency: value } });
        //client.close();
        
    } catch (error) {
        console.error('Chyba pri aktualizácii údajov:', error);
        throw error;
    }
}

//Vymazanie zdroju
async function deleteSource(name) {
    try {
        const collection = await connectSource(process.env.SOURCEDATA);
        const existingData = await collection.findOne({ name: name });
        if (!existingData) {
            throw new Error('Záznam sa nenašiel');
        }
        const query = { name: name };
        await collection.deleteOne(query);
        //client.close();
        
    } catch (error) {
        console.error('Chyba pri aktualizácii údajov:', error);
        throw error;
    }
}


//Funkcia ktorá riadi spúšťanie a zastavovanie scrapera
async function startAndStopScraper(sourceName, frequency, address, startOrStop, usejs) {
    // Inicializácia premennej scrapersInFunction, ak nie je definovaná
    //scrapersInFunction[sourceName] = scrapersInFunction[sourceName] || false;
    console.log(frequency);
    if (startOrStop) { //Ak je true tak zapínam scraper
        if (frequency > 0) { //Ak je frekvencia väčšia ako 0 spúšťam opakované scrapovanie na základe tejto hodnoty
            if (runningScrapers[sourceName]) { // Zisťujem či scraper bol už aktivovaný 
                if (scrapersInFunction[sourceName]) { // Check či scraper právé beži teda či sťahuje dáta 
                    // Čakáme, kým sa predchádzajúca úloha dokončí
                    while (scrapersInFunction[sourceName]) {
                        console.log(sourceName, "waiting for end");
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                    console.log(sourceName, "ended");
                } else {
                    runningScrapers[sourceName].stop(); //Zastavenie scrapera pre novú inicializáciu

                    // Ak pre daný zdroj nebeží žiadna cron úloha, spustíme novú
                    /*const nameValue = await findNameByUrl(address);
                    const collection = await connectSource(process.env.SOURCEDATA);
                    const query = { name: nameValue };
        
                    await collection.updateOne(query, { $set: { scrapeConfiguration: setupOfScrapperStructure } });*/
                    await setScraperActive(address, usejs);
                    const taskId = cron.schedule(`*/${frequency} * * * *`, async () => {  //Nastavenie časovača kedy sa scraper bude spúštať
                        console.log('Running upadated scraper for', sourceName);
                        try {
                            await setScraperActive(address, usejs);  //Spustenie scrapera
                        } catch (error) {
                            console.error('Chyba pri spustení scraperu:', error);
                        }
                    });
                    // Uložíme referenciu na novú cron úlohu pre daný zdroj
                    runningScrapers[sourceName] = taskId; 
                }
            } else { // Ak scraper aktivovaný ešte nebol alebo je vypnutý 
                // Ak pre daný zdroj už beží cron úloha, zrušíme ju a vytvoríme novú
                    /*const nameValue = await findNameByUrl(address);
                    const collection = await connectSource(process.env.SOURCEDATA);
                    const query = { name: nameValue };
                    console.log(setupOfScrapperStructure);
                    await collection.updateOne(query, { $set: { scrapeConfiguration: setupOfScrapperStructure } });*/
                    await setScraperActive(address, usejs);
                    const taskId = cron.schedule(`*/${frequency} * * * *`, async () => {  //spustenie scrapera 
                    console.log('Running new scraper for', sourceName);
                    try {
                        await setScraperActive(address, usejs);
                    } catch (error) {
                        console.error('Chyba pri spustení scraperu:', error);
                    }
                });
                // Aktualizujeme referenciu na cron úlohu pre daný zdroj
                runningScrapers[sourceName] = taskId;
                
            }
        }
    } else if (!startOrStop) { //Zastavenie scrapera 
        // Zastavíme cron úlohu pre daný zdroj
        if (runningScrapers[sourceName]) {
            runningScrapers[sourceName].stop(); 
            delete runningScrapers[sourceName]; 
            console.log(sourceName, " stopped");
            emitScraperEvent(sourceName, 'scraperStopped');
            await updateSourceData(sourceName, 'stop');
            //eventEmitter.emit('scraperStoped', { name: sourceName });
        } else {
            console.log("No running scraper found for", sourceName);
        }
    }
}

function parseInput(input) {
    const regex = /(\w+):\s*([^,]+)/g;
    let match;
    const fields = {};

    while ((match = regex.exec(input)) !== null) {
        const key = match[1]; // názov pola
        let value = match[2].trim(); // hodnota pola (odstrániť medzery okolo)
         
        fields[key] = value; // inak použiť hodnotu priamo
        
    }

    return fields;
}


// Vloženie nového zdroja
app.post('/api/newSource', async (req, res) => {
    try {
        const receivedData = req.body;
        const name = receivedData.name;
        const url = receivedData.url;
        const newName = await existingName(client, name); //kontrola či existuje meno
        const newUrl = await existingUrl(client, url); // kontrola url 
        if(newName && newUrl){
            const result = await writeNewSource(client, name, url); // Zapísanie nového zdroja
            res.json(true)
        }  
        if(!newName){
            res.json("Neplatné meno, prosím skontrolujte či zadané meno už nemáte priradené inému zdroju");
        }
        if(!newUrl){
            res.json("Neplatná adresa RSS kanálu, prosím skontrolujte či ste zadali existujúcu adresu alebo či už adresu nemáte priradenú inému zdroju")
        }
        if(!newUrl && !newName){
            res.json("Chyba, nemo aj RSS adresa sú neplatné"); // Dáta už existujú alebo sú zlé
        }    
    } catch (error) {
        console.error('Chyba:', error);
        res.status(500).json({ error: 'Nastala chyba pri aktualizácii stavu' });
    }
});

// Vymazanie zdroja
app.delete('/api/delete/Source/:name', async (req, res) => {
    try{
        const receivedData = req.params;
        const name = receivedData.name;
        await deleteSource(name);
        res.json("Deleted");
    }
    catch (error) {
        console.error('Chyba:', error);
    }
   
})

// Funkcia ktorá kontroluje či používateľ opäť nedefinoval už prednastavené veci - Teda ak title definoval inde ako mal alebo sa snaži definovať guid ktoré sa ukladá automaticky
function checkForMainKeysReppetition(data){

    const wrongKeys = ["title", "link", "description", "guid", "pubdate"];
    const containsWrongKey = (key) => {
        return wrongKeys.includes(key);
    };
    if(data === null)
    {
        return true;
    }
    for(key in data){
        console.log(key);
        if (containsWrongKey(key)) {
            return false; // Ak sa nachádza nesprávny kľúč, ukončite iteráciu a vráťte false
        }
        else{
            return true;
        }
    }
}

//Funkcia vyhľadá dáta z HTML
async function definedDataByUser(data, address, usejs){
    try{
        const firstItems = firstRssData //await getFirstItem(address)//rssFeed.items[0];   // Získa prvý záznam z RSS a uloží si dáta do  šablóny
    //const rssData = await parseString(address)
        
        let newData = {};
        const linkTo = firstItems.link;
        const pageMetadata = semanticsData // await analyzePage(linkTo); //Získa Sémantické dáta ak to je možné 
        //console.log(data);
        /*const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setUserAgent('Master-thesis');
        await page.goto(linkTo);
        const html = await page.content();
        await browser.close();*/
        for(key in data){ // Definovaná štruktúra od používateľa - teda jeho vytvorená šablóna na extrahovanie dát
            const keyValue = data[key];
            if(key === "sourceID"){
                newData[key] = data[key];
            }
           
            /*
            if(keyValue.source !== undefined){
                //console.log(keyValue.source.split('.'));
                const newKeyValue = keyValue.source.split('.')[0];
                const newElementValue = keyValue.source.split('.')[1];
                console.log(newKeyValue, newElementValue);
                if(newKeyValue === 'RSS'){
                    if(newElementValue !== undefined){
                        newData[key] = firstItems[newElementValue];
                    }
                    /*
                    else if(key === 'guid' || key === 'pubdate'){
                        newData[key] = firstItems[key];
                    }*/
                /*
                }
                else if(newKeyValue === 'Semantics'){
                    if(newElementValue !== undefined){
                        if(key === 'link'){
                            newData[key] = pageMetadata['url'];
                        }
                        else{
                            newData[key] = pageMetadata[newElementValue];
                        }
                    }
                }
                
                else if(newKeyValue !== 'RSS' && newKeyValue !== 'Semantics' && (newKeyValue !== '' || (newKeyValue === '' && (newElementValue !== '' || newElementValue !== undefined)))){

                    //console.log(keyValue.source);
                    
                    const findElementValue = await findElements(linkTo, keyValue.source);
                    //console.log(findElementValue);
                    newData[key] = findElementValue;
                }
                else{
                    newData[key] = data[key].source;
                }  
            }*/
            
            
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
//Funkcia ktorá berie ako vstup dáta z frontend a vytvára šablónu pre nich - ak je definované aj iné ako RSS a Semantics
async function makeMainStructure(maindata, additionaldata, name, setup, address){
    try{
        let additionalDataObject = '';
        let wrongKeys = true;
        console.log(additionaldata);
        if(setup === 'clientConfig'){ // Ak sa mi vráti hodnota že klient definoval svoje dáta
            if(additionaldata !== ''){
                additionalDataObject = JSON.parse(additionaldata);
                wrongKeys = checkForMainKeysReppetition(additionalDataObject);
                //console.log(wrongKeys);
            }
            if(!wrongKeys){
                //console.log('wrong keys')
                return "wrong keys";
            }
            else{
            
                    const nameValue = {sourceID: name};
                    const staticValues = {guid: {source: 'RSS'}, pubdate: {source: 'RSS'}}
                    const combinedData= { ...nameValue, ...maindata, ...staticValues, ...additionalDataObject };
                    return combinedData;
            }   
        }
        else if(setup === 'onlyRSS' || setup === 'onlySemantics' || setup === 'rssAndSemantics'){ // ak si používateľ vybral spomedzi extistujúcich šablón
            //console.log(setupOfScrapperStructure);
            const isCorrect = await checkForSemantics(semanticsData);
            const setupOfScrapper= await createMainTemplate(address, setup, firstRssData, semanticsData, name,isCorrect);
            return setupOfScrapper;
        }
        else{
            return false;
        }
    }
    catch (error) {
        console.log(error); 
    }
}

//Nastanie informácií od užívateľa, to čo si užívateľ konfuguruje sám
app.post('/api/setActive/SetUp/:name', async (req, res) => {
    try{
        //console.log('Recieved Data');
        const receivedData = req.body;
        const maindata = receivedData.maindata;
        //console.log(maindata);
        const additionaldata = receivedData.additionaldata;
        const name = receivedData.name;
        const setup = receivedData.activeNow;
        const usejs = receivedData.usejs;
        console.log(usejs);
        const address = await getAddress(name);
        //let additionalDataObject = '';
        //let wrongKeys = true;
        console.log('Setup:', setup);
        //console.log(maindata);
        //console.log(additionaldata);
        const specifiedData = await makeMainStructure(maindata, additionaldata, name, setup, address); //Vytvorenie štruktúry podľa používateľa 
        console.log(specifiedData);
        if(setup === 'clientConfig'){
            if(specifiedData === "wrong keys"){
                res.json({error: 'wrong keys, prosím skontrolujte či neprepisujete fixne definované časti'});
            }
            else{
                const newData = await definedDataByUser(specifiedData, address, usejs); // Vyhľadávanie v HTML - podsunie šablónu a podľa nej scraper vyhľadáva
                res.json(newData);
            }
        }
        else if(setup === 'onlyRSS' || setup === 'onlySemantics' || setup === 'rssAndSemantics'){ // predefinované šablóny
            const first = await firstItem(specifiedData, firstRssData, semanticsData);
            //console.log(first);
            res.json(first);
        }
        else{
            res.json(false);
        }
        /*
        if(setup === 'clientConfig'){
            if(additionaldata !== ''){
                additionalDataObject = JSON.parse(additionaldata);
                wrongKeys = checkForMainKeysReppetition(additionalDataObject);
                console.log(wrongKeys);
            }
            if(!wrongKeys){
                //console.log('wrong keys')
                res.json({error: 'wrong keys, prosím skontrolujte či neprepisujete fixne definované časti'});
            }
            else{
            
                    const nameValue = {sourceID: name};
                    const staticValues = {guid: {source: 'RSS'}, pubdate: {source: 'RSS'}}
                    const combinedData= { ...nameValue, ...maindata, ...staticValues, ...additionalDataObject };
                    console.log(combinedData);
                    const newData = await definedDataByUser(combinedData, address); // Vyhľadávanie v HTML 
                    //console.log(newData)
                    const nameOfAddress = await findNameByUrl(address);
                    const collection = await connectSource(process.env.SOURCEDATA);
                    const query = { name: nameOfAddress };
                    const setupOfScrapper = combinedData;
                    await collection.updateOne(query, { $set: { scrapeConfiguration: setupOfScrapper, activeConfiguration: setup } });
                    //console.log(setupOfScrapperStructure);
                    console.log('Setup' + setupOfScrapper);
                    res.json(newData);
            }   
        }
        else if(setup === 'onlyRSS' || setup === 'onlySemantics' || setup === 'rssAndSemantics'){
            const nameValue = await findNameByUrl(address);
            const collection = await connectSource(process.env.SOURCEDATA);
            const query = { name: nameValue };
            //console.log(setupOfScrapperStructure);
            const setupOfScrapper= await createMainTemplate(address, setup);
            await collection.updateOne(query, { $set: { scrapeConfiguration: setupOfScrapper, activeConfiguration: setup } });
            console.log(setupOfScrapper);
            //console.log(setup);
            //console.log(setupOfScrapperStructure);
            const first = await firstItem(address, setupOfScrapper);
            //console.log(first);
            res.json(first);
        }
        else{
            res.json(false);
        }
        */
    }
    catch (error){
        console.log(error);
    }
});

//Spustenie a zastavenie scrapera
app.post('/api/setActive/:name/setup', async (req, res) => {
    try {
        const receivedData = req.body;
        //console.log(receivedData); 
        const sourceName = receivedData.name;
        const address = await getAddress(sourceName);
        const usejs = receivedData.usejs;
        //const isActive = await isActivated(sourceName);

        if (receivedData.start !== undefined && receivedData.start !== null) { // ked príde od používateľa Start value
            // Vykonaj akciu pre spustenie alebo zastavenie procesu
            if (receivedData.start) {  // ak je true
                if (receivedData.frequency) { //ak je definovaná
                    const frekvencia = parseInt(receivedData.frequency);
                    const maindata = receivedData.maindata;
                    //console.log(maindata);
                    const additionaldata = receivedData.additionaldata;
                    const setup = receivedData.activeNow;
                    //console.log(setup);
                    //const nameValue = {sourceID: sourceName};
                    const specifiedData = await makeMainStructure(maindata, additionaldata, sourceName, setup, address); //Vytvor šablónu
                    console.log(specifiedData);
                    const collection = await connectSource(process.env.SOURCEDATA); //zapíš šablónu do databázy
                    const query = { url: address };
                    //console.log(setupOfScrapperStructure);
                    await collection.updateOne(query, { $set: { scrapeConfiguration: specifiedData, activeConfiguration: setup } }); // update šablóny
                    /*const sourceCollection = await connectSource(sourceData);
                    const query = { url: address };
                    const result = await sourceCollection.findOne(query);
                    const scraperConfig = result.scrapeConfiguration;*/
                    // Vykonaj akciu pre nastavenie frekvencie
                    //console.log(setupOfScrapperStructure);
                    if(specifiedData === false){  // kontrola či je prázdna 
                        res.json('No data specified');
                    }

                    else if(specifiedData.title.source === '' || specifiedData.link.source === '' || specifiedData.description.source === ''){ // kontrola či sú všetky povinne údaje vyplnené
                        res.json('Please enter mandatory parts');
                    }
                    //else{
                    else if(frekvencia === 0){
                        //await updateSourceData(sourceName, 'run'); // zmena stavu
                        await updateFrequencyData(sourceName, frekvencia); //zmena frekvencie 
                        await setScraperActive(address, usejs);
                        await updateSourceData(sourceName, 'stop');
                        await updateFrequencyData(sourceName, 0);
                        emitScraperEvent(sourceName, 'scraperStopped');
                        //eventEmitter.emit('scraperStoped', { name: sourceName });
                        res.json('started');
                        
                    }
                    else{
                        console.log('Setting frequency to', frekvencia);
                        console.log('Starting process...');
                        //await updateSourceData(sourceName, 'run'); // zmena stavu
                        await updateFrequencyData(sourceName, frekvencia); //zmena frekvencie 
                        await startAndStopScraper(sourceName, frekvencia, address, true, usejs); // spusť scraper 
                        //console.log(setupOfScrapperStructure);
                        //await setScraperActive(address);
                        //await startAndStopScraper(sourceName, receivedData.frequency, address, true);
                        res.json('started');
                        
                    }
                    
                    //}
                }
                else{
                    res.json('No frequency setup');
                    console.log('No frequency setup');
                }
                
            } else {
                console.log('Stopping process...');
                await updateSourceData(sourceName, 'stop');
                await updateFrequencyData(sourceName, 0);
                //stopScraper(sourceName);
                await startAndStopScraper(sourceName, receivedData.frequency, address, false, false); //zastavenie scrapera  
                res.json('stoped');
                
            }
        }  else {
            // Nedefinované dáta, vráť chybový stav
            res.status(400).json({ error: 'Nesprávne dáta' });
        }
    } catch (error) {
        console.error('Chyba:', error);
        res.status(500).json({ error: 'Nastala chyba pri spracovaní požiadavky' });
    }
});

// Získanie a vypísanie prvého definovaného článku - použité ak používať si zobrazí konfiguráciu scrapera tak mu vybehne článok podľa predtým definovaných pravidiel.
app.post('/api/setActive/:name', async (req, res) => {
    try {
        //console.log("Active")
        const receivedData = req.body;
        const name = receivedData.name;
        const collection = await connectSource(process.env.SOURCEDATA);
        const query = { name: name };
        const result = await collection.findOne(query);
        const rss = await getFirstItem(result.url);
        const seman = await analyzePage(rss.link);
        firstRssData = rss;
        semanticsData = seman;
        const object = {
            source: result,
            rssdata: rss,
            semantics: seman
        }
        res.json(object);
        loadHTML = await getPageContent(rss.link);
       
        
        
    
    } catch (error) {
        console.error('Chyba:', error);
        res.status(500).json({ error: 'Nastala chyba pri aktualizácii stavu' });
    }
});

//Odoslanie url adresy prvého článku z RSS na to aby sa na frontend vykreslil pomocou iframe
app.get('/api/frame/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const address = await getAddress(name);
        const first = await getFirstItem(address);
        const linkTo = first.link;
        res.send(linkTo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Nastala chyba pri získavaní dát' });
    }
});


//Získanie textu alebo Classy či ID pre určenie rodičov. 
app.post('/api/setActive/SetUp/:name/helper', async(req, res) => {
    try{
        const receivedData = req.body;
        const name = receivedData.name;
        const stringToFind = receivedData.helpData;
        const address = await getAddress(name);
        const first = await getFirstItem(address);
        const linkTo = first.link;
        if(stringToFind === ''){
            res.json('');
        }
        else{
            const result = await findParrentForElements(linkTo, stringToFind); //Funkcia zabezpečujúca vyhľadávanie
            console.log(result);
            res.json(result);
        }
        
    }
    catch (error) {
        console.log(error);
    }
})

//Vyhľadávanie v databáze 
async function findArticles(dateFrom, dateTo, timeFrom, timeTo, setupSourceID, setupGuid){
    try{
        const collection = await connectSource(process.env.CURRENT);
        let query = {};
        let dateTimeFrom; // Adding 1 hour in milliseconds; 
        let dateTimeTo;
        //console.log(dateTo);
        if (dateFrom !== null) {
            // Add condition for dateFrom if it's specified
            const realDateTime = new Date(new Date(dateFrom).getTime() + 60 * 60 * 1000).toISOString();
            //console.log(realDateTime.toISOString());
            if(timeFrom !== null){
                const time = new Date(timeFrom).toLocaleTimeString('en-US', { hour12: false });
                const date = realDateTime.split('T')[0];
                //console.log(date);
                dateTimeFrom = date + 'T' + time + '.000Z';
                //console.log(dateTimeFrom)
                //console.log(new Date(dateTimeFrom));
                query.pubdate = { $gte: new Date(dateTimeFrom) };
            }
            else{
                dateTimeFrom = realDateTime;
                query.pubdate = { $gte: new Date(dateTimeFrom)};
            }
        }
        

        // Check if dateTo is specified
        if (dateTo !== null) {
            const realDateTime = new Date(new Date(dateTo).getTime() + 60 * 60 * 1000).toISOString();
            //console.log(realDateTime);
            if(timeTo !== null){
                const time = new Date(timeTo).toLocaleTimeString('en-US', { hour12: false });
                const date = realDateTime.split('T')[0];
                dateTimeTo = date + 'T' + time + '.000Z';
                query.pubdate = dateTimeFrom !== null ? { ...query.pubdate, $lte: new Date(dateTimeTo)} : { $lte: new Date(dateTimeTo) };
            }
            else{
                dateTimeTo = realDateTime;
                query.pubdate = dateTimeFrom !== null ? { ...query.pubdate, $lte: new Date(dateTimeTo) } : { $lte: new Date(dateTimeTo) };
            } 
        }
        
        if(setupSourceID !=null){
            query.sourceID = setupSourceID;
        }

        if(setupGuid !=null){
            query.guid = setupGuid;
        }
        console.log(query);
        /*
        console.log(dateFrom, dateTo);
        if (dateFrom && !dateTo) {
            query.pubdate = { $gte: dateFrom };
        } else if (!dateFrom && dateTo) {
            query.pubdate = { $lte: dateTo };
        } else if (dateFrom && dateTo) {
            query.pubdate = { $gte: dateFrom, $lte: dateTo };
        }
        */
        const articles = await collection.find(query).toArray();
        return articles;
    }
    catch (error) {

    }
}
//Vyhľadávanie v databáze 
app.post('/search', async(req, res) => {
    try{
        const receivedData = req.body;
        const dateFrom = receivedData.datefrom;
        const dateTo = receivedData.dateto;
        //const newDate = new Date(new Date(dateFrom).getTime() + 60 * 60 * 1000); // Adding 1 hour in milliseconds
        const timeFrom = receivedData.timefrom //new Date(receivedData.timefrom).toLocaleTimeString([], { hour12: false });
        const timeTo = receivedData.timeto //new Date(receivedData.timeto).toLocaleTimeString([], { hour12: false });
        const setupSourceID = receivedData.sourceid;
        const setupGuid = receivedData.setupGuid;
        
        const articles = await findArticles(dateFrom, dateTo, timeFrom, timeTo, setupSourceID, setupGuid);
        //console.log(articles);
        res.json(articles);
    }
    catch(error){
        console.log(error);
    }
});


async function searchForVersions(versionguid){
    try{
        const collection = await connectSource(process.env.VERSIONS);
        let query = {};
        query.guid = versionguid;
        const versions = await collection.find(query).toArray();
        return versions;
    }
    catch (error) {
        console.log(error);
    }
}

async function searchForCurrentArticle(versionguid){
    try{
        const collection = await connectSource(process.env.CURRENT);
        let query = {};
        query.guid = versionguid;
        const currentArticle = await collection.findOne(query);
        return currentArticle;
    }
    catch (error) {
        console.log(error);
    }
}



app.post('/api/versions', async(req, res) => {
    try{
        const receivedData = req.body;
        const versionGuid = receivedData.versionguid;
        console.log(receivedData);
        const versions = await searchForVersions(versionGuid);
        const current = await searchForCurrentArticle(versionGuid);
        const resData = {versions, current};
        res.json(resData);
    }
    catch(error){
        console.log(error);
    }
});

/*
app.post('/api/getRSS/:name', async(req, res) => {
    try{
        const receivedData = req.body;
        const name = receivedData.name;
        const address = await getAddress(name);
        const rssdata = await getFirstItem(address);
        res.json(rssdata);
    }
    catch(error){
        console.log(error);
    }
});

app.post('/api/getSemantics/:name', async(req, res) => {
    try{
        const receivedData = req.body;
        const name = receivedData.name;
        const address = await getAddress(name);
        const rssdata = await getFirstItem(address);
        const getSematics = await analyzePage(rssdata.link);
        res.json(getSematics);
    }
    catch(error){
        console.log(error);
    }
});
*/
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});

function emitScraperEvent(scraperId, event) {
    eventEmitter.emit(`${scraperId}-${event}`, { scraperId, status: event });
}

app.get('/events/:name', (req, res) => {
    const scraperId = req.params.name;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    const listener = (status) => {
        res.write(`data: ${JSON.stringify({ status })}\n\n`);
    };

    // Register events based on the scraperId
    eventEmitter.on(`${scraperId}-scraperRunning`, () => listener('run'));
    eventEmitter.on(`${scraperId}-scraperCompleted`, () => listener('wait'));
    eventEmitter.on(`${scraperId}-scraperStopped`, () => listener('stop'));
  
    // Remove listeners when the client disconnects
    req.on('close', () => {
        eventEmitter.removeListener(`${scraperId}-scraperRunning`, listener);
        eventEmitter.removeListener(`${scraperId}-scraperCompleted`, listener);
        eventEmitter.removeListener(`${scraperId}-scraperStopped`, listener);
    });
});

app.post('/api/getRuns/:name', async(req,res) => {
    try{
        const receivedData = req.body;
        const name = receivedData.name;
        console.log(name);
        const collection = await connectSource(process.env.RUNSDATA);
        const results = await collection.find({ name: name })
            .sort({ creationDate: -1 }) // Sort by createdAt field in descending order
            .limit(10) // Limit to 10 records
            .toArray(); // Convert cursor to array
        //console.log(results);
        res.json(results);


    }
    catch(error){
        console.log(error);
    }


});


module.exports = {
    checkForSemantics, findNameByUrl
}


/*
async function mainTemplate(address, activeNow){
    try {
        let parser = new Parser();
        let rssFeed = await parser.parseURL(address);        
        const firstItem = rssFeed.items[0];
        const linkTo = firstItem.link;
        //console.log(linkTo)
        const pageMetadata = await analyzePage(linkTo); //Získa Sémantické dáta ak to je možné 
        const isCorrect = await checkForSemantics(pageMetadata); //Zisti či sme nedostali 403 - teda nevieme použiť robota. 
        //console.log(pageMetadata);
        console.log(activeNow);
        let newData = "";
        if((!isCorrect && (activeNow === "rssAndSemantics" || activeNow === "onlySemantics")) || activeNow === "onlyRSS"){
            console.log("Semantics are Forbidden");
            newData = await getOnlyRssData(firstItem, address); //Dostali sme 403 a teda pracujeme len z RSS záznamom
        }
        else if(isCorrect){
            if(activeNow === "onlySemantics"){
                newData = await getOnlySemanticsData(pageMetadata, address);
            }
            else if(activeNow === "rssAndSemantics"){
                newData = await createTemplate(firstItem, pageMetadata, address); //Vytvorí sa šablóna podľa ktorej budeme dalej ukladať dáta
            }
        }
        return newData;
        
    } catch (error) {
        console.error('Chyba pri načítaní RSS feedu:', error);
        throw error; // Vyhodenie chyby, ak nastane problém pri načítaní feedu
    }
}

async function getOnlyRssData(rssFeed, address){
    try{
        const nameValue = await findNameByUrl(address);
        const commonValues = {};
        commonValues.sourceID = nameValue;
        for(let key in rssFeed){
            const object = {};
            object.source = "RSS";
            commonValues[key] = object;
        }
        //const collection = await connectSource(process.env.SOURCEDATA);
        //const query = { name: nameValue };
        //await collection.updateOne(query, { $set: { scrapeConfiguration: commonValues } });

        return commonValues;
    }
    catch (error) {
        console.error('Chyba pri tvorbe iba RSS dát', error);
    }   
}


async function getOnlySemanticsData(pageMetadata, address){
    try{
        const nameValue = await findNameByUrl(address);
        const commonValues = {};
        commonValues.sourceID = nameValue;
        for(let key in pageMetadata){
            const object = {};
            object.source = "Semantics";
            commonValues[key] = object;
        }
        //const collection = await connectSource(process.env.SOURCEDATA);
        //const query = { name: nameValue };
        //await collection.updateOne(query, { $set: { scrapeConfiguration: commonValues } });

        return commonValues;
    }
    catch (error) {
        console.error('Chyba pri tvorbe iba Semantických dát', error);
    }
    
}

async function createTemplate(RssData, pageMetadata, address) {

    try {
        const nameValue = await findNameByUrl(address);
        const template = {};
        template.sourceID = nameValue; 
        //const commonValues = {["sourceID"]:nameValue, ...pageMetadata};
        for(let key in pageMetadata){
            const object = {};
            object.source = "Semantics";
            template[key] = object;
        }
        for (let key in RssData) {
            // Ak sa kľúč nenachádza v commonValues, pridáme ho spolu s jeho hodnotou
            if (!pageMetadata.hasOwnProperty(key)) {
                let isThere = false;
                for(let secondKey in pageMetadata){
                    if(key === "guid"){
                        const object = {};
                        object.source = "RSS";
                        template[key] = object;
                    }
                    if(RssData[key] === pageMetadata[secondKey]){
                        isThere = true;
                    }
                }
                if(!isThere){
                    const object = {};
                    object.source = "RSS";
                    template[key] = object;
                }
            }            
        }
        //console.log(commonValues)
    //const collection = await connectSource(process.env.SOURCEDATA);
    //const query = { name: nameValue };
    //await collection.updateOne(query, { $set: { scrapeConfiguration: template } });
    return template;
    }
    catch (error) {
        console.error('Chyba pri porovnávaní výsledkov:', error);
    }

}


app.post('/search', async(req, res) => {
    try{
        const receivedData = req.body;
        let dateFrom;
        let dateTo;
        console.log(receivedData.dateto);
        if(receivedData.datefrom && receivedData.dateto){
            dateFrom = new Date(receivedData.datefrom);
            dateTo = new Date(receivedData.dateto);
        }
        else{
            dateFrom = null;
            dateTo = null;
        }
        const articles = await findArticles(dateFrom, dateTo);
        //console.log(articles);
        res.json(articles);
    }
    catch(error){
        console.log(error);
    }
});
*/