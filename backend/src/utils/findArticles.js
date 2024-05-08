const dotenv = require('dotenv');
const {connectSource} = require('./connectMongo');

dotenv.config();

async function findArticles(dateFrom, dateTo, timeFrom, timeTo, setupSourceID, setupGuid, setWord){
    try{
        const collection = await connectSource(process.env.CURRENT);
        await collection.createIndex({title: "text", description: "text"});
        let query = {};
        let dateTimeFrom; // Adding 1 hour in milliseconds; 
        let dateTimeTo;
        //console.log(dateTo);
        if (dateFrom !== null) {
            // Add condition for dateFrom if it's specified
            const realDateTime = new Date(new Date(dateFrom).getTime() + 60 * 60 * 1000).toISOString();
            //console.log(realDateTime.toISOString());
            if(timeFrom !== null){
                const time = new Date(timeFrom).toLocaleTimeString('en-US', { hour12: false });
                const date = realDateTime.split('T')[0];
                //console.log(date);
                dateTimeFrom = date + 'T' + time + '.000Z';
                //console.log(dateTimeFrom)
                //console.log(new Date(dateTimeFrom));
                query.pubdate = { $gte: new Date(dateTimeFrom) };
            }
            else{
                dateTimeFrom = realDateTime;
                query.pubdate = { $gte: new Date(dateTimeFrom)};
            }
        }
        

        // Check if dateTo is specified
        if (dateTo !== null) {
            console.log(dateTo)
            const realDateTime = new Date(new Date(dateTo).getTime() + 2 * 60 * 60 * 1000).toISOString();
            console.log(realDateTime);
            //console.log(realDateTime);
            if(timeTo !== null){
                const time = new Date(timeTo).toLocaleTimeString('en-US', { hour12: false });
                const date = realDateTime.split('T')[0];
                dateTimeTo = date + 'T' + time + '.000Z';
                console.log(dateTimeTo)
                query.pubdate = dateTimeFrom !== null ? { ...query.pubdate, $lte: new Date(dateTimeTo)} : { $lte: new Date(dateTimeTo) };
            }
            else{
                const time = '23:59:00';
                const date = realDateTime.split('T')[0];
                const dateTimeTo = date + 'T' + time + '.000Z';
                console.log(dateTimeTo);
                query.pubdate = dateTimeFrom !== null ? { ...query.pubdate, $lte: new Date(dateTimeTo) } : { $lte: new Date(dateTimeTo) };
            } 
        }
        
        if(setupSourceID !=null){
            query.sourceID = setupSourceID;
        }

        if(setupGuid !=null){
            query.guid = setupGuid;
        }

        if(setWord !== ''){
            query.$text = { $search: setWord };
        }
        console.log(query);
       
        const articles = await collection.find(query).toArray();
        return articles;
    }
    catch (error) {

    }
}

module.exports = {
    findArticles
}