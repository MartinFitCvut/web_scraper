const { connectSource } = require('./connectMongo');
const dotenv = require('dotenv');
dotenv.config();

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

module.exports = {
    deleteSource
}
