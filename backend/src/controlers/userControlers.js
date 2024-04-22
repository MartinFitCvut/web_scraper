
const dotenv = require('dotenv');
const { connectSource } = require('../utils/connectMongo');
const {existingName, existingUrl, writeNewSource} = require('../utils/checkExistingSource');
const {deleteSource} = require('../utils/deleteSource');
const {getAddress} = require('../utils/getAddress');
const {makeMainStructure} = require('../utils/makeMainStructure');
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



















//module.exports = { getSourceData }

/*
import dotenv from 'dotenv';

import connectSource from '../utils/connectMongo.js';


dotenv.config();

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

export default getSourceData;
*/