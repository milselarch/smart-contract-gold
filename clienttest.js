const Client = require('node-rest-client').Client;
const httpClient = new Client();

const baseurl = 'https://api.coingecko.com/api/v3/simple/price'
const url = `${baseurl}?ids=ethereum&vs_currencies=USD`
const args = {
    headers: { "Content-Type": "application/json" }
};

httpClient.get(url, args, (data) => {
    console.log('DATA', data)
})