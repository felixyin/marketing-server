const Crawler = require('crawler')
const UserAgent = require('user-agents');
const common = require('../../common')

/**
 * 模拟UA 请求头
 */
const ua = new UserAgent({platform: 'Win32'});
const userAgents = Array(200).fill().map(() => ua.toString());

/**
 * 爬虫对象
 */
const httpC = new Crawler({
    maxConnections: 100,
    skipDuplicates: true,
    priority: 1,
    timeout: 15000,
    retries: 0,
    retryTimeout: 2000,
    jQuery: true,
    rotateUA: true,
    userAgent: userAgents,
    // This will be called for each crawled page
    callback:crawlCallback
})
const httpsC = new Crawler({
    maxConnections: 100,
    skipDuplicates: true,
    priority: 1,
    timeout: 15000,
    retries: 0,
    retryTimeout: 2000,
    jQuery: true,
    rotateUA: true,
    strictSSL: false,
    userAgent: userAgents,
    // This will be called for each crawled page
    callback:crawlCallback
})

function crawlFromUrlArray(siteArr) {
    for (let i = 0; i < siteArr.length; i++) {
        let site = siteArr[i]
        console.log(site)
        addToCrawQueue(site)
    }
}

const SITE_REGEX = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/

/**
 * 添加到爬虫队列
 * @param uri
 */
function addToCrawQueue(site) {
    if (!common.siteRegex.test(site)) return
    httpC.queue({ uri: 'http://' + site })
    httpC.queue({ uri: 'https://' + site })
}

/**
 * 获取页面内容后的处理
 * @param error
 * @param res
 * @param done
 */
function crawlCallback(error, res, done, site) {
    try {
        if (error) {
            // console.log('=========<<', error, done);
            return
        }
        let $ = res.$; // 页面的jquery对象
        let title = $('title').text();
        title = title && title.length > 200 ? title.substring(0, 200) : title;
        console.info('title-------------------------------------------------------->')
        console.info(title)
    } catch (e) {
        console.error(e)
    }
}

exports = module.exports = {
    crawl: crawlFromUrlArray
}
