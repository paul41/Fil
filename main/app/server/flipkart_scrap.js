const puppeteer = require('puppeteer');

module.exports.flipkart = async (prodParam) => {
    let returnArray = [];
    let returnObject = {}
    try {
        const browser = await puppeteer.launch({
            ignoreDefaultArgs: ['--disable-extensions'],
          });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 })
        await page.goto('https://www.flipkart.com');
        await page.waitFor('input[name=q]');
        await page.type('input[name=q]', prodParam)
        await page.evaluate(() => {
            document.querySelector('button[type=submit]').click()
        })
        await page.waitForSelector('#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > a');
        let dataList = [];
        await page.evaluate((dataList) => {
            //let doc = document.querySelector('#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > a._2cLu-l').textContent
            let doc = document.querySelectorAll('#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2)')[0];
            for (let i = 1; i < doc.children.length - 2; i++) {
                console.log('count :' + i, doc.children[i]);
                let childNode = doc.children[i].children[0];
                let length = childNode.children.length;
                while (length-- != 0) {
                    let innerChild = childNode.children[length].children[0].children[0].parentNode;
                    dataList.push({
                        productId: 'fLip'+Math.random().toString(36).substr(2,6),
                        productURL: innerChild.querySelectorAll('a.Zhf2z-').length ? innerChild.querySelectorAll('a.Zhf2z-')[0].href : '',
                        productImg: innerChild.querySelectorAll('div._3BTv9X > img._1Nyybr').length ? innerChild.querySelector('div._3BTv9X > img._1Nyybr').src : '',
                        ProductName: innerChild.querySelectorAll('a._2cLu-l').length ? innerChild.querySelectorAll('a._2cLu-l')[0].innerText : '',
                        price:  innerChild.querySelectorAll('div._1vC4OE').length ? innerChild.querySelectorAll('div._1vC4OE')[0].innerText.replace(/[^\w\s]/gi, '').trim() : '',
                        strike: innerChild.querySelectorAll('div._3auQ3N').length ? innerChild.querySelectorAll('div._3auQ3N')[0].innerText.replace(/[^\w\s]/gi, '').trim():innerChild.querySelectorAll('div._1vC4OE')[0].innerText.replace(/[^\w\s]/gi, '').trim(),
                        rating: innerChild.querySelectorAll('div.hGSR34').length ? innerChild.querySelectorAll('div.hGSR34')[0].innerText : ''
                    });
                }
            }  
            return dataList
        }, dataList).then((data) => {
            returnObject.ProductType = prodParam;
            returnObject.product = data;
        });
        returnArray.push(returnObject)
        //await browser.close();
        return returnArray;
        
    } catch (error) {
        console.log(error)
        throw error;
    }
    
};
