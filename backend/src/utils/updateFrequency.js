const { connectSource } = require("./connectMongo");

async function updateFrequencyData(name, minutes, hours) {
    try {
        const newFrequency = `${hours}h-${minutes}m`;
        const collection = await connectSource(process.env.SOURCEDATA);
        const existingData = await collection.findOne({ name: name });
        if (!existingData) {
            throw new Error('Záznam sa nenašiel');
        }
        const query = { name: name };
        await collection.updateOne(query, { $set: { frequency: newFrequency } });
        //client.close();
        
    } catch (error) {
        console.error('Chyba pri aktualizácii údajov:', error);
        throw error;
    }
}

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

module.exports = {
    updateFrequencyData, updateSourceData
}