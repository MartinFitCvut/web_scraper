const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');


dotenv.config();

const client =  new MongoClient(process.env.DATABASE);

async function connectSource(collectionType){
    try {
        await client.connect();
        const db = client.db();
        const collection = db.collection(collectionType);
        return collection;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);    
    }
}

module.exports = { connectSource };

