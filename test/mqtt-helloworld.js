// https://www.npmjs.com/package/mqtt
var mqttHelloworld = require('mqtt')
var client = mqttHelloworld.connect('mqtt://qtrj.i234.me:1883', {
    // clientId: 'marketing_test1',
    // clean: false,
    // queueQoSZero: false,
    // reconnectPeriod: 1000,
    // incomingStore: new mqtt.Store({clean: false}),
    // outgoingStore: new mqtt.Store({clean: false})
})

client.on('connect', function () {
    client.subscribe('presence', function (err) {
        if (!err) {
            client.publish('presence', 'Hello mqtt')
        }
    })
})

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    // client.end()
})
