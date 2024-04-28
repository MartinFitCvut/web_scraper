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

