const {createMainTemplate} = require('./createMainTemplate');

function checkForMainKeysReppetition(data){

    const wrongKeys = ["title", "link", "description", "guid", "pubdate"];
    const containsWrongKey = (key) => {
        return wrongKeys.includes(key);
    };
    if(data === null)
    {
        return true;
    }
    for(key in data){
        console.log(key);
        if (containsWrongKey(key)) {
            return false; // Ak sa nachádza nesprávny kľúč, ukončite iteráciu a vráťte false
        }
        else{
            return true;
        }
    }
}

async function checkForSemantics(data){
    if(data === "403"){
        return false;
    }
    else{
        return true;
    }
}
//Funkcia ktorá berie ako vstup dáta z frontend a vytvára šablónu pre nich - ak je definované aj iné ako RSS a Semantics
async function makeMainStructure(maindata, additionaldata, name, setup, address){
    try{
        let additionalDataObject = '';
        let wrongKeys = true;
        console.log(additionaldata);
        if(setup === 'clientConfig'){ // Ak sa mi vráti hodnota že klient definoval svoje dáta
            if(additionaldata !== ''){
                additionalDataObject = JSON.parse(additionaldata);
                wrongKeys = checkForMainKeysReppetition(additionalDataObject);
                //console.log(wrongKeys);
            }
            if(!wrongKeys){
                //console.log('wrong keys')
                return "wrong keys";
            }
            else{
            
                    const nameValue = {sourceID: name};
                    const staticValues = {guid: {source: 'RSS'}, pubdate: {source: 'RSS'}}
                    const combinedData= { ...nameValue, ...maindata, ...staticValues, ...additionalDataObject };
                    return combinedData;
            }   
        }
        else if(setup === 'onlyRSS' || setup === 'onlySemantics' || setup === 'rssAndSemantics'){ // ak si používateľ vybral spomedzi extistujúcich šablón
            //console.log(setupOfScrapperStructure);
            const isCorrect = await checkForSemantics(semanticsData);
            const setupOfScrapper= await createMainTemplate(address, setup, firstRssData, semanticsData, name, isCorrect);
            return setupOfScrapper;
        }
        else{
            return false;
        }
    }
    catch (error) {
        console.log(error); 
    }
}


module.exports = {
    makeMainStructure, checkForSemantics
}