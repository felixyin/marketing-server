const {google} = require('googleapis');
const customsearch = google.customsearch('v1');

// Ex: node customsearch.js
//      "Google Node.js"
//      "API KEY"
//      "CUSTOM ENGINE ID"

async function runSample(options) {
    console.log(options);
    const res = await customsearch.cse.list({
        cx: options.cx,
        q: options.q,
        auth: options.apiKey,
    });
    console.log(res.data);
    return res.data;
}

// You can get a custom search engine id at
// https://www.google.com/cse/create/new
const options = {
    q: '青岛前途软件',
    apiKey: 'AIzaSyAllFUsjjXphOtGzkVei98GoiLOWnoApsk',
    cx:'017576662512468239146:omuauf_lfve' //Search engine ID   https://cse.google.com/cse/create/new
};
runSample(options).catch(console.error);
