const Discord = require("discord.js");

module.exports.reply = async function (client, interaction, data) {
    const webhook = new Discord.WebhookClient(client.user.id, interaction.token);
    webhook.send(data);
}

module.exports.edit = async function (client, interaction, data) {
    return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
        data: data
    });
}