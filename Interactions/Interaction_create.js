
module.exports.run = async (client, interaction) => {

    const date = new Date();
    //Acknowledging the interaction
    try {
        await client.api.interactions(interaction.id, interaction.token).callback.post({
            data: { type: 5 }
        })

        const slash = client.interactions.get(interaction.data.name);

        await slash.run(client, interaction, interaction.data.options);
        console.log(`>> ${date.toUTCString()}-${interaction.guild_id}: ${interaction.member.user.username}#${interaction.member.user.discriminator}-${interaction.data.name}`);
    } catch (error) {
        console.log(`>> ${date.toUTCString()}-${interaction.guild_id}: ${interaction.member.user.username}#${interaction.member.user.discriminator}-${interaction.data.name}
        -----------------------------------------\n${error.message}`);
    }
    return;
}