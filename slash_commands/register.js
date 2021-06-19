// 852455462275907634
const Discord = require("discord.js");
const DB = require("../Database/serverClanData");
const statsDB = require("../Database/botStats");

module.exports = {
    name: "register",
    description: "Register Your Team Name, Clan, Other details in the Bot database. This should be your first command!",
    helplink: "https://cdn.discordapp.com/attachments/695662581276475523/695662645541470208/clan.png",
    guildOnly: true,
    permissions: "MANAGE_GUILD"
};

module.exports.run = async (client, interaction, options, guild) => {

    const clan_tag = client.coc.parseTag(options[1].value, false);
    const member = await guild.members.fetch(options[2].value);
    const channel = client.channels.cache.get(options[3].value);
    const server_invite = options[4]?.value ?? "Contact Representative";
    const error_embed = new Discord.MessageEmbed().setColor("#ff0000");

    // checking if the clan is claimed by any other server
    const clan_claimed = await DB.getServerByClan(clan_tag);
    if (clan_claimed && clan_claimed.server_id != interaction.guild_id) {
        error_embed
            .setDescription("This **clan is claimed by another server**, if you still want to claim it contact Tindwar support with enough proof!");

        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [error_embed] }
        });
    }

    // getting details of clan
    let clan_data = await client.coc.clan(clan_tag);
    if (!clan_data.ok) {
        // error check
        if (clan_data.statusCode === 404) { error_embed.setTitle("There is NO clan with this tag!") };
        if (clan_data.statusCode === 503) { error_embed.setTitle("CoC Api is in Maintanance, try after some time.") };
        if (clan_data.statusCode === 504) { error_embed.setTitle("CoC Api seems to be too slow, try again later!") };

        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [error_embed] }
        });
    }

    // channel perms and type verification
    if (channel.type != "text") {
        error_embed.setTitle("Mentioned Channel is NOT a Text Channel");
        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [error_embed] }
        });
    }

    if (!channel.permissionsFor(guild.client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS"])) {
        error_embed.setTitle("Bot **does not have** necessary Perms in that channel, it needs **SEND MESSAGES, VIEW CHANNEL, EMBED LINKS** atleast");
        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [error_embed] }
        });
    }

    // checking if this is actually an update
    const server = await DB.getServer(interaction.guild_id);
    if (server) {
        const embed = new Discord.MessageEmbed()
            .setColor("#65ff01")
            .setTitle("Changing Previous Registration")
            .setDescription(`**__Previously Registered__**\n\`\`\`\nClan: ${server.clan_name} - ${server.clan_tag}\nRepresentative: ${server.representative_id}\nServer Invite: ${server.server_invite}\`\`\``)
            .addField("Current Registration", `**\`\`\`\nClan: ${clan_data.name} - ${clan_tag}\nRepresentative: ${member.user.tag}\nServer Invite: ${server_invite}\`\`\`**`)
            .setTimestamp();

        await DB.addServer(interaction.guild_id, options[0].value, clan_tag, clan_data.name, options[2].value, server_invite, interaction.member.user.id, options[3].value);
        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [embed] }
        });
    }

    // for first time registration
    else {
        await DB.addServer(interaction.guild_id, options[0].value, clan_tag, clan_data.name, options[2].value, server_invite, interaction.member.user.id, options[3].value);
        await statsDB.updateStats("server add");

        const embed = new Discord.MessageEmbed()
            .setColor("#65ff01")
            .setTitle("Successfully Registered")
            .setDescription(`**__Current Registration__\n\`\`\`\nClan: ${clan_data.name} - ${clan_tag}\nRepresentative: ${member.user.tag}\nServer Invite: ${server_invite}\`\`\`**`)
            .setThumbnail()
            .setTimestamp();

        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [embed] }
        });
    }
}