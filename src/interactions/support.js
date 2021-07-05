// 856418115884679169
const Discord = require("discord.js");

module.exports = {
    name: "support",
    description: "Get the support server link",
    helplink: "https://cdn.discordapp.com/attachments/695662581276475523/695662645541470208/clan.png",
    guildOnly: true
};

module.exports.run = async (client, interaction, options, guild) => {
    const embed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle("TindWar Support! Tap here")
        .setURL(" https://discord.gg/Hw3efUPMjH");

    return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
        data: { embeds: [embed] }
    });
};
