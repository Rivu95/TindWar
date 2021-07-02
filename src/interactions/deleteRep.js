// 858236651741249536
const Discord = require("discord.js");
const repDb = require("../database/clanRepData");

module.exports = {
    name: "delete-rep",
    description: "delete a representative from a clan",
    helplink: "https://cdn.discordapp.com/attachments/695662581276475523/695662645541470208/clan.png",
    guildOnly: true
};

module.exports.run = async (client, interaction, options, guild) => {
    const hasClan = await repDb.deleteRep(options[0].value, client.coc.parseTag(options[1].value, false));
    if (!hasClan) {
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setDescription("You are not even a representative of this clan!");

        return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
            data: { embeds: [embed] }
        });
    }
    else {
        const embed = new Discord.MessageEmbed()
            .setColor("")
            .setDescription("Successfully Deleted");

        return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
            data: { embeds: [embed] }
        });
    }
}