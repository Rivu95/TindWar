// 858293321033580574
const Discord = require("discord.js");
const repDb = require("../database/clanRepData");

module.exports = {
    name: "view-team",
    description: "Shows your team and representatives",
    helplink: "https://cdn.discordapp.com/attachments/695662581276475523/695662645541470208/clan.png",
    guildOnly: true
};

module.exports.run = async (client, interaction, options, guild) => {

    const hasClan = await repDb.getClan(interaction.member.user.id);

    // if the user has no team
    if (!hasClan) {
        const embed = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setTitle("You don't have any team at this moment");

        return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
            data: { embeds: [embed] }
        });
    }

    const reps = await repDb.getAllReps(hasClan.clan_tag);
    const embed = new Discord.MessageEmbed()
        .setColor("#00ff00")
        .setDescription(`Team Name: ${hasClan.team_name}\nClan: ${hasClan.clan_name} [(${hasClan.clan_tag})](https://link.clashofclans.com/en?action=OpenClanProfile&tag=${client.coc.parseTag(hasClan.clan_tag, true)})`)
        .addField(`Representatives`, `\`\`\`${reps.map(x => x.discord_tag).join("\n")}\`\`\``);
    return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
        data: { embeds: [embed] }
    });
}