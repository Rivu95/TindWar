
const Discord = require("discord.js");
const DB = require("../Database/serverClanData");
const statsDB = require("../Database/botStats");

module.exports.run = async (client, interaction, options) => {

    const guild = client.guilds.cache.get(interaction.guild_id);
    const clan_tag = client.coc.parseTag(options[1].value, false);
    const member = await guild.members.fetch(options[2].value);
    const channel = client.channels.cache.get(options[4].value);

    await guild.members.fetch(interaction.member.user.id);
    if (!guild.members.cache.get(interaction.member.user.id).hasPermission("MANAGE_GUILD")) {
        const error_embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setDescription("Need Manage Server or higher permission for you to use this command!");

        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [embed] }
        });
    }

    // checking if the clan is claimed by any other server
    const clan_claimed = await DB.getServerByClan(clan_tag);
    if (clan_claimed && clan_claimed.server_id != interaction.guild_id) {

        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { content: "This **clan is claimed by another server**, if you still want to claim it contact Tindwar support with enough proof!" }
        });
    }

    // getting details of clan
    let clan_data = await client.coc.clan(clan_tag);
    if (!clan_data.ok) {
        const error_embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Something went wrong!");

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
        const error_embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Mentioned Channel is NOT a Text Channel");
        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [error_embed] }
        });
    }

    if (!channel.permissionsFor(guild.client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS"])) {
        const error_embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Bot **does not have** necessary Perms in that channel, it needs **SEND MESSAGES, VIEW CHANNEL, EMBED LINKS** atleast");
        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [error_embed] }
        });
    }

    // checking if this is actually an update
    const server = await DB.getServer(interaction.guild_id);
    if (server) {
        const embed = new Discord.MessageEmbed()
            .setColor()
            .setTitle("Changing Previous Registration")
            .setDescription(`**__Previously Registered__**\n\`\`\`\nClan: ${server.clan_name} - ${server.clan_tag}\nRepresentative: ${server.representative_id}\nServer Invite: ${server.server_invite}\`\`\``)
            .addField("Current Registration", `**\`\`\`\nClan: ${clan_data.name} - ${clan_tag}\nRepresentative: ${member.user.tag}\nServer Invite: ${options[3].value}\`\`\`**`)
            .setTimestamp();

        await DB.addServer(interaction.guild_id, options[0].value, clan_tag, clan_data.name, member.user.tag, options[3].value, interaction.member.user.id, options[4].value);
        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [embed] }
        });
    }

    // for first registration
    else {
        await DB.addServer(interaction.guild_id, options[0].value, clan_tag, clan_data.name, member.user.tag, options[3].value, interaction.member.user.id, options[4].value);
        await statsDB.updateStats("server add");

        const embed = new Discord.MessageEmbed()
            .setColor()
            .setTitle("Successfully Registered")
            .setDescription(`**__Current Registration__\n\`\`\`\nClan: ${clan_data.name} - ${clan_tag}\nRepresentative: ${member.user.tag}\nServer Invite: ${options[3].value}\`\`\`**`)
            .setThumbnail()
            .setTimestamp();

        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [embed] }
        });
    }
}