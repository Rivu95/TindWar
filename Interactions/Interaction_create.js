
module.exports.run = async (client, interaction) => {

    const date = new Date();
    //Acknowledging the interaction
    try {
        await client.api.interactions(interaction.id, interaction.token).callback.post({
            data: { type: 5 }
        })

        const slash = client.interactions.get(interaction.data.name);

        await slash.run(client, interaction, interaction.data.options);
        console.log(`>> ${interaction.guild_id} - ${interaction.member.user.username}#${interaction.member.user.discriminator} - ${interaction.data.name} - ${date.toDateString()}`);
    } catch (error) {
        console.log(`>> ${interaction.guild_id} - ${interaction.member.user.tag} - ${interaction.data.name} - ${date.toDateString()}
        -----------------------------------------\n${error.message}`);
    }
    return;
}