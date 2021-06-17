const Long = require("long");
const Discord = require("discord.js");
require('dotenv').config();

module.exports.run = async (client, guild) => {
    // defaut server settings
    const log_channel = client.channels.cache.get(process.env.BOT_LOG);

    //finding a channel to send first message after join
    const getDefaultChannel = guild => {
        // Checking for a "general" channel
        const generalChannel = guild.channels.cache.find(channel => channel.name === "general");

        if (generalChannel && generalChannel.permissionsFor(guild.client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS"])) {
            return generalChannel;
        }

        // first channel in order where the bot can speak
        return guild.channels.cache
            .filter(c => c.type === "text" && c.permissionsFor(guild.client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS"]))
            .sort((a, b) => a.position - b.position || Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
            .first();
    };


    let embed = new Discord.MessageEmbed()
        .setColor("#ff77bc")
        .setTitle("Hello New people, Thanks for having me")
        .setDescription("I can hook you up with another clan wanting a friendly war(5v5 ESL type)\nBut first have a Quick read to the below section!")
        .addFields(
            {
                name: "Bot Prefix",
                value: "This Bot only uses slash commands for Public commands, so no prefix!",
                inline: false
            },
            {
                name: "What to do first ?",
                value: "**Register your Clan, Team name and other credentials using `register` slash command**",
                inline: false
            },
            {
                name: "What perms do i need ?",
                value: "**Read/view channel, send message,\nlink embed, add reaction,\nuse external emojis, attach files\nThis are Essential**",
                inline: false
            },
            {
                name: "Support Server",
                value: "https://discord.gg/uq7TEc79",
                inline: false
            }
        );

    const channel = getDefaultChannel(guild);
    if (channel) {
        try {
            await channel.send({ embed });
        } catch (err) {
            console.log("Could not send message to " + guild.name);
        }
    }
    log_channel.send("```Bot has joined " + guild.name + " server\nOwner ID: " + guild.ownerID + "\nServer ID: " + guild.id + "```");

};
