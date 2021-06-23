const Client = require('./struct/Client');
const client = new Client();

client.on('error', (error) => {
	console.log(error);
});

client.on('warn', (error) => {
	console.log(error);
});

process.on('unhandledRejection', (error) => {
	console.log(error);
});

client.start(process.env.TOKEN);
