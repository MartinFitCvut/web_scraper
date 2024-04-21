const puppeteer = require('puppeteer');

(async () => {
  
  const browser = await puppeteer.launch();
  
  const page = await browser.newPage();
 
  await page.goto('http://example.com');

  const title = await page.evaluate(() => {
    const textdata = document.querySelector('h1').innerText;
    return textdata
  });
  console.log('Nadpis h1:', title);

  await browser.close();
})();
