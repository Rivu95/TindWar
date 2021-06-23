const Discord = require('discord.js');
const CommandHandler = require('../../packages/CommandHandler');
const Db = require('./Database');
const Settings = require('./Settings');

class Client extends Discord.Client {
	constructor() {
		super();

		this.db = new Db();
		this.commandHandler = new CommandHandler();
	}

	async _init() {
		this.settings = new Settings();
		await this.settings.init();
	}

	async start(token) {
		await this._init();
		return this.login(token);
	}
}

module.exports = Client;
