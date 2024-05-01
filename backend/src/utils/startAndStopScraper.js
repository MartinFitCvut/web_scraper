

const dotenv = require('dotenv');
const {setScraperActive} = require('./setScraperActive');
const { getCache, setCache } = require('../utils/cache');
const cron = require('node-cron');
const {updateSourceData} = require('./updateFrequency');
require('./global');

dotenv.config();


function emitScraperEvent(scraperId, event) {
    global.eventEmitter.emit(`${scraperId}-${event}`, { scraperId, status: event });
}
//async function startAndStopScraper(sourceName, frequency, frequencyHour, address, startOrStop, usejs) {
async function startAndStopScraper(sourceName, frequency, address, startOrStop, usejs, isActive, delay) {
    // Inicializácia premennej scrapersInFunction, ak nie je definovaná
    //scrapersInFunction[sourceName] = scrapersInFunction[sourceName] || false;
    //const eventEmitter = getCache('events');
    //console.log('eventEmitter: ',eventEmitter);
    
    //let runningScrapers = getCache('runningScrapers');
    //let scrapersInFunction = getCache('scrapersInFunction'); 

    console.log(frequency);
    console.log(global.runningScrapers);
    console.log(global.scrapersInFunction);
    if (startOrStop) { //Ak je true tak zapínam scraper
        /*
        if (frequency > 0 || frequencyHour > 0) { //Ak je frekvencia väčšia ako 0 spúšťam opakované scrapovanie na základe tejto hodnoty
            let minutes = frequency;
            let hours = frequencyHour;
            let days = 0;
            if(hours === 24){
                minutes = 0;
                hours = 0;
                days = 1;
            }*/

            if (global.runningScrapers[sourceName]) { // Zisťujem či scraper bol už aktivovaný 
                if (global.scrapersInFunction[sourceName]) { // Check či scraper právé beži teda či sťahuje dáta 
                    // Čakáme, kým sa predchádzajúca úloha dokončí
                    while (global.scrapersInFunction[sourceName]) {
                        //scrapersInFunction = getCache('scrapersInFunction');
                        console.log(sourceName, "waiting for end");
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                    console.log(sourceName, "ended");
                    //setCache('runningScrapers', runningScrapers, 0);
                } else {
                    global.runningScrapers[sourceName].stop(); //Zastavenie scrapera pre novú inicializáciu

                    await setScraperActive(address, usejs, isActive, delay);
                    const taskId = cron.schedule(`${frequency}`, async () => {  //Nastavenie časovača kedy sa scraper bude spúštať
                        console.log('Running upadated scraper for', sourceName);
                        try {
                            await setScraperActive(address, usejs, isActive, delay);  //Spustenie scrapera
                        } catch (error) {
                            console.error('Chyba pri spustení scraperu:', error);
                        }
                    });
                    // Uložíme referenciu na novú cron úlohu pre daný zdroj
                    global.runningScrapers[sourceName] = taskId; 
                    taskId.start();
                    //setCache('runningScrapers', runningScrapers, 0);
                }
            } else { // Ak scraper aktivovaný ešte nebol alebo je vypnutý 
                // Ak pre daný zdroj už beží cron úloha, zrušíme ju a vytvoríme novú
                    await setScraperActive(address, usejs, isActive, delay);
                    const taskId = cron.schedule(`${frequency}`, async () => {  //spustenie scrapera 
                    console.log('Running new scraper for', sourceName);
                    try {
                        await setScraperActive(address, usejs, isActive, delay);
                    } catch (error) {
                        console.error('Chyba pri spustení scraperu:', error);
                    }
                    taskId.start();
                });
                // Aktualizujeme referenciu na cron úlohu pre daný zdroj
                global.runningScrapers[sourceName] = taskId;
                
            }
        //}
    } else if (!startOrStop) { //Zastavenie scrapera 
        // Zastavíme cron úlohu pre daný zdroj
        //runningScrapers = getCache('runningScrapers')
        if (global.runningScrapers[sourceName]) {
            global.runningScrapers[sourceName].stop(); 
            delete global.runningScrapers[sourceName]; 
            console.log(global.runningScrapers);
            console.log(global.scrapersInFunction);
            //setCache('runningScrapers', runningScrapers, 0);
            //console.log(sourceName, " stopped");
            
            //eventEmitter.emit(`${sourceName}-${'scraperStopped'}`, { sourceName, status: 'scraperStopped' });
            emitScraperEvent(sourceName, 'scraperStopped');
            
            await updateSourceData(sourceName, 'stop');
            //eventEmitter.emit('scraperStoped', { name: sourceName });
        } else {
            console.log("No running scraper found for", sourceName);
        }
    }
    //setCache('runningScrapers', runningScrapers, 0);
    //setCache('runningScrapers', runningScrapers, 0);
}

module.exports = {
    startAndStopScraper
}