// Use this simple app to query the Bing Web Search API and get a JSON response.
// Usage: node search.js "your query".
const https = require('https')
const SUBSCRIPTION_KEY = process.env['AZURE_SUBSCRIPTION_KEY'] || '9993e57b459841db8418ce4fcb52510e'
if (!SUBSCRIPTION_KEY) {
    throw new Error('AZURE_SUBSCRIPTION_KEY is not set.')
}
// Build query options from selections in the HTML form.
function bingSearchOptions(pageNo) {
    var options = [];
    // // Where option.
    // https://docs.microsoft.com/en-us/bing/search-apis/bing-web-search/search-the-web
    options.push("mkt=zh-chs");
    // // SafeSearch option.
    options.push("SafeSearch="+ "strict"  /* + "moderate" */);
    // Hardcoded text decoration option.
    options.push("textDecorations=false");
    // Hardcoded text format option.
    options.push("textFormat=raw");
    // https://docs.microsoft.com/en-us/bing/search-apis/bing-web-search/filter-answers
    options.push("responseFilter=webpages") // 之过滤web页面
    options.push("freshness=2005-01-01..2020-12-30") // 最近一周
    options.push("count=50") // 数量
    options.push("offset=" + 0) // 数量
    return options.join("&");
}
function bingWebSearch(query) {
    https.get({
        hostname: 'api.bing.microsoft.com',
        path:     '/v7.0/search?q=' + encodeURIComponent(query) +'&'+bingSearchOptions(),
        headers:  { 'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY },
    }, res => {
        let body = ''
        res.on('data', part => body += part)
        res.on('end', () => {
            for (var header in res.headers) {
                if (header.startsWith("bingapis-") || header.startsWith("x-msedge-")) {
                    console.log(header + ": " + res.headers[header])
                }
            }
            console.log('\nJSON Response:\n')
            console.dir(JSON.parse(body), { colors: false, depth: null })
        })
        res.on('error', e => {
            console.log('Error: ' + e.message)
            throw e
        })
    })
}

bingWebSearch('青岛前途软件技术')
