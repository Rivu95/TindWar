const Discord = require("discord.js");
const serverDB = require("../database/serverClanData");             // server-clan database
const warMatchDB = require("../database/warMatch");                 // wait list/ war-match Database
const statsDB = require("../database/botStats");                    // Bot Stats Databse
const historyDB = require("../database/warHistory");                // War History Database

module.exports = {
	name: "find-war",
	description: "War Search Command, if a match is not found immidiately bot will place you in a waitlist",
	helplink: "https://cdn.discordapp.com/attachments/695662581276475523/695662645541470208/clan.png",
	guildOnly: true
};

module.exports.run = async (client, interaction, options, guild) => {
	// getting clan from wait list and issue server details
	const wait_list = await warMatchDB.getAll();
	const issue_server = await serverDB.getServer(interaction.guild_id);

    // getting the guilds and representatives
    const issue_guild = client.guilds.cache.get(interaction.guild_id);
    const target_guild = client.guilds.cache.get(wait_list?.server_id);
    const issuer_representative = await issue_guild?.members.fetch(issue_server.representative_id);
    const target_representative = await target_guild?.members.fetch(wait_list?.representative_id);

    // if the server isn't registered
    if (!issue_server) {
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setDescription("You **have not** registered any clan or details for this server. First complete that using `register` slash command!");

        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [embed] }
        });
    }

    // if there is a clan in wait list
    if (wait_list) {
        // if same server war search twice in a row
        if (wait_list.server_id === interaction.guild_id) {
            const embed = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Still No match found!");

            return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
                data: { embeds: [embed] }
            });
        }

        // message that will go in wait list clan's server
        const target_channel = client.channels.cache.get(wait_list.channel_id);
        const target_channel_embed = new Discord.MessageEmbed()
            .setColor("#65ff01")
            .setTitle("Match Found!")
            .setDescription(`**Team - ${issue_server.team_name}**\n**Clan - [${issue_server.clan_name}-${issue_server.clan_tag}](https://link.clashofclans.com/en?action=OpenClanProfile&tag=${client.coc.parseTag(issue_server.clan_tag, true)})**`)
            .addField("__Server Invite__", issue_server.server_invite)
            .addField("__Representative__", issuer_representative.user.tag)
            .addField("Support Me (if you want)!", "I’m free to use but to keep me running please tip: [paypal](https://paypal.me/ogbradders)")
            .setThumbnail()
            .setTimestamp();

        // message that will go in command issuer's channel
        const issuer_embed = new Discord.MessageEmbed()
            .setColor("#65ff01")
            .setTitle("Match Found!")
            .setDescription(`**Team - ${wait_list.team_name}**\n**Clan - [${wait_list.clan_name}-${wait_list.clan_tag}](https://link.clashofclans.com/en?action=OpenClanProfile&tag=${client.coc.parseTag(wait_list.clan_tag, true)})**`)
            .addField("__Server Invite__", wait_list.server_invite)
            .addField("__Representative__", target_representative.user.tag)
            .addField("Support Me (if you want)!", "I’m free to use but to keep me running please tip: [paypal](https://paypal.me/ogbradders)")
            .setThumbnail()
            .setTimestamp();

		// sending the messages
		target_channel.send(target_channel_embed);
		client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
			data: { embeds: [issuer_embed] }
		});

		// deleting wait entry and upadating stats and history DB
		await warMatchDB.deleteClanByServer(wait_list.server_id);
		await statsDB.updateStats("war match");
		await historyDB.addWar(wait_list.server_id, interaction.guild_id, wait_list.clan_tag, issue_server.clan_tag);
	}

	// saving the issue in wait list
	else {
		await warMatchDB.addClan(issue_server.clan_tag, `${options[0].value} hours`, options[0].value, issue_server.server_id);

		const embed = new Discord.MessageEmbed()
			.setColor("#ffd700")
			.setTitle("No Clan is waiting for a match-up. I have put your entry as waiting, as soon as another clan searches for war i will match you up!");

		return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
			data: { embeds: [embed] }
		});
	}
};
