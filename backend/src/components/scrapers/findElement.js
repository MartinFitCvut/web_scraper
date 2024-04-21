/*
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function removeNoscriptTags(html) {
    try {
        const regex = /<noscript\b[^>]*>|<\/noscript>/gi;
        const cleanedHtml = html.replace(regex, '');
        return cleanedHtml;
    } catch (error) {
        console.log(error);
    }
}

async function findElements(url, selector, html) {
    try {
        //const cleanedHtml = await removeNoscriptTags(html);
        const $ = cheerio.load(html);

        let elements;

        if (selector.includes("[")) {
            const attributeName = selector.substring(selector.indexOf("[") + 1, selector.indexOf("]"));
            elements = $(selector).map(function() {
                return $(this).attr(attributeName);
            }).get();
        } else if (selector.includes('trim()')) {
            const trimSelector = selector.replace('trim()', '');
            elements = $(trimSelector)
                .map((index, element) => {
                    const text = $(element).text().trim();
                    return text !== '' ? text : null;
                })
                .get()
                .filter(Boolean)
                .join('\n');
        } else {
            elements = $(selector).text().trim();
        }

        return elements;
    } catch (error) {
        if (error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
            return "403"; // Vrátiť chybovú odpoveď
        } else {
            throw error; // Vrátiť chybu a nechať ju spracovať ďalšie bloky catch
        }
    }
}

module.exports = {
    findElements
};
*/

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

async function findElements(url, selector, loadHTML) {
    try {
        let usedHTML;
        if(loadHTML === null){
            console.log('Using axios')
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Master-thesis'
                }
            });
            usedHTML = await removeNoscriptTags(response.data);
        }
        else{
            console.log('USING puppeteer')
            usedHTML = loadHTML;
        }
        /*
       
        */
        
        
        //const cleanedHtml = await removeNoscriptTags(response.data);
        //const cleanedHtml = await removeNoscriptTags(loadHTML);
        console.log('Selector: ',selector);
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


/*
async function getPositionInfo(html, htmlPart, depth = 1) {
    try {
        const $ = cheerio.load(html);
        let positionInfo = {};

        const search = ($element, depth) => {
            if (depth === 0) return; // Ukončiť hľadanie, ak sme dosiahli maximálnu hĺbku
            const tag = $element.prop("tagName");

            // Ak sa v aktuálnom elemente nachádza hľadaný text, zistíme jeho polohu
            if ($element.html().includes(htmlPart)) {
                const parentChildren = $element.parent().children(); // Získajte všetky deti rodičovského elementu
                const filteredChildren = parentChildren.filter((index, el) => el.type === 'tag'); // Filter na elementy typu tag
                const position = filteredChildren.index($element); // Index je od nuly
                const totalChildren = filteredChildren.length;

                if (position === 0) {
                    positionInfo = { position: 'first', total: totalChildren };
                } else if (position === totalChildren - 1) { // Pozícia je index + 1
                    positionInfo = { position: 'last', total: totalChildren };
                } else {
                    positionInfo = { position: `eq(${position})`, total: totalChildren }; // Indexovanie je od nuly
                }
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

        return positionInfo;
    } catch (error) {
        console.log(error);
        return {};
    }
}


async function getPositionInfo(html, htmlPart, parentDepth = 3) {
    try {
        const $ = cheerio.load(html);
        let positionInfo = {};

        const search = ($element, depth) => {
            if (depth === 0) return; // Ukončiť hľadanie, ak sme dosiahli maximálnu hĺbku

            // Ak sa v aktuálnom elemente nachádza hľadaný text
            if ($element.html().includes(htmlPart)) {
                let currentPosition = $element;
                const positions = [];
                
                // Prechádzame nadradenými elementmi podľa zadaného hĺbky
                for (let i = 0; i < parentDepth; i++) {
                    const parent = currentPosition.parent();
                    if (parent.length === 0) break; // Ak už nie sú ďalšie nadradené prvky, skončíme
                    //const parentChildren = $element.parent().children();
                    const siblings = parent.children().filter((index, el) => el.type === 'tag'); // Získame súrodenčov nadradeného prvku
                    //const siblings = parentChildren.filter((index, el) => el.type === 'tag');
                    const position = siblings.index(currentPosition); // Zistíme polohu aktuálneho prvku vo vzťahu k súrodencom
                    console.log(position);
                    positions.unshift(position + 1); // Pridáme pozíciu na začiatok poľa (indexovanie je od nuly)
                    currentPosition = parent; // Nastavíme nadradený prvok ako aktuálny prvok pre ďalšie porovnávanie
                }
                
                positionInfo = { positions }; // Uložíme všetky pozície do výsledku
            }

            return positionInfo;
        };

        // Prechádzame všetky elementy v HTML
        $('body').find('*').each((index, element) => {
            const info = search($(element), parentDepth);
            if (Object.keys(info).length !== 0) { // Ak sme našli hľadaný text, ukončíme iteráciu
                return false;
            }
        });

        return positionInfo;
    } catch (error) {
        console.log(error);
        return {};
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
            console.log(index, elements.length);
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

*/