const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

async function createMongoDatabase(){
    const client = new MongoClient(process.env.DATABASE);

    await client.connect();
    const db = client.db();
    console.log('Pripojený k MongoDB');

    await db.createCollection('Versions');
    await db.createCollection('Current_articles');
    await db.createCollection('Data_sources');
    await db.createCollection('lastRuns');

  // Odpojenie od MongoDB
  await client.close();
  console.log('Odpojené od MongoDB');
}

createMongoDatabase().catch(console.error);

