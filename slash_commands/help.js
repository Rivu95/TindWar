// 854964542936711208
const Discord = require("discord.js");

module.exports = {
    name: "help",
    description: "shows all the other commands and usage",
    helplink: "https://cdn.discordapp.com/attachments/695662581276475523/695662645541470208/clan.png",
    guildOnly: true
};

module.exports.run = async (client, interaction, options, guild) => {

    const embed = new Discord.MessageEmbed()
        .setColor("#00ffff")
        .setTitle("TindWar Bot Help")
        .setDescription("As of now this bot only has slash commnds. Also this bot is for matching up TH14 5v5 ESL type wars, other TH and negotiateable matches will come soon!")
        .addField("__/register__", "Register Your Team Name, Clan, Other details in the Bot database. This should be your first command!", false)
        .addField("__/find-war__", "War Search Command, if a match is not found immidiately bot will place you in a waitlist", false)
        .addField("__/stats__", "Shows General Stats of clan and it's DB", false)
        .setFooter("Support: https://discord.gg/uq7TEc79")
        .setTimestamp()

    return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
        data: { embeds: [embed] }
    });
}