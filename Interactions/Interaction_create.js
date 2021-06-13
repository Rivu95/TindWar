
module.exports.run = (client, interaction) => {

    const date = new Date();
    //Acknowledging the interaction
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 5,
            data: {
                content: "none"
            }
        }
    })

    const slash = client.interactions.get(interaction.data.name);
    try {
        slash.run(client, interaction, interaction.data.options);
        console.log(`>> ${interaction.guild_id} - ${interaction.member.user.username}#${interaction.member.user.discriminator} - ${interaction.data.name} - ${date.toDateString()}`);
    } catch (error) {
        console.log(`>> ${interaction.guild_id} - ${interaction.member.user.tag} - ${interaction.data.name} - ${date.toDateString()}
        -----------------------------------------\n${error}`);
    }
    return;
}