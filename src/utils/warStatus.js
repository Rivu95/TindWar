const Discord = require("discord.js");
const DB = require("../database/warMatch");

module.exports.run = async (client) => {
	const wait_list = await DB.getAll();

	if (wait_list.length === 0) {
		client.user.setActivity(`No wars in wait! Peace everywhere`, { type: "WATCHING" });
	} else {
		client.user.setActivity(`${wait_list.length} Teams are searching for war!`, { type: "WATCHING" });
	}
};