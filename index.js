const mqtt = require('mqtt')
const engine = require('./crawl/engine')
const site = require('./crawl/site')
const common = require('./common')


const client = mqtt.connect(common.mqttUrl)

// 当链接后，订阅 marketing-search 频道
client.on('connect', function () {
    client.subscribe('marketing-engine', function (err) {
        if (!err) console.log('mqtt订阅的频道：' + 'marketing-engine')
    })
    client.subscribe('marketing-site', function (err) {
        if (!err) console.log('mqtt订阅的频道：' + 'marketing-site')
    })
})

// 当收到消息则
client.on('message', function (topic, message) {
    const data = message.toString()
    console.log('收到的主题：' + topic + '，消息：' + data)
    try {
        const json = JSON.parse(data)
        switch (topic) {
            case 'marketing-engine': // 通过搜索引擎爬取站点url
                engine.switchSearch(json.engine, json.kw) // {engine: 'baidu', kw: '关键词'}
                break
            case 'marketing-site': // 通过站点url，站内爬取：站名 电话 联系 邮箱
                site.crawl(json) //url array
                break
            default:
                break
        }
    } catch (err) {
        console.error(err)
    }
})
