const puppeteer = require('puppeteer')
const fs = require('fs')

const launchConfig = {
    headless: false,
    devtools: false,
    // ignoreDefaultArgs: ['--enable-automation'],
    // executablePath: '/usr/bin/chromium-browser',
    args: [
        // '--no-sandbox',
        // '--disable-setuid-sandbox',
        // '--start-maximized',
        // '--allow-running-insecure-content',
        // '--disable-web-security',
        // '--auto-open-devtools-for-tabs',
        // `--proxy-server=${newProxyUrl}`,
        // `--proxy-server=socks5://localhost:1080`
    ]
}

async function getWSAddress() {
    const wsa = fs.readFileSync(__dirname + '/wsa.txt', {
        flag: 'r+',
        encoding: 'utf8'
    });
    return wsa;
}

async function launch() {
    const browser = await puppeteer.launch(launchConfig)
    const wsEPAddress = await browser.wsEndpoint()
    const wData = new Buffer(wsEPAddress)
    fs.writeFileSync(__dirname + '/wsa.txt', wData, {flag: 'w+'});
}

async function browser() {
    try {
        const b = await puppeteer.connect({
            browserWSEndpoint: await getWSAddress()
        })
        return b
    } catch (e) {
        await launch()
        const b = await puppeteer.connect({
            browserWSEndpoint: await getWSAddress()
        })
        return b
    }
}

module.exports = {
    browser: browser,
    launch: launch
}
