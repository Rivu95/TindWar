// 854964973469040640
const Discord = require("discord.js");
const statsDB = require("../Database/botStats");

module.exports = {
    name: "stats",
    description: "General Stats of the bot",
    helplink: "https://cdn.discordapp.com/attachments/695662581276475523/695662645541470208/clan.png",
    guildOnly: true
};

module.exports.run = async (client, interaction, options, guild) => {

    const stats = await statsDB.getStats();

    const embed = new Discord.MessageEmbed()
        .setColor("#00ffff")
        .setTitle("Bot Stats")
        .setDescription(`**Teams Saved:** ${stats.server_count}\n**Wars Matched:** ${stats.war_matched}\n**Servers**: ${client.guilds.cache.size}`)
        .addField("Matches Possible", `TH-14 5v5 ESL type`)
        .addField("Support Me (if you want)!", "I’m free to use but to keep me running please tip: [paypal](https://paypal.me/ogbradders)")
        .setTimestamp()

    return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
        data: { embeds: [embed] }
    });
}