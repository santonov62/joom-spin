import puppeteer from 'puppeteer';
const URL = 'https://www.joom.com/ru/products/6399a19482b2fe01d2aab4c1?utm_source=admitad&utm_medium=partners&utm_campaign=202779&admitad_uid=60c20531bbe20471bccaf77279dcd464';

let doSpin = true;

while (doSpin) {
    doSpin = await spin('30%');
}

// spin('30%');

async function spin(winMarker) {
    const browser = await puppeteer.launch({headless: false});
    try {
        const page = await browser.newPage();

        await page.goto(URL, {
            waitUntil: 'domcontentloaded'
        });

        const element = await page.waitForSelector('.promoLink___GmqRn');
        await element.click();
        await page.waitForNetworkIdle();

        const spinWheel = await page.waitForSelector('.button___MLezn', {timeout: 5000});
        await spinWheel.click();

        await page.waitForFunction(() => {
            const result = document.querySelector('.title___fY2RP').innerHTML;
            return result.includes('поздравления');
        });
        const result = await page.waitForSelector('.container___pqK9B');
        const reward = await result.$eval('.message___ou0QA', node => node.textContent)
        console.log('done', reward);
        const win = reward.includes(winMarker);
        if (win) {
            return false;
        }
    } catch(e) {
        console.log(e)
    }
    await browser.close();
    return true;
}