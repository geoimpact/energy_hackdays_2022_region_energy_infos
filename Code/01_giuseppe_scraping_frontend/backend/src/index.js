const express = require('express')
const app = express()
const port = 3001

const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const cors = require('cors');


(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    app.use(cors())
    // parse application/json
    app.use(bodyParser.json())
    app.post('/', async (req, res) => {
        try{
            const page = await browser.newPage();
            await page.goto(req.body.url);
            // await page.waitForNavigation({waitUntil: 'networkidle2'})
            const extractedText = await page.$eval('*', (el) => el.innerText);
            const htmlText = await page.$eval("body", (el) => {
                return el.innerHTML
            })
            res.send({
                meta: req.body,
                text: extractedText,
                html: htmlText
            });
        } catch (e){
            res.status(500).send({
                meta: req.body,
                error: e
            });
        }
    })
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
})();
