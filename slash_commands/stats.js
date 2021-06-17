// 854964973469040640
const Discord = require("discord.js");
const statsDB = require("../Database/botStats");

module.exports.run = async (client, interaction, options) => {

    const stats = await statsDB.getStats();

    const embed = new Discord.MessageEmbed()
        .setColor()
        .setTitle("Bot Stats")
        .setDescription(`**Team Saved:** \`${stats.server_count}\`\n**War Mathed:** \`${stats.war_matched}\``)
        .addField("Matches Possible", `14v14 ESL type`)
        .setTimestamp()

    return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
        data: { embeds: [embed] }
    });
}