const cheerio = require('cheerio');
const axios = require('axios');

async function removeNoscriptTags(html) {
    try{
    // Regular expression for finding <noscript> tags and their contents
    //console.log(html);
    const regex = /<noscript\b[^>]*>|<\/noscript>/gi
    
    // Replace all occurrences of <noscript> tags with an empty string
    const cleanedHtml = html.replace(regex, '');
    //console.log('+ ', cleanedHtml, ' + ')
    return cleanedHtml;
    }
    catch (error){
        console.log(error);
    }
}

async function findElements(url, selector, loadHTML) {
    try {
        let usedHTML;
        if(loadHTML === null){
            //console.log('Using axios')
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Master-thesis'
                }
            });
            usedHTML = await removeNoscriptTags(response.data);
        }
        else{
            //console.log('Using puppeteer')
            usedHTML = usedHTML = await removeNoscriptTags(loadHTML);
        }
        
        //console.log('Selector: ',selector);
        const $ = cheerio.load(usedHTML);
        let elements;
        //console.log(selector);
        if(selector.includes("[") && selector.includes("]")){
            const attributeName = selector.substring(selector.indexOf("[") + 1, selector.indexOf("]"));
            //console.log(attributeName);
            elements = $(selector).map(function() {
                return $(this).attr(attributeName);
            }).get();
        }
        else if (selector.includes('trim()')) {
            const trimSelector = selector.replace('trim()', '');
            elements = $(trimSelector)
                .map((index, element) => {
                    const text = $(element).text().trim();
                    return text !== '' ? text : null;
                })
                .get()
                .filter(Boolean) 
                .join('\n');
        }

        else if(selector.includes('onlyValue()')){
            const trimSelector = selector.replace('onlyValue()', '');
            elements = $(trimSelector)
                .text() // získať textový obsah z vyhľadávaného elementu
                .split('\n') // rozdeliť text na riadky
                .map(line => line.trim()) // odstrániť medzery na začiatku a na konci každého riadku
                .filter(Boolean) // odstrániť prázdné riadky
                
                 
        }

        else if(selector.includes('children(')){
            const source = selector.split('children(');
            //console.log(s);
            const regex = /children\(([^)]+)\)/;
            const matches = selector.match(regex);
            //console.log(matches[1]);
            const parentSelectors = source[0];
            const childSelectors = matches[1]
            //console.log(parentSelectors);
            //console.log(childSelectors);
            elements = $(parentSelectors)
                    .children(childSelectors)
                    .map((index, element) => $(element).text().trim())
                    .get()
                    .filter(Boolean);
   
            /*
            if (matches && matches.length === 3) {
                const parentSelectors = matches[1];
                const childSelectors = matches[2].trim();
                console.log(parentSelectors);
                console.log(childSelectors);
                elements = $(parentSelectors).children(childSelectors);    
            }*/
        }
        else{
            elements = $(selector).text().trim();
        }
        
        return elements;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return "403"; // Vrátiť chybovú odpoveď
        } else {
            console.log('Error in elements');
            //throw error; // Vrátiť chybu a nechať ju spracovať ďalšie bloky catch
            return false;
        }
    }
}

module.exports = {
    findElements
};


