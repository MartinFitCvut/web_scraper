const parseString = require('rss-url-parser');
const mainStruct = ["rss:title", "rss:description", "rss:pubdate", "rss:link", "rss:guid", "media:content", "media:description", "rss:category", "content:encoded"];

async function getFirstItem(address){
    try{

        let firstItems = {} //rssFeed.items[0];
        const data = await parseString(address);
        
        for(let a = 0; a < 1; a++){
            const nwdata = data[a];
            //console.log(nwdata);
            const template = {}
            mainStruct.forEach(key => {
                if (nwdata[key]) {
                    if(key === "media:content"){
                        const some = nwdata[key]['@'];
                        template.image = some.url;
                    }
                    else if(key === 'media:description'){
                        const some = nwdata[key]['#'];
                        template.image_alt = some;
                    }
                    else{
                        if(key === "content:encoded"){
                            template[key.replace(/:encoded/g, '')] = nwdata[key]['#'];    
                        }
                        else{
                        template[key.replace(/rss:|media:/g, '')] = nwdata[key]['#']; // Odstránenie prefixu a pridanie do nového objektu
                        }
                    }
                    
                }
            });
            for (const key in template) {
                firstItems[key] = template[key]
                    .replace(/<[^>]+>/g, '')
                    .replace(/\n\n/g, '')
                    .trim();
            }
        }
        return firstItems;
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    getFirstItem
};