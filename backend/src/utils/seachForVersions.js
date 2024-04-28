const dotenv = require('dotenv');
const { connectSource } = require('./connectMongo');
dotenv.config();

async function searchForVersions(versionguid){
    try{
        const collection = await connectSource(process.env.VERSIONS);
        let query = {};
        query.guid = versionguid;
        const versions = await collection.find(query).toArray();
        return versions;
    }
    catch (error) {
        console.log(error);
    }
}

async function searchForCurrentArticle(versionguid){
    try{
        const collection = await connectSource(process.env.CURRENT);
        let query = {};
        query.guid = versionguid;
        const currentArticle = await collection.findOne(query);
        return currentArticle;
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    searchForVersions, searchForCurrentArticle
}