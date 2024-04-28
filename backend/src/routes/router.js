const express = require('express');
const router = express.Router();
const userControlers = require('../controlers/userControlers');


router.get('/', userControlers.getSourceData);

// Vloženie nového zdroja
router.post('/api/newSource', userControlers.newData); 

router.delete('/api/delete/Source/:name', userControlers.deleteSource);

//Nastanie informácií od užívateľa, to čo si užívateľ konfuguruje sám
router.post('/api/setActive/SetUp/:name', userControlers.pageSetupComponent);

//Spustenie a zastavenie scrapera
router.post('/api/setActive/:name/setup', userControlers.setScraperRunning);

// Získanie a vypísanie prvého definovaného článku - použité ak používať si zobrazí konfiguráciu scrapera tak mu vybehne článok podľa predtým definovaných pravidiel.
router.post('/api/setActive/:name', userControlers.firstSetupSetting);

//Odoslanie url adresy prvého článku z RSS na to aby sa na frontend vykreslil pomocou iframe
router.get('/api/frame/:name', userControlers.getIframe);

//Vyhľadávanie
router.post('/search', userControlers.searchForArticles)

//Verzie článkov
router.post('/api/versions', userControlers.searchForVersions);

//Eventy pri spustení a zastavení
router.get('/events/:name', userControlers.getEvents);

//Posledné behy
router.post('/api/getRuns/:name', userControlers.getRuns);

router.post('/api/getSpecificRun/:name', userControlers.getSpecificRuns);

router.post('/api/cronValuesTester', userControlers.cronValuesTester);

module.exports = router;
