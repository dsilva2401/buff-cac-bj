const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { imageHash }= require('image-hash');
const { expect } = require('chai');
const steps = require('./steps')();
var stringSimilarity = require("string-similarity");

let browser, page = null;

function getImageHash (imageBuffer) {
  return new Promise((resolve, reject) => {
    imageHash({
      data: imageBuffer
    }, 16, true, (error, data) => {
      if(error) {
        reject(error);
        return;
      }
      resolve(data);
    });
  })
}

describe('Consumer App', () => {

  it('Start browser', async () => {
    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXEC_PATH || '/usr/bin/chromium-browser',
      args: ['--no-sandbox'],
      headless: process.env.CI != 'true',
    });
    page = await browser.newPage();
    await page.setViewport({ width: 414, height: 896 });
  })

  steps.forEach(step => {
    it('Step: '+step.description, async () => {
      await step.setupFn({ page });
      let screenshotParams = {}
      if (step.clipScreenshot) {
        screenshotParams.clip = step.clipScreenshot;
      }
      const buffer = await page.screenshot(screenshotParams);
      const baseStateImage = fs.readFileSync(path.join(__dirname, `assets/${step.key}.png`));
      const baseStateImageHash = await getImageHash(baseStateImage);
      const currentHash = await getImageHash(buffer);
      expect(stringSimilarity.compareTwoStrings(baseStateImageHash, currentHash) > 0.9).to.equal(true);
    })
  });

  it('Close browser', async () => {
    await browser.close();
  })

})
