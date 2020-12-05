const baidu = require('./baidu2')
const pp = require('../../util/pp')
const mqtt = require('mqtt')
const common = require('../../common')

function switchSearch(engine, kw) {
    // const client = mqtt.connect(common.mqttUrl)
    // client.on('connect', function () {
        // pp.browser().then((browser) => {
            switch (engine) {
                case 'baidu':
                    // baidu.search(browser, kw, function (links) {
                    //     console.log(links)
                    //     // 1. 上传队列
                    //     // 2. 队列去重复，过滤黑名单
                    //     // 3. 使用普通爬虫爬取邮箱和电话，记录数据库
                    //     client.publish('marketing-site', JSON.stringify(links))
                    // }, function (allLinks) {
                    //     console.log(allLinks)
                    //     // browser.close()
                    //     client.end()
                    // })
                    baidu.search(kw)
                    break
                default:
                    break
            }
        // })
    // })
}

exports = module.exports = {
    switchSearch: switchSearch
}
