const Discord = require('discord.js');

class Client extends Discord.Client {
	constructor() {
		super();
		this.settings = 'lol';
	}

	init() {

	}
}

module.exports = Client;
