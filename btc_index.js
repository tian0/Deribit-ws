const fetch = require("node-fetch");

const Index = async () => {
    const response = await fetch('https://www.deribit.com/api/v1/public/index');
    const json = await response.json();
    var index = json.result.btc;
    // console.log('BTC index price: ', index)
    return index
}

module.exports = {
    Index
}