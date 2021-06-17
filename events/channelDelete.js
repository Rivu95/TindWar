require('dotenv').config();
module.exports.run = async (client, channel) => {

    let clan = await clandb.getRegisteredChannel(channel.id);
    let server = await serverdb.getServer(channel.guild.id);

    if (!clan) {
        return
    }

    return console.log(`${channel} with clan has been deleted!`);
}