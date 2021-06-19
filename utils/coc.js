const { Client } = require('clashofclans.js');

const coc_client = new Client({
	token: [process.env.COC_API_TOKEN],
	timeout: 5000
});

module.exports.client = coc_client;
