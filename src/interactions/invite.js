// 856418115884679169
const Discord = require("discord.js");

module.exports = {
    name: "invite",
    description: "Invite TindWar Bot",
    helplink: "https://cdn.discordapp.com/attachments/695662581276475523/695662645541470208/clan.png",
    guildOnly: true
};

module.exports.run = async (client, interaction, options, guild) => {
    const embed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle("Invite TindWar! Tap here")
        .setURL("https://discord.com/api/oauth2/authorize?client_id=851338766727643147&permissions=2147863616&scope=bot%20applications.commands");

    return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
        data: { embeds: [embed] }
    });
};
