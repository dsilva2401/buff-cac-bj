
module.exports = () => {
  return [

    {
      key: 'product-loaded',
      description: 'Product loaded',
      setupFn: async ({ page }) => {
        await page.goto('https://staging.brij.it/c/Y8RQ');
        await page.waitForTimeout(12000);
      }
    },

    {
      key: 'more-options-expanded',
      description: 'More options expanded',
      setupFn: async ({ page }) => {
        await page.evaluate( function(){
          document.getElementsByClassName('react-draggable')[0].children[0].children[1].children[1].children[1].click();
        });
        await page.waitForTimeout(4000);
      }
    },

    {
      key: 'more-options-collapsed',
      description: 'More options collapsed',
      setupFn: async ({ page }) => {
        await page.evaluate( function() {
          document.getElementsByClassName('react-draggable')[0].children[0].children[1].click();
        });
        await page.waitForTimeout(4000);
      }
    },

    {
      key: 'right-panel-expanded',
      description: 'Right panel expanded',
      setupFn: async ({ page }) => {
        await page.evaluate( function() {
          document.getElementById('root').children[0].children[0].children[2].children[0].children[2].children[0].children[2].children[0].children[0].click();
        });
        await page.waitForTimeout(4000);
      }
    },

    {
      key: 'right-panel-collapsed',
      description: 'Right panel expanded',
      setupFn: async ({ page }) => {
        await page.evaluate( function() {
          document.getElementById('root').children[0].children[0].children[1].children[0].children[0].children[0].click()
        });
        await page.waitForTimeout(4000);
      }
    },
    
    {
      key: 'lead-action-expanded',
      description: 'Lead action expanded (Activate Warranty)',
      setupFn: async ({ page }) => {
        await page.evaluate( function(){
          document.getElementsByClassName('react-draggable')[0].children[0].children[1].children[1].children[0].click();
        });
        await page.waitForTimeout(4000);
      }
    },
    
    {
      key: 'register-with-email-expanded',
      description: 'Register with email expanded',
      setupFn: async ({ page }) => {
        await page.evaluate( function(){
          document.getElementById('not-draggable').children[0].children[0].children[0].children[1].children[0].children[0].children[2].children[0].click();
        });
        await page.waitForTimeout(5000);
      }
    },
    
    {
      key: 'fill-and-submit-email',
      description: 'Fill and submit email',
      setupFn: async ({ page }) => {
        const pos = await page.evaluate(() => {
          function getOffset( el ) {
            var _x = 0;
            var _y = 0;
            while( el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop) ) {
              _x += el.offsetLeft - el.scrollLeft;
              _y += el.offsetTop - el.scrollTop;
              el = el.offsetParent;
            }
            return { top: _y, left: _x };
          }
          let pos = getOffset(document.getElementById('not-draggable').children[0].children[0].children[0].children[1].children[0].children[0].children[1].children[0].children[0].children[1]);
          return pos;
        });
        await page.mouse.click(pos.left, pos.top);
        await page.waitForTimeout(1000);
        await page.keyboard.type(`test${Math.floor(Math.random()*100000)}${Math.floor(Math.random()*100000)}@test${Math.floor(Math.random()*100000)}.test`)
        await page.waitForTimeout(1000);
        await page.evaluate(() => {
          document.getElementById('not-draggable').children[0].children[0].children[0].children[1].children[0].children[0].children[2].children[0].click();
        })
        await page.waitForTimeout(14000);
      }
    },

    {
      key: 'fill-and-submit-profile-information',
      description: 'Fill and submit profile information',
      setupFn: async ({ page }) => {
        await page.evaluate(() => {
          document.getElementById('not-draggable').children[2].children[2].children[1].click();
        });
        await page.waitForTimeout(1000);
      },
      clipScreenshot: {
        x: 0, y: 0, width: 414, height: 350
      }
    },

    {
      key: 'warranty-view-collapsed',
      description: 'Warranty view collapsed',
      setupFn: async ({ page }) => {
        await page.evaluate( function() {
          document.getElementsByClassName('react-draggable')[0].children[0].children[1].click();
        });
        await page.waitForTimeout(4000);
      }
    },

    {
      key: 'more-options-with-session-expanded',
      description: 'More options with session expanded',
      setupFn: async ({ page }) => {
        await page.evaluate( function(){
          document.getElementsByClassName('react-draggable')[0].children[0].children[1].children[1].children[1].click();
        });
        await page.waitForTimeout(4000);
      }
    },

    {
      key: 'more-info-option',
      description: 'More info option',
      setupFn: async ({ page }) => {
        await page.evaluate( function(){
          document.getElementById('root').children[0].children[0].children[2].children[0].children[4].children[0].children[2].children[1].children[2].click();
        });
        await page.waitForTimeout(4000);
      }
    },

  ]
}