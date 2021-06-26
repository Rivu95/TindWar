// 858235886458241044
const Discord = require("discord.js");
const repDb = require("../database/clanRepData");

module.exports = {
    name: "add-rep",
    description: "Add a representative to a clan",
    helplink: "https://cdn.discordapp.com/attachments/695662581276475523/695662645541470208/clan.png",
    guildOnly: true
};

module.exports.run = async (client, interaction, options, guild) => {

    const hasClan = await repDb.getClan(options[0].value);
    if (hasClan) {
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setDescription(`${hasClan.clan_tag === client.coc.parseTag(options[1].value, false) ?
                 "You are not already a representative of this clan!" 
                 : `You are not already a representative of a clan! clan tag: ${hasClan.clan_tag}`}`);

        return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
            data: { embeds: [embed] }
        });
    }
    else {
        const guild = client.guilds.cache.get(interaction.guild_id);
        const member = await guild.members.fetch(options[0].value);
        await repDb.addRep(options[0].value, client.coc.parseTag(options[1].value, false), member?.user.tag);

        const embed = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setDescription("Successfully Added");

        return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
            data: { embeds: [embed] }
        });
    }
}