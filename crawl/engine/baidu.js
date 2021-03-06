const UserAgent = require('user-agents');
const common = require('../../common')
/**
 * 模拟UA 请求头
 */
const ua = new UserAgent({platform: 'Win32'});

const IS_LAST_PAGE = '-no-next-page-'

async function getLinks(page) {
    const links = await page.$$eval('#content_left a', rows => {
        const _links = []
        const matcht = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/
        rows.forEach(row => {
            const a = $(row)
            const href = a.text()
            if (href.indexOf('www.baidu.com') !== -1) return
            // const matcht = /^(https?:\/\/)?([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/g
            const result = href.match(matcht)
            // console.log(result)
            if (!result) return
            const h = result[0]
            if (matcht.test(h)) {
                _links.push(h)
            }
        })
        return _links
    })
    return links
}

async function getLinks2(page) {
    await page.waitForTimeout(common.randomNum()) //等待時間
    // eslint-disable-next-line no-return-await
    const links = await page.$$eval('#content_left a', rows => {
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
    const x= await page.$$eval('#page a', nextPages => {
        const la = nextPages[nextPages.length - 1]
        const $la = $(la)
        if ($la.text() === '下一页 >') {
            // la.click({ delay: 2000 })
            la.click()
            return null
        } else {
            return '-no-next-page-'
        }
    })
    return x
}

async function search(browser, kw, pageCb, finishCb) {
    const page = await browser.newPage()
    // await page.setUserAgent(ua.random().toString())
    // await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.0 Safari/537.36');

    await page.setViewport({
        width: 1280,
        height: 800
    })
    await page.setDefaultNavigationTimeout(0)

    await page.goto('https://www.baidu.com/')
    await page.type('#kw', kw) // 所搜关键词
    await page.click('#su') // 百度一下

    const links = []

    let isLast = false
    while (!isLast) {
        // await page.waitForNavigation()
        // await page.waitForResponse(response => response.status() === 200)
        // await page.waitForSelector('#content_left', { timeout: 0 })
        const _links = await getLinks2(page)
        // console.log(_links)
        pageCb(_links)
        links.push(..._links)

        const isLastPage = await clickNextPage(page)
        // console.warn(isLastPage)

        if (IS_LAST_PAGE === isLastPage) { // 最后一页
            isLast = true
            console.log('********************************* last page')
            await page.close()
            finishCb(links)
            // console.error(links)
        }
    }
}

exports = module.exports = {search: search}
// exports.searchBaidu = searchBaidu
