const mqtt = require('mqtt')
const common = require('../common')
const client = mqtt.connect(common.brokerUrl)

client.on('connect', function () {
    client.publish('marketing-search', JSON.stringify({engine: 'baidu', kw: 'mqtt rabbitmq activemq'}))
    client.end()
})
