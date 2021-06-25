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
        .setDescription("As of now this bot only has slash commnds.\nWars Possible: TH 14 to TH9 5v5 wars\nMixed breakdown and negotiable matches will come soon!")
        .setFooter("Support: https://discord.gg/Hw3efUPMjH")
        .setTimestamp();

    client.interactions.array().forEach((element) => {
        embed.addField(`__${element.name}__`, `\`\`\`\n${element.description}\`\`\``);
    });

    return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
        data: { embeds: [embed] }
    });
};
