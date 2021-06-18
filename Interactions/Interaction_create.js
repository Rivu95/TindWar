
const chalk = require('chalk');

module.exports.run = async (client, interaction) => {

    const date = new Date();
    //Acknowledging the interaction
    try {
        await client.api.interactions(interaction.id, interaction.token).callback.post({
            data: { type: 5 }
        })

        const slash = client.interactions.get(interaction.data.name);

        await slash.run(client, interaction, interaction.data.options);
        console.log(`>> ${chalk.blue(date.toUTCString())}-${interaction.guild_id}: ${interaction.member.user.username}#${interaction.member.user.discriminator} - ${chalk.green(interaction.data.name)}`);
    } catch (error) {
        console.log(`ERROR ${chalk.red(date.toUTCString())}-${interaction.guild_id}: ${interaction.member.user.username}#${interaction.member.user.discriminator} - ${chalk.red(interaction.data.name)}
        -----------------------------------------\n${error.message}`);
    }
    return;
}