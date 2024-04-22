async function createMainTemplate(activeNow, firstItem, pageMetadata, nameValue, isCorrect){
    try{
       
        const fixedParams = ["title", "description", "link", "pubdate", "guid", "url"];
        
        let template = {};

        template.sourceID = nameValue; 
        template.title = {source: ''};
        template.link = {source: ''};
        template.description = {source: ''};
        template.pubdate =  {source: 'RSS'};
        template.guid = {source: 'RSS'};   

        //console.log(isCorrect);
        if((!isCorrect && (activeNow === "rssAndSemantics" || activeNow === "onlySemantics")) || activeNow === "onlyRSS"){
            //console.log("Semantics are Forbidden");
            template.title = {source: 'RSS'};
            template.link = {source: 'RSS'};
            template.description = {source: 'RSS'};
            for(let key in firstItem){
                if (fixedParams.includes(key)) {
                    continue; // Preskočí tento kľúč a pokračuje na ďalší
                }
                const object = {};
                object.source = "RSS";
                template[key] = object;
            }
        }
        else if(isCorrect){
            if(activeNow === "onlySemantics"){
                template.title = {source: 'Semantics'};
                template.link = {source: 'Semantics'};
                template.description = {source: 'Semantics'};
                for(let key in pageMetadata){
                    if (fixedParams.includes(key)) {
                        continue; // Preskočí tento kľúč a pokračuje na ďalší
                    }
                    const object = {};
                    object.source = "Semantics";
                    template[key] = object;
                }
                //newData = await getOnlySemanticsData(pageMetadata, address);
            }
            else if(activeNow === "rssAndSemantics"){
                template.title = {source: 'Semantics'};
                template.link = {source: 'Semantics'};
                template.description = {source: 'Semantics'};
                for(let key in pageMetadata){
                    if (fixedParams.includes(key)) {
                        continue; // Preskočí tento kľúč a pokračuje na ďalší
                    }
                    const object = {};
                    object.source = "Semantics";
                    template[key] = object;
                }
                for (let key in firstItem) {
                    // Ak sa kľúč nenachádza v commonValues, pridáme ho spolu s jeho hodnotou
                    if (!pageMetadata.hasOwnProperty(key)) {
                        let isThere = false;
                        for(let secondKey in pageMetadata){
                            if(firstItem[key] === pageMetadata[secondKey]){
                                isThere = true;
                            }
                        }
                        if(!isThere){
                            const object = {};
                            object.source = "RSS";
                            template[key] = object;
                        }
                    }            
                }
                //newData = await createTemplate(firstItem, pageMetadata, address); //Vytvorí sa šablóna podľa ktorej budeme dalej ukladať dáta
            }
        }

        return template;

    }
    catch (error) {
        console.log('Error in template.js : ', error);
    }
}

module.exports = {
    createMainTemplate
};