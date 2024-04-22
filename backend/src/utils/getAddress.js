const { connectSource } = require('./connectMongo');
const dotenv = require('dotenv');
dotenv.config();

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

module.exports = {
    getAddress
}