const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');

// Funkcia na načítanie a analýzu HTML zadaného URL
async function analyzePage(url) {
    try {
        const response = await axios.get(url, {
            headers: {
              'User-Agent': 'Master-thesis'
            }
          });
       
        const $ = cheerio.load(response.data);

        const metadata = {};

        // Kontrola, či existujú meta tagy
        if ($('meta[property^="og:"]').length === 0) {
            throw new Error('Na stránke sa nenašli meta dáta.');
        }

        $('meta[property^="og:"]').each(function () {
            const key = $(this).attr('property').replace('og:', '');
            const value = $(this).attr('content');
            metadata[key] = value;
        });

        // Kontrola, či boli získané nejaké meta dáta
        if (Object.keys(metadata).length === 0) {
            throw new Error('Neboli získané žiadne meta dáta.');
        }

        return metadata;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return "403"; // Vrátiť chybovú odpoveď
          } else {
            throw error; // Vrátiť chybu a nechať ju spracovať ďalšie bloky catch
          }
    }
}

module.exports = {
    analyzePage
};

// Vyhľadávanie OpenGraph značiek
                /*
                $('meta[property], meta[data-ima-meta]').each(function() {
                    const key = $(this).attr('property') || $(this).attr('data-ima-meta');
                    const value = $(this).attr('content');
                    metadata[key] = value;
                });*/
 
 /* //Vyhľadávanie pomocou mikrodát        
        $('[itemscope]').each(function () {
                const itemType = $(this).attr('itemtype');
                const itemProps = $(this).find('[itemprop]');
                const properties = {};

                itemProps.each(function () {
                    const propName = $(this).attr('itemprop');
                    let propValue;
                    // Ak má element atribút "content", použijeme jeho hodnotu
                    if ($(this).attr('content')) {
                        propValue = $(this).attr('content');
                    } else {
                        propValue = $(this).text().trim();
                    }
                    properties[propName] = propValue;
                });

                metadata[itemType] = properties;
            });*/    


// Použitie funkcie na analýzu stránky
/*const url = 'https://www.idnes.cz/zpravy/domaci/doprava-praha-protest-traktor-zemedelci.A240219_084245_domaci_rapc'; // tu zadaj URL adresu, ktorú chceš analyzovať
analyzePage(url)
    .then(metadata => {
        console.log('Sémantické dáta na stránke:', metadata);
    })
    .catch(error => {
        console.error('Chyba pri analýze stránky:', error);
    });

*/
/*
function analyzePage(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                const $ = cheerio.load(body);
                const metadata = {};
                console.log($);
                $('meta[property^="og:"]').each(function () {
                    const key = $(this).attr('property').replace('og:', '');
                    const value = $(this).attr('content');
                    metadata[key] = value;
                });
                resolve(metadata);
            }
        });
    });
}
*/

/*
async function analyzePage(url) {
    try {
        const response = await axios.get(url, {
            headers: {
              'User-Agent': 'Master-thesis'
            }
          });
        const $ = cheerio.load(response.data);

        const metadata = {};

        // Kontrola, či existujú meta tagy
        if ($('meta[property^="og:"]').length === 0) {
            throw new Error('Na stránke sa nenašli meta dáta.');
        }

        $('meta[property^="og:"]').each(function () {
            const key = $(this).attr('property').replace('og:', '');
            const value = $(this).attr('content');
            metadata[key] = value;
        });

        // Kontrola, či boli získané nejaké meta dáta
        if (Object.keys(metadata).length === 0) {
            throw new Error('Neboli získané žiadne meta dáta.');
        }

        return metadata;
    } catch (error) {
        throw error;
    }
}
*/
/*
function analyzePage(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
                reject(error);
            }else if (response.statusCode === 403) {
                //reject(new Error('Požiadavka bola odmietnutá (403 Forbidden).'));
                console.log("Responce je 403");
            }else {
                const $ = cheerio.load(body);
                const metadata = {};

                // Kontrola, či existujú meta tagy
                if ($('meta[property^="og:"]').length === 0) {
                    //reject(new Error('Na stránke sa nenašli meta dáta.'));
                    console.log("Na stránke sa nenašli meta dáta.");
                }

                $('meta[property^="og:"]').each(function () {
                    const key = $(this).attr('property').replace('og:', '');
                    const value = $(this).attr('content');
                    metadata[key] = value;
                });

                // Kontrola, či boli získané nejaké meta dáta
                if (Object.keys(metadata).length === 0) {
                    reject(new Error('Neboli získané žiadne meta dáta.'));
                }

                resolve(metadata);
            }
        });
    });
}
*/