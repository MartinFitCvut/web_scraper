const express = require('express');
const router = express.Router();
const userControlers = require('../controlers/userControlers');


router.get('/', userControlers.getSourceData);

// Vloženie nového zdroja
router.post('/api/newSource', userControlers.newData); 

router.delete('/api/delete/Source/:name', userControlers.deleteSource);

//Nastanie informácií od užívateľa, to čo si užívateľ konfuguruje sám
router.post('/api/setActive/SetUp/:name', )

//Spustenie a zastavenie scrapera
router.post('/api/setActive/:name/setup', )

// Získanie a vypísanie prvého definovaného článku - použité ak používať si zobrazí konfiguráciu scrapera tak mu vybehne článok podľa predtým definovaných pravidiel.
router.post('/api/setActive/:name', )

//Odoslanie url adresy prvého článku z RSS na to aby sa na frontend vykreslil pomocou iframe
router.get('/api/frame/:name', )

//Vyhľadávanie
router.post('/search', )

//Verzie článkov
router.post('/api/versions', )

//Eventy pri spustení a zastavení
router.get('/events/:name',)

//Posledné behy
router.post('/api/getRuns/:name', );

module.exports = router;
