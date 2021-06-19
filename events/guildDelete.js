require('dotenv').config();
const serverClanDB = require("../Database/serverClanData");
const waitListDb = require("../Database/warMatch");

module.exports.run = async (client, guild) => {
	const log_channel = client.channels.cache.get(process.env.BOT_LOG);
	log_channel.send(`\`\`\`arm\nBot has left ${guild.name} \nOwner ID: ${guild.ownerID}\nServer ID:${guild.id}\`\`\``);

	await serverClanDB.deleteServer(guild.id);
	await waitListDb.deleteClanByServer(guild.id);
};
