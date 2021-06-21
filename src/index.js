require("dotenv").config();

const Discord = require("discord.js");
const cron = require("node-cron");
const fs = require("fs");

const client = new Discord.Client({
    ws: { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] },
    presence: { activity: { name: "slash commands", type: "LISTENING" } }
});
client.cooldowns = new Discord.Collection();

// ------------------------------- Interaction Handler -------------------------------//
const interaction = require("./struct/interactions");
client.ws.on("INTERACTION_CREATE", (res) => {
    interaction.run(client, res);
});

client.interactions = new Discord.Collection();
fs.readdir("./src/interactions", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        const interaction = require(`../src/interactions/${file}`);
        console.log(`Attempting to load slashes ${interaction.name}`);
        client.interactions.set(interaction.name, interaction);
    });
});

// ------------------------------- Event Handler -------------------------------//
fs.readdir("./src/events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        const eventFunction = require(`../src/events/${file}`);
        if (eventFunction.disabled) return;

        const event = eventFunction.event || file.split(".")[0];
        const emitter =
			(typeof eventFunction.emitter === "string"
			    ? client[eventFunction.emitter]
			    : eventFunction.emitter) || client;
        const once = eventFunction.once;

        try {
            emitter[once ? "once" : "on"](event, (...args) =>
                eventFunction.run(client, ...args));
        } catch (error) {
            console.error(error.stack);
        }
    });
});

// ------------------------------- Command Handler -------------------------------//
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync("./src/commands");
console.log(commandFolders);
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

// ------------------------------- Error Logging -------------------------------//
process.on("unhandledRejection", (error) => {
    console.log(error);
});

// ------------------------------- Logging In -------------------------------//
client.login(process.env.BOT_TOKEN);

// ------------------------------- CoC package -------------------------------//
const coc = require("../src/utils/coc");
client.coc = coc.client;

// ------------------------------- Cron Job Handler -------------------------------//
// deleting waiting list
const waitListEnd = require("../src/utils/searchEndScript");
cron.schedule("*/1 * * * *", async () => {
    await waitListEnd.run(client);
});
