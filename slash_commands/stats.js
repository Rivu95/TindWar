// 854964973469040640
const Discord = require("discord.js");
const statsDB = require("../Database/botStats");

module.exports.run = async (client, interaction, options) => {

    const stats = await statsDB.getStats();

    const embed = new Discord.MessageEmbed()
        .setColor("#00ffff")
        .setTitle("Bot Stats")
        .setDescription(`**Teams Saved:** \`${stats.server_count}\`\n**Wars Matched:** \`${stats.war_matched}\``)
        .addField("Matches Possible", `14v14 ESL type`)
        .addField("Support Me (if you want)!", "I’m free to use but to keep me running please tip: [paypal](https://paypal.me/ogbradders)")
        .setTimestamp()

    return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
        data: { embeds: [embed] }
    });
}