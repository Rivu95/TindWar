require('dotenv').config();
const serverClanDB = require("../Database/serverClanData");
const waitListDb = require("../Database/warMatch");

module.exports.run = async (client, guild) => {
	const log_channel = client.channels.cache.get(process.env.BOT_LOG);
	console.log("bot has Left " + guild.name);
	log_channel.send("```Bot has left " + guild.name + " server\nOwner ID: " + guild.ownerID + "\nServer ID: " + guild.id + "```");

	await serverClanDB.deleteServer(guild.id);
	await waitListDb.deleteClanByServer(guild.id);
	return;
};