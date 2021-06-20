const Discord = require("discord.js");
const DB = require("../database/warMatch");
const serverClanDB = require("../database/serverClanData");

module.exports.run = async (client) => {
	const wait_list = await DB.deleteClanByTime();
	const server = await serverClanDB.getServer(wait_list.server_id);
	const channel = client.channels.cache.get(server.channel_id);

	const embed = new Discord.MessageEmbed()
		.setColor("#ff0000")
		.setTitle("Sorry! No Match Found")
		.setDescription("Use the find-war slash command again to find a match!")
		.setTimestamp();

	return channel.send(embed);
};
