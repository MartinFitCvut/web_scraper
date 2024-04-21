const request = require('request');
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

async function checkforSelektor(html, htmlPart, depth = 3) {
    try {
        const $ = cheerio.load(html);
        const results = new Map(); // Použitie Map na uchovávanie unikátnych výsledkov

        const search = ($element, depth) => {
            if (depth === 0 || results.length > 0) return; // Ukončiť hľadanie, ak sme dosiahli maximálnu hĺbku
            const tag = $element.prop("tagName");
            const className = $element.attr("class");
            const id = $element.attr("id");

            // Ak sa v aktuálnom elemente nachádza hľadaný text a nie je už v zozname výsledkov, pridáme ho do zoznamu
            if (($element.html().includes(htmlPart) || $element.hasClass(htmlPart)) && !results.has(tag + className + id)) {
                results.set(tag + className + id, {
                    tag,
                    class: className,
                    id
                });
            }

            // Pokračujeme vyššie v strome
            const parent = $element.parent();
            if (parent.length > 0) {
                search(parent, depth - 1);
            }
        };

        $('body').find('*').each((index, element) => {
            search($(element), depth);
        });
        
        const finalResults = Array.from(results.values());
        // Vráť posledné štyri záznamy zo zoznamu výsledkov
        return finalResults.slice(-4);
        //return Array.from(results.values());
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function getPositionInfo(elements){
    try{
        let selector = '';
        var index = 0;
        elements.forEach(element => {
            index++;
            //console.log(index, elements.length);
            const tag = element.tag;
            const classAttr = element.class;
            const idAttr = element.id;
            
            if((classAttr === undefined && idAttr !== undefined) || (classAttr !== undefined && idAttr !== undefined)){
                const newString = tag.toLowerCase() + '#' + idAttr 
                const newSelector = selector;
                selector = newSelector.concat(newString);
                //console.log(selector);
            }
            else if(classAttr !== undefined && idAttr === undefined){
                if(classAttr.includes(" ")){
                    const newClass = classAttr.substring(0, classAttr.indexOf(' '));
                    const newString = tag.toLowerCase() + '.' + newClass; 
                    const newSelector = selector;
                    selector = newSelector.concat(newString);
                    //console.log(selector);
                }
                else{
                    const newString = tag.toLowerCase() + '.' + classAttr; 
                    const newSelector = selector;
                    selector = newSelector.concat(newString);
                    //console.log(selector);
                }
            }
            else {
                const newString = tag.toLowerCase();
                const newSelector = selector;
                selector = newSelector.concat(newString);
                //console.log(selector);
            }
        if(index < elements.length){
            const newSelector = selector;
            selector = newSelector.concat(" > ");
        }
        })
        return selector;
    }
    catch (error) {
        console.log(error);
    }

}


async function findParrentForElements(url, selector) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Master-thesis'
            }
        });
        
        const cleanedHtml = await removeNoscriptTags(response.data);
        const findRes = await checkforSelektor(cleanedHtml, selector);
        const res = await getPositionInfo(findRes);
        console.log(res);
        return res;

    } catch (error) {
        if (error.response && error.response.status === 403) {
            return "403"; // Vrátiť chybovú odpoveď
        } else {
            throw error; // Vrátiť chybu a nechať ju spracovať ďalšie bloky catch
        }
    }
}

module.exports = {
    findParrentForElements
};


