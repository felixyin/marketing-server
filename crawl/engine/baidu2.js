const Crawler = require('crawler')
const UserAgent = require('user-agents');
const mqtt = require('mqtt')
const common = require('../../common')
/**
 * 模拟UA 请求头
 */
const ua = new UserAgent({platform: 'Win32'});
const userAgents = Array(200).fill().map(() => ua.random());
let client = null
/**
 * 爬虫对象
 */
const httpC = new Crawler({
    maxConnections: 1,
    skipDuplicates: true,
    priority: 1,
    timeout: 15000,
    retries: 0,
    retryTimeout: 2000,
    jQuery: true,
    rotateUA: true,
    userAgent: userAgents,
    // This will be called for each crawled page
    callback: crawlCallback
})


const SITE_REGEX = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/

/**
 * 添加到爬虫队列
 * @param kw
 */
function addToCrawQueue(kw) {
    // httpC.queue({ uri: 'http://' + kw })
    client = mqtt.connect(common.mqttUrl)
    client.on('connect', function () {
        for (let i = 1; i < 100; i++) {
            const url = 'https://www.baidu.com/s?wd=' + kw + '&pn=' + (i * 10)
            console.log('开始爬取：'+url)
            httpC.queue({uri: encodeURI(url)})
        }
    });
}

/**
 * 获取页面内容后的处理
 * @param error
 * @param res
 * @param done
 */
function crawlCallback(error, res, done) {
    try {
        if (error) {
            console.log('=========<<', error, done);
            return
        }
        let $ = res.$; // 页面的jquery对象
        // let title = $('title').text();
        // title = title && title.length > 200 ? title.substring(0, 200) : title;
        // console.info('title-------------------------------------------------------->')
        // console.info(title)
        const siteArr = $('#content_left .c-showurl').map(function(){return $(this).text()}).get()
        console.log(siteArr)
        const links = []
        for (let i = 0; i < siteArr.length; i++) {
            const site = siteArr[i]
            if(SITE_REGEX.test(site)){
                console.info(site)
                links.push(site)
            }
        }
        client.publish('marketing-site', JSON.stringify(links))
    } catch (e) {
        console.error(e)
    }
}

exports = module.exports = {
    search: addToCrawQueue
}
