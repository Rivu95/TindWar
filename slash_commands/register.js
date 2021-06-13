/*852455462275907634
{
    "name": "register",
    "description": "register your server for friendly matchups",
    "options": [
        {
            "name": "team-name",
            "description": "Name of your team",
            "type": 3,
            "required": true
        },
        {
            "name": "clan-tag",
            "description": "clan tag of clan you will playing from",
            "type": 3,
            "required": true
        },
        {
            "name": "server-representative",
            "description": "Tag the person who will be the point of contact",
            "type": 6,
            "required": true
        },
        {
            "name": "server-invite",
            "description": "server invite for negotiations, permanant invites are preferable",
            "type": 3,
            "required": true
        },
        {
            "name": "notification-channel",
            "description": "channel where bot will post about war matchups",
            "type": 7,
            "required": true
        }
    ]
}*/
const Discord = require("discord.js");
const responce = require("../Interactions/interaction_responce");
const DB = require("../Database/serverClanData");

module.exports.run = async (client, interaction, options) => {

    const clan_tag = client.coc.parseTag(options[1].value);

    // checking if the clan is claimed by any other server
    const clan_claimed = await DB.getServerByClan(clan_tag);
    if (clan_claimed && clan_claimed.server_id != interaction.guild_id) {
        return responce.edit(client, interaction, { content: "This **clan is claimed by another server**, if you still want to claim it contact Tindwar support with enough proof!" })
    }

    // getting details of clan
    let clan_data = await client.coc.clan(clan_tag);
    if (!clan_data.ok) {

        const error_embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setDescription("Something went wrong!")

        // error check
        if (clan_data.statusCode === 404) { error_embed.setDescription("There is NO clan with this tag!") };
        if (clan_data.statusCode === 503) { error_embed.setDescription("CoC Api is in Maintanance, try after some time") };
        if (clan_data.statusCode === 504) { error_embed.setDescription("CoC Api seems to be too slow, try again later!") };

        return responce.edit(client, interaction, { embeds: [error_embed] })
    }

    // checking if this is actually an update
    let server = await DB.getServer(interaction.guild_id);
    if (server) {

        const embed = new Discord.MessageEmbed()
            .setColor()
            .setTitle("Changing Previous Registration")
            .setDescription(`**__Previously Registered__**\n\`\`\`\nClan: ${server.clan_name} - ${server.clan_tag}\nRepresentative: ${server.representative_id}\nServer Invite: ${server.server_invite}\`\`\``)
            .addField("Current Registration", `**\`\`\`\nClan: ${clan_data.name} - ${clan_tag}\nRepresentative: ${options[2].value.member.user.tag}\nServer Invite: ${options[3].value}\`\`\`**`)
            .setTimestamp();

        await DB.addServer(interaction.guild_id, options[0].value, clan_tag, clan_data.name, options[2].value.member.user.tag, options[3].value, interaction.member.user.id, options[4].value.id);
        return responce.edit(client, interaction, { embeds: [embed] });
    }

    // for first registration
    else {

        await DB.addServer(interaction.guild_id, options[0].value, clan_tag, clan_data.name, options[2].value.user.tag, options[3].value, interaction.member.user.id, options[4].value.id);
        const embed = new Discord.MessageEmbed()
            .setColor()
            .setTitle("Successfully Registered")
            .setDescription("Current Registration", `**\`\`\`\nClan: ${clan_data.name} - ${clan_tag}\nRepresentative: ${options[2].value.user.tag}\nServer Invite: ${options[3].value}\`\`\``)
            .setThumbnail()
            .setTimestamp();

        return responce.edit(client, interaction, { embeds: [embed] });
    }
}