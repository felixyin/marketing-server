const baidu = require('./baidu')
const pp = require('../../util/pp')

function crawl(engine, kw) {
    pp.browser().then((browser) => {
        switch (engine) {
            case 'baidu':
                baidu.search(browser, kw, function (links) {
                    console.log(links)
                    // 1. 上传队列
                    // 2. 队列去重复，过滤黑名单
                    // 3. 使用普通爬虫爬取邮箱和电话，记录数据库
                }, function (allLinks) {
                    console.log(allLinks)
                    // browser.close()
                })
                break
            default:
                break
        }
    })
}

module.exports = {
    crawl: crawl
}
