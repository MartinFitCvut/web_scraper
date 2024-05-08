
const dotenv = require('dotenv');
const { connectSource } = require('../utils/connectMongo');
const {existingName, existingUrl, writeNewSource} = require('../utils/checkExistingSource');
const {deleteSource} = require('../utils/deleteSource');
const {getAddress} = require('../utils/getAddress');
const {makeMainStructure} = require('../utils/makeMainStructure');
const {getFirstItem} = require('../utils/getFirstRSSItem');
const {findArticles} = require('../utils/findArticles');
const {searchForVersions, searchForCurrentArticle} = require('../utils/seachForVersions');
const {analyzePage} = require('../utils/analyzePage');
const {definedDataByUser} = require('../utils/defineDataByUser');
const {getPageContent} = require('../utils/puppeteerPage');
const {firstItem} = require('../utils/firstItemData');
const {updateFrequencyData, updateSourceData} = require('../utils/updateFrequency');
const {setScraperActive} = require('../utils/setScraperActive');
const {startAndStopScraper} = require('../utils/startAndStopScraper');
const {TestCronValues} = require('../utils/testCronValues');

const { getCache, setCache } = require('../utils/cache');

dotenv.config();

exports.getSourceData = async(req, res) => {
    try {
        const collection = await connectSource(process.env.SOURCEDATA);
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (error) {
        console.error('Chyba pri získavaní údajov:', error);
        throw error;
    }
}

exports.newData = async(req, res) =>{
    try {
        const receivedData = req.body;
        const name = receivedData.name;
        const url = receivedData.url;
        const newName = await existingName(name); //kontrola či existuje meno
        const newUrl = await existingUrl(url); // kontrola url 
        if(newName && newUrl){
            await writeNewSource(name, url); // Zapísanie nového zdroja
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
}

exports.deleteSource = async(req, res) => {
    try{
        const receivedData = req.params;
        const name = receivedData.name;
        await deleteSource(name);
        res.json("Deleted");
    }
    catch (error) {
        console.error('Chyba:', error);
    }
}

exports.setActiveSetupName = async(req, res) => {
    try{
        const receivedData = req.body;
        const maindata = receivedData.maindata;
        const additionaldata = receivedData.additionaldata;
        const name = receivedData.name;
        const setup = receivedData.activeNow;
        const usejs = receivedData.usejs;
        console.log(usejs);
        const address = await getAddress(name);
        console.log('Setup:', setup);
        const specifiedData = await makeMainStructure(maindata, additionaldata, name, setup, address); //Vytvorenie štruktúry podľa používateľa 
        //console.log(specifiedData);
        if(setup === 'clientConfig'){
            if(specifiedData === "wrong keys"){
                res.json({error: 'wrong keys, prosím skontrolujte či neprepisujete fixne definované časti'});
            }
            else{
                const newData = await definedDataByUser(address ,name,specifiedData, usejs); // Vyhľadávanie v HTML - podsunie šablónu a podľa nej scraper vyhľadáva
                res.json(newData);
            }
        }
        else if(setup === 'onlyRSS' || setup === 'onlySemantics' || setup === 'rssAndSemantics'){ // predefinované šablóny
            const firstRssData = getCache(`${name}_rss`);
            const semanticsData = getCache(`${name}_semantics`);
            const first = await firstItem(specifiedData, firstRssData, semanticsData);
            res.json(first);
        }
        else{
            res.json(false);
        }
    }
    catch (error){
        console.log(error);
    }
}


exports.getIframe = async(req, res) =>{
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
}


exports.searchForArticles = async(req, res) => {
    try{
        const receivedData = req.body;
        const dateFrom = receivedData.datefrom;
        const dateTo = receivedData.dateto;
        //const newDate = new Date(new Date(dateFrom).getTime() + 60 * 60 * 1000); // Adding 1 hour in milliseconds
        const timeFrom = receivedData.timefrom //new Date(receivedData.timefrom).toLocaleTimeString([], { hour12: false });
        const timeTo = receivedData.timeto //new Date(receivedData.timeto).toLocaleTimeString([], { hour12: false });
        const setupSourceID = receivedData.sourceid;
        const setupGuid = receivedData.setupGuid;
        const setWord = receivedData.setWord;
        
        const articles = await findArticles(dateFrom, dateTo, timeFrom, timeTo, setupSourceID, setupGuid, setWord);
        //console.log(articles);
        res.json(articles);
    }
    catch(error){
        console.log(error);
    }
}

exports.searchForVersions = async(req, res) => {
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
}

exports.getEvents = async(req, res) => {
    const scraperId = req.params.name;
    console.log('got event source')

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    const listener = (status) => {
        res.write(`data: ${JSON.stringify({ status })}\n\n`);
    };

    // Register events based on the scraperId
    global.eventEmitter.on(`${scraperId}-scraperRunning`, () => listener('run'));
    global.eventEmitter.on(`${scraperId}-scraperCompleted`, () => listener('wait'));
    global.eventEmitter.on(`${scraperId}-scraperStopped`, () => listener('stop'));
    global.eventEmitter.on(`${scraperId}-scraperError`, () => listener('error'));

  
    // Remove listeners when the client disconnects
    req.on('close', () => {
        global.eventEmitter.removeListener(`${scraperId}-scraperRunning`, listener);
        global.eventEmitter.removeListener(`${scraperId}-scraperCompleted`, listener);
        global.eventEmitter.removeListener(`${scraperId}-scraperStopped`, listener);
        global.eventEmitter.removeListener(`${scraperId}-scraperError`, listener);
    });
}

exports.getRuns = async(req, res) =>{
    try{
        const receivedData = req.body;
        const name = receivedData.name;
        const value = parseInt(receivedData.number)
        console.log(name);
        const collection = await connectSource(process.env.RUNSDATA);
        const results = await collection.find({ name: name })
            .sort({ creationDate: -1 }) // Sort by createdAt field in descending order
            .limit(value) // Limit to 10 records
            .toArray(); // Convert cursor to array
        //console.log(results);
        res.json(results);


    }
    catch(error){
        console.log(error);
    }

}

exports.firstSetupSetting = async(req, res) => {
    try {
        const receivedData = req.body;
        const name = receivedData.name;
        const collection = await connectSource(process.env.SOURCEDATA);
        const query = { name: name };
        const result = await collection.findOne(query);

        if(!getCache(`${name}_rss`)){
            const rss = await getFirstItem(result.url); 
            setCache(`${name}_rss`, rss, 300);   
        }
        if(!getCache(`${name}_semantics`)){
            const rss = getCache(`${name}_rss`);
            const seman = await analyzePage(rss.link);
            setCache(`${name}_semantics`, seman, 300);
        }
        
        const rss = getCache(`${name}_rss`);
        const seman = getCache(`${name}_semantics`);
        //console.log(rss);

        const object = {
            source: result,
            rssdata: rss,
            semantics: seman
        }
        res.json(object);
        if(!getCache(`${name}_loadHTML`)){
            const loadHTML = await getPageContent(rss.link);
            setCache(`${name}_loadHTML`, loadHTML, 300);
        }
        
    
    } catch (error) {
        console.error('Chyba:', error);
        res.status(500).json({ error: 'Nastala chyba pri aktualizácii stavu' });
    }
}

exports.pageSetupComponent = async(req, res) => {
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
        console.log('Setup:', setup);
        const specifiedData = await makeMainStructure(maindata, additionaldata, name, setup, address); //Vytvorenie štruktúry podľa používateľa 
        //console.log(specifiedData);
        if(setup === 'clientConfig'){
            if(specifiedData === "wrong keys"){
                res.json({'error': 'wrong keys, prosím skontrolujte či neprepisujete fixne definované časti'});
            }
            else{
                const newData = await definedDataByUser(address, name, specifiedData, usejs); // Vyhľadávanie v HTML - podsunie šablónu a podľa nej scraper vyhľadáva
                res.json(newData);
            }
        }
        else if(setup === 'onlyRSS' || setup === 'onlySemantics' || setup === 'rssAndSemantics'){ // predefinované šablóny
            let firstRssData;
            let semanticsData;    

            if(!getCache(`${name}_rss`)){
                const rss = await getFirstItem(address); 
                setCache(`${name}_rss`, rss, 300);   
                firstRssData = rss;
            }
            else{
                firstRssData = getCache(`${name}_rss`);
            }
            const linkTo = firstRssData.link;
            if(!getCache(`${name}_semantics`)){
                const seman = await analyzePage(linkTo);
                setCache(`${name}_semantics`, seman, 300);
                semanticsData = seman;
            }
            else{
                semanticsData = getCache(`${name}_semantics`);
            }
            const first = await firstItem(specifiedData, firstRssData, semanticsData);
            //console.log(first);
            res.json(first);
        }
        else{
            res.json(false);
        }
    
    }
    catch (error){
        console.log(error);
    }
}

exports.setScraperRunning = async(req, res) => {
    try {
        const receivedData = req.body;
        const sourceName = receivedData.name;
        const address = await getAddress(sourceName);
        const usejs = receivedData.usejs;
        const frequency = receivedData.frequency;
        const isActive = receivedData.activeNow;
        const delay = receivedData.delay;
        //const frequencyHour = receivedData.frequencyHour;

        if (receivedData.start !== undefined && receivedData.start !== null) { // ked príde od používateľa Start value
            // Vykonaj akciu pre spustenie alebo zastavenie procesu
            if (receivedData.start) {  // ak je true
                
                //if (receivedData.frequency) { //ak je definovaná
                    //const frekvencia = parseInt(receivedData.frequency);
                    const maindata = receivedData.maindata;
                   
                    const additionaldata = receivedData.additionaldata;
                    const setup = receivedData.activeNow;
                   
                    const specifiedData = await makeMainStructure(maindata, additionaldata, sourceName, setup, address); //Vytvor šablónu
                    console.log(specifiedData);
                    const collection = await connectSource(process.env.SOURCEDATA); //zapíš šablónu do databázy
                    const query = { url: address };
                    
                    await collection.updateOne(query, { $set: { scrapeConfiguration: specifiedData, activeConfiguration: setup } }); // update šablóny
                  
                    if(specifiedData === false){  // kontrola či je prázdna 
                        res.json('No data specified');
                    }

                    else if(specifiedData.title.source === '' || specifiedData.link.source === '' || specifiedData.description.source === ''){ // kontrola či sú všetky povinne údaje vyplnené
                        res.json('Please enter mandatory parts');
                    }
                    if(receivedData.frequency === 0){
                        try{
                            let scraperEnd;
                            try{
                                scraperEnd = await setScraperActive(address, usejs, isActive, delay);
                                console.log('Scraper skoncil ',scraperEnd);
                            }
                            catch(error){
                                console.log('hodí mi error dokonca aj tu');
                            }
                            
                            await updateSourceData(sourceName, 'stop');
                            //await updateFrequencyData(sourceName, 0, parseInt(0));
                            await updateFrequencyData(sourceName, 0);
                            if(scraperEnd){
                                emitScraperEvent(sourceName, 'scraperStopped');
                                res.json(true)
                            }
                            else{
                                emitScraperEvent(sourceName, 'scraperError');
                                res.json(false);
                            }
                        }
                        catch(error){
                            console.log('hodí mi error aj tu');
                        }
                        
                        
                    }
                    else {
                        
                        console.log('Starting process...');
                        //await updateFrequencyData(sourceName, frekvencia, parseInt(frequencyHour)); //zmena frekvencie 
                        await updateFrequencyData(sourceName, frequency); //zmena frekvencie 
                        //await startAndStopScraper(sourceName, frekvencia, parseInt(frequencyHour),address, true, usejs); // spusť scraper
                        await startAndStopScraper(sourceName, frequency, address, true, usejs, isActive, delay); // spusť scraper  
                        res.json('started');

                    }
                   
                
            } else {
                console.log('Stopping process...');
                await updateSourceData(sourceName, 'stop');
                //await updateFrequencyData(sourceName, 0, 0);
                await updateFrequencyData(sourceName, 0);
                //stopScraper(sourceName);
                //await startAndStopScraper(sourceName, receivedData.frequency, frequencyHour, address, false, false); //zastavenie scrapera  
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
}

exports.getSpecificRuns = async(req, res) => {
    try{
    const responseData = req.body;
    const newArticles = responseData.newArticles;
    const updatedArticles = responseData.updatedArticles;
    const execution = new Date(responseData.exec_date);
    console.log(newArticles, updatedArticles, execution);
    const collection = await connectSource(process.env.CURRENT);
    const query = {
        guid: {$in: newArticles}
    }
    const newarticles = await collection.find(query).toArray();
    //console.log(newarticles);

    const versionsCollection = await connectSource(process.env.VERSIONS);
    const v_query = {
        $and: [
            {guid: {$in: updatedArticles}},
            {exec_date: execution}
        ]
    }
    const updatearticles = await versionsCollection.find(v_query).toArray();
    //console.log(updatearticles);

    const up_n_query = {
        guid: {$in: updatedArticles}
    }
    const newUpdatearticles = await collection.find(up_n_query).toArray();
    //console.log(newUpdatearticles );
    const obj = { newarticles, updatearticles, newUpdatearticles }
    res.json(obj);
    }
    catch(error){
        console.log(error);
    }
}

exports.cronValuesTester = async(req, res) =>{
    try{
        const value = req.body.value;
        const cronValues = await TestCronValues(value);
        //console.log(cronValues)
        res.json(cronValues);
        
    }
    catch(error){
        console.log(error);
    }

}

function emitScraperEvent(scraperId, event) {
    global.eventEmitter.emit(`${scraperId}-${event}`, { scraperId, status: event });
}


