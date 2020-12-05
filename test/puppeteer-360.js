const puppeteer = require('puppeteer')
const UserAgent = require('user-agents');
const common = require('../common')
/**
 * 模拟UA 请求头
 */
const ua = new UserAgent({platform: 'Win32'});

const IS_LAST_PAGE = '-no-next-page-'

const launchConfig = {
    headless: false,
    devtools: false,
    ignoreDefaultArgs: ['--enable-automation'],
    // executablePath: '/opt/google/chrome/chrome',
    // executablePath: '/usr/bin/chromium-browser',
    // executablePath: '/snap/bin/chromium',
    // executablePath: '/usr/bin/firefox',
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--start-maximized',
        '--allow-running-insecure-content',
        '--disable-web-security',
        '--auto-open-devtools-for-tabs',
        // `--proxy-server=${newProxyUrl}`,
        // `--proxy-server=socks5://localhost:1080`
    ]
}


async function getLinks2(page) {
    await page.waitForTimeout(common.randomNum()) //等待時間
    // eslint-disable-next-line no-return-await
    const links = await page.$$eval('#main a', rows => {
        const _links = []
        const matcht = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/
        rows.forEach(row => {
            const a = $(row)
            const href = a.text()
            // if (href.indexOf('www.baidu.com') !== -1) return
            // const matcht = /^(https?:\/\/)?([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/g
            const result = href.match(matcht)
            // console.log(result)
            if (!result) return
            for (let i = 0; i < result.length; i++) {
                const h = result[i]
                if (matcht.test(h)) {
                    _links.push(h)
                }
            }
        })
        return _links
    })
    return links
}

async function clickNextPage(page) {
    await page.waitForTimeout(common.randomNum()) //等待時間
    await page.evaluate(function () {
        debugger
       const nextPages = document.querySelectorAll('#page a')
        console.log(nextPages)
        const la = nextPages[nextPages.length - 1]
        if (la.innerText === '下一页') {
            // la.click({ delay: 2000 })
            la.click()
            return null
        } else {
            return '-no-next-page-'
        }
    })
    return 1
    // const x= await page.$$eval('#page a', function(nextPages) {
    //     console.log(nextPages)
    //     const la = nextPages[nextPages.length - 1]
    //     if (la.innerText === '下一页') {
    //         // la.click({ delay: 2000 })
    //         la.click()
    //         return null
    //     } else {
    //         return '-no-next-page-'
    //     }
    // })
    // return x
}

(async ()=>{

const browser = await puppeteer.launch(launchConfig)
    const page = await browser.newPage()
    await page.setUserAgent(ua.random().toString())
    await page.setViewport({
        width: 1280,
        height: 800
    })
    await page.setDefaultNavigationTimeout(0)

    await page.goto('https://www.so.com/')
    await page.type('#input', '软件') // 所搜关键词
    await page.click('#search-button')

    const links = []

    let isLast = false
    while (!isLast) {
        // await page.waitForNavigation()
        // await page.waitForResponse(response => response.status() === 200)
        // await page.waitForSelector('#content_left', { timeout: 0 })
        const _links = await getLinks2(page)
        // console.log(_links)
        links.push(..._links)

        const isLastPage = await clickNextPage(page)
        // console.warn(isLastPage)

        if (IS_LAST_PAGE === isLastPage) { // 最后一页
            isLast = true
            console.log('********************************* last page')
            console.error(links)
            await page.close()
            await browser.close()
        }
    }
})()
