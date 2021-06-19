const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const fs = require("fs");
require('dotenv').config();
const cron = require("node-cron");

const client = new Client({ ws: { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] } });
client.cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Tindwar is online!')
	client.user.setActivity("slash commands", { type: "LISTENING" });
});

//------------------------------- Interaction Handler -------------------------------//
const Interaction = require("./Interactions/Interaction_create");
client.ws.on('INTERACTION_CREATE', async interaction => {
	Interaction.run(client, interaction);
})

client.interactions = new Discord.Collection();
fs.readdir("./slash_commands", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith(".js")) return;
		let interaction = require(`./slash_commands/${file}`);
		console.log(`Attempting to load slashes ${interaction.name}`);
		client.interactions.set(interaction.name, interaction);
	});
});

//------------------------------- Event Handler -------------------------------//
fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const eventFunction = require(`./events/${file}`);
		if (eventFunction.disabled) return;

		const event = eventFunction.event || file.split(".")[0];
		const emitter =
			(typeof eventFunction.emitter === "string"
				? client[eventFunction.emitter]
				: eventFunction.emitter) || client;
		const once = eventFunction.once;

		try {
			emitter[once ? "once" : "on"](event, (...args) =>
				eventFunction.run(client, ...args)
			);
		} catch (error) {
			console.error(error.stack);
		}
	});
});

//------------------------------- Command Handler -------------------------------//
client.commands = new Discord.Collection();
let commandFolders = fs
	.readdirSync("./commands");

for (const folder of commandFolders) {
	let commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter(file => file.endsWith(".js"));

	for (const file of commandFiles) {
		let command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

//------------------------------- Error Logging -------------------------------//
process.on("unhandledRejection", error => {
	console.log(error);
});

//------------------------------- Logging In -------------------------------//
client.login(process.env.BOT_TOKEN);

// ------------------------------- CoC package -------------------------------//
const coc = require("./utils/coc")
client.coc = coc.client;

//------------------------------- Cron Job Handler -------------------------------//
// deleting waiting list
const waitListEnd = require("./utils/searchEndScript")
cron.schedule("*/1 * * * *", async function () {
	await waitListEnd.run(client);
});
