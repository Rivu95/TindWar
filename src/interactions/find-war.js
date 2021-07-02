const Discord = require("discord.js");
const warMatchDB = require("../database/warMatch");                 // wait list/ war-match Database
const statsDB = require("../database/botStats");                    // Bot Stats Databse
const historyDB = require("../database/warHistory");                // War History Database
const repDb = require("../database/clanRepData");					// represenatatibe database

module.exports = {
	name: "find-war",
	description: "War Search Command, if a match is not found immidiately bot will place you in a waitlist",
	helplink: "https://cdn.discordapp.com/attachments/695662581276475523/695662645541470208/clan.png",
	guildOnly: true
};

module.exports.run = async (client, interaction, options, guild) => {
	const format = options[1].value;
	// getting clan from wait list and issue server details
	const wait_list = await warMatchDB.getAll(format);
	const clan = await repDb.getClan(interaction.member.user.id);

	if (!clan) {
		const embed = new Discord.MessageEmbed()
			.setColor("#ff0000")
			.setDescription("You are not representative of any clan!");

		return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
			data: { embeds: [embed] }
		});
	}

	// if there is a clan in wait list
	if (wait_list) {

		// if waitlist clan tag and issued clan tag is same
		if (wait_list.clan_tag === clan.clan_tag) {
			const embed = new Discord.MessageEmbed()
				.setColor("#ffd700")
				.setTitle("You are already seaching for War!");

			return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
				data: { embeds: [embed] }
			});
		}

		// in case the wait list server deleted the bot
		const waiting_clan_channel = client.channels.cache.get(wait_list.channel_id);
		if (!waiting_clan_channel) {
			await warMatchDB.deleteByClan(wait_list.clan_tag);
			await warMatchDB.addClan(clan.clan_tag, `${options[0].value} hours`, options[0].value, format);

			const embed = new Discord.MessageEmbed()
				.setColor("#ffd700")
				.setTitle("No Clan is waiting for a match-up. I have put your entry as waiting, as soon as another clan searches for war i will match you up!");

			return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
				data: { embeds: [embed] }
			});
		}

		const waiting_clan_reps = await repDb.getAllReps(wait_list.clan_tag);
		const issue_server_embed = new Discord.MessageEmbed()
			.setColor("#65ff01")
			.setTitle(`Match Found!\nFormat: ${format.split(/_+/g).join(" ").toUpperCase()}`)
			.setDescription(`**Team - ${wait_list.team_name}**\n**Clan - [${wait_list.clan_name} (${wait_list.clan_tag})](https://link.clashofclans.com/en?action=OpenClanProfile&tag=${client.coc.parseTag(wait_list.clan_tag, true)})**`)
			.addField("__Conatct Representatives__", `\`\`\`\n${waiting_clan_reps.map(x => x.discord_tag).join("\n")}\`\`\``)
			.addField("Support Me (if you want)!", "I’m free to use but to keep me running please tip: [paypal](https://paypal.me/ogbradders)")
			.setTimestamp();

		const waiting_clan_embed = new Discord.MessageEmbed()
			.setColor("#65ff01")
			.setTitle(`Match Found!\nFormat: ${format.split(/_+/g).join(" ").toUpperCase()}`)
			.setDescription(`**Team - ${clan.team_name}**\n**Clan - [${clan.clan_name} (${clan.clan_tag})](https://link.clashofclans.com/en?action=OpenClanProfile&tag=${client.coc.parseTag(clan.clan_tag, true)})**`)
			.addField("__Representatives__", `\`\`\`\n${interaction.member.user.username}#${interaction.member.user.discriminator}\`\`\``)
			.addField("Support Me (if you want)!", "I’m free to use but to keep me running please tip: [paypal](https://paypal.me/ogbradders)")
			.setTimestamp();

		waiting_clan_channel.send(`${waiting_clan_reps.reduce((acc, current) => { return acc + `<@${current.rep_id}>, ` }, "")}`, waiting_clan_embed);
		client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
			data: { embeds: [issue_server_embed] }
		});

		// deleting wait entry and upadating stats and history DB
		await warMatchDB.deleteByClan(wait_list.clan_tag);
		await statsDB.updateStats("war match");
		await historyDB.addWar(wait_list.clan_tag, clan.clan_tag, format);
		return;
	}
	else {
		await warMatchDB.addClan(clan.clan_tag, `${options[0].value} hours`, options[0].value, format);

		const embed = new Discord.MessageEmbed()
			.setColor("#ffd700")
			.setTitle("No Clan is waiting for a match-up. I have put your entry as waiting, as soon as another clan searches for war i will match you up!");

		return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
			data: { embeds: [embed] }
		});
	}
};