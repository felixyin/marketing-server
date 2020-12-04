const mqtt = require('mqtt')
const common = require('../common')
const client = mqtt.connect(common.mqttUrl)

client.on('connect', function () {
    let sites = [
        'www.shuzhikj.com',
        'www.szhta.com',
        'yx.zbj.com',
        'www.haidaoteam.com',
        'www.100vic.com',
        'www.runfkj.com',
        'www.chuanxiong.net',
        'www.duoqio.com',
        'www.shuoguow.com',
        'www.gdqunyu.com'];
    client.publish('marketing-site', JSON.stringify(sites)
    )
    client.end()
})
