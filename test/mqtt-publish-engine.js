const mqtt = require('mqtt')
const common = require('../common')
const client = mqtt.connect(common.mqttUrl)

client.on('connect', function () {
    client.publish('marketing-engine', JSON.stringify({engine: 'baidu', kw: '软件开发'}))
    client.end()
})
