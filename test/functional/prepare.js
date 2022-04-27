const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const steps = require('./steps')();

let browser, page = null;
const assetsPath = path.join(__dirname, 'assets');

(async function () {

  browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXEC_PATH || '/usr/bin/chromium-browser',
    args: ['--no-sandbox'],
    // headless: false,
  });
  page = await browser.newPage();
  await page.setViewport({ width: 414, height: 896 });

  for (let step of steps) {
    console.log(`Starting "${step.key}" step`);
    const startTimestamp = Date.now();
    await step.setupFn({ page });
    let screenshotParams = {}
    if (step.clipScreenshot) {
      screenshotParams.clip = step.clipScreenshot;
    }
    const buffer = await page.screenshot(screenshotParams);
    fs.writeFileSync(path.join(assetsPath, `${step.key}.png`), buffer);
    console.log(`Step "${step.key}" completed (${Date.now() - startTimestamp} ms)`);
  }

  await browser.close();

})();