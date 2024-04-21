const axios = require('axios');
const cheerio = require('cheerio');

const url = 'http://example.com';

axios.get(url)
  .then(response => {
    const $ = cheerio.load(response.data);
    const title = $('h1').text();
    console.log('Nadpis:', title);
    const findContent = $('div').find('p');
    console.log('Odkazy z iných zdrojov:');
    findContent.each((index, element) => {
      console.log($(element).text());
    });
  })
  .catch(error => {
    console.log('Chyba pri načítaní stránky:', error);
  });
