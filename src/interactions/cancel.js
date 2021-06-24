// 856418436807917568
const Discord = require("discord.js");
const serverDB = require("../database/serverClanData");             // server-clan database
const warMatchDB = require("../database/warMatch");                 // wait list/ war-match Database

module.exports = {
    name: "cancel-search",
    description: "Cancel the on-going war search",
    helplink: "https://cdn.discordapp.com/attachments/695662581276475523/695662645541470208/clan.png",
    guildOnly: true
};

module.exports.run = async (client, interaction, options, guild) => {
    // getting wait list and server details if any
    const wait_list = await warMatchDB.deleteClanByServer(guild.id);
    const server = await serverDB.getServer(wait_list?.server_id);

    // if the server had no war search
    if (!server) {
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("You were not searching For a war in the first place!");

        return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
            data: { embeds: [embed] }
        });
    }

    const embed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle("War Search cancelled")
        .setTimestamp();

    return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
        data: { embeds: [embed] }
    });
};
