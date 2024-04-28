const puppeteer = require('puppeteer');

async function getPageContent(url) {
    // Launch a new browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    try {
        // Navigate to the specified URL
        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log('Going to page: ', url);

        // Get the page content
        const pageContent = await page.content();
        //console.log(pageContent);
        // Close the browser
        await browser.close();
        console.log('Page closed');

        return pageContent;
    } catch (error) {
        console.error('Error fetching the page:', error);
        await browser.close();
        return null;
    }
}

module.exports = {
    getPageContent
}