const Parser = require('rss-parser');
const { connectSource } = require('./connectMongo');
const dotenv = require('dotenv');

dotenv.config();

async function existingName(name){
    try{
        const collection = await connectSource(process.env.SOURCEDATA);
        const query  = { name: name };
        const result = await collection.findOne(query);
        if(!result){
            return true;
        }
        else{
            return false;
        }
    }
    catch (error) {
        console.error('Chyba pri vyhľadávaní v databáze pri existingName:', error);
        throw error;
    }   
}

async function existingUrl(url){
    try{
        const collection = await connectSource(process.env.SOURCEDATA);
        const query  = { url: url };
        const result = await collection.findOne(query);
        if(!result){
            try{
                let parser = new Parser();
                let rssFeed = await parser.parseURL(url);        
                const firstItem = rssFeed.items[0];
                if(firstItem === null){
                    return false;
                }
                else{
                    return true;
                }
            }
            catch(error){
                console.log("Neplatná adresa");
                return false;
            }
            
            
        }
        else{
            return false;
        }
    }
    catch (error) {
        console.error('Chyba pri vyhľadávaní v databáze pri existingName:', error);
        throw error;
    } 
}

async function writeNewSource(name, url){
    try{
        const trimName = name.trim();
        const collection = await connectSource(process.env.SOURCEDATA);
        const newData = {
            name: trimName,
            url: url,
            enabled: 'stop',
            frequency: 0,
            scrapeConfiguration: {},
            activeConfiguration: null
        };
        const result = await collection.insertOne(newData);
        console.log("New data inserted:", result.insertedId);
        return true;
    }
    catch (error) {
        console.error('Error while adding new data:', error);
        throw error;
    }

}


module.exports = {
    existingName, existingUrl, writeNewSource
}