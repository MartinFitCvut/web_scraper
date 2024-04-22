
async function connectSource(client, collectionType){
    try {
        await client.connect();
        //console.log("Connected to the database");
        const db = client.db();
        const collection = db.collection(collectionType);
        return collection;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);    
    }
}

module.exports = {
    connectSource
}