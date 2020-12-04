exports = module.exports = {
    mqttUrl: 'mqtt://qtrj.i234.me:1883',
    ppMinTimeout: 3,
    ppMaxTimeout: 6,
    randomNum: function (minNum = this.ppMinTimeout, maxNum = this.ppMaxTimeout) {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    },
    siteRegex: /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/
}
