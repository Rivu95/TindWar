require("dotenv").config();
const fetch = require("node-fetch");
const { ApplicationCommandOptionType, APIApplicationCommandOption } = require("discord-api-types/v8");

/**
 * @type {{ name: string; description: string; options?: APIApplicationCommandOption[] }[]}
 */
const commands = [
	{
		name: "stats",
		description: "Shows some stats about the bot"
	},
	{
		name: "invite",
		description: "TindWar Bot Invite Link"
	},
	{
		name: "help",
		description: "Shows all the slash commands"
	},
	{
		name: "cancel-search",
		description: "Cancel on-going war search!"
	},
	{
		name: "register",
		description: "Register your server for friendly matchups",
		options: [
			{
				type: ApplicationCommandOptionType.STRING,
				name: "team_name",
				description: "Name of your team",
				required: true
			},
			{
				type: ApplicationCommandOptionType.STRING,
				name: "clan_tag",
				description: "clan tag of clan you will playing from",
				required: true
			},
			{
				type: ApplicationCommandOptionType.CHANNEL,
				name: "notification_channel",
				description: "Channel where bot will post about war matchups",
				required: true
			}
		]
	},
	{
		name: "find-war",
		description: "find a friendly war",
		options: [
			{
				type: ApplicationCommandOptionType.STRING,
				name: "search_time",
				description: "Time you want to search for a friendly",
				required: true,
				choices: [
					{
						name: "15 minutes",
						value: "0.25"
					},
					{
						name: "30 minutes",
						value: "0.5"
					},
					{
						name: "1 hour",
						value: "1"
					},
					{
						name: "2 hours",
						value: "2"
					},
					{
						name: "4 hours",
						value: "4"
					}
				]
			},
			{
				type: ApplicationCommandOptionType.STRING,
				name: "format",
				description: "Format/Base distribution of friendly",
				required: true,
				choices: [
					{
						name: "TH-14 5v5 1 HIT",
						value: "th_14_5v5_1_hit"
					},
					{
						name: "TH-14 5v5 2 HIT",
						value: "th_14_5v5_2_hit"
					},
					{
						name: "TH-13 5v5",
						value: "th_13_5v5"
					},
					{
						name: "TH-12 5v5",
						value: "th_12_5v5"
					},
					{
						name: "TH-11 5v5",
						value: "th_12_5v5"
					},
					{
						name: "TH-10 5v5",
						value: "th_10_5v5"
					},
					{
						name: "TH-9 5v5",
						value: "th_09_5v5"
					}
				]
			}
		]
	},
	{
		name: "delete-rep",
		description: "Add a representative to a clan",
		options: [
			{
				type: ApplicationCommandOptionType.USER,
				name: "discord_user",
				description: "Mention the representative",
				required: true
			},
			{
				type: ApplicationCommandOptionType.STRING,
				name: "clan_tag",
				description: "The clan he/she will be representing",
				required: true
			}
		]
	},
	{
		name: "add-rep",
		description: "Add a representative to a clan",
		options: [
			{
				type: ApplicationCommandOptionType.USER,
				name: "discord_user",
				description: "Mention the representative",
				required: true
			},
			{
				type: ApplicationCommandOptionType.STRING,
				name: "clan_tag",
				description: "The clan he/she will be representing",
				required: true
			}
		]
	},
	{
		name: "view-team",
		description: "View your team"
	},
	{
		name: "support",
		description: "Get support server invite link."
	}
];

if (process.env.NODE_ENV === "development") {
	(async () => {
		const res = await fetch(
			`https://discord.com/api/v8/applications/${process.env.TEST_CLIENT_ID}/guilds/${process.env.TEST_GUILD_ID}/commands`,
			{
				method: "PUT",
				headers: {
					"Authorization": `Bot ${process.env.BOT_TOKEN}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(commands)
			}
		);
		const body = await res.json();
		console.log(res.status, JSON.stringify(body));
	})();
}

if (process.env.NODE_ENV === "production") {
	(async () => {
		const res = await fetch(`https://discord.com/api/v8/applications/${process.env.CLIENT_ID}/commands`, {
			method: "PUT",
			headers: {
				"Authorization": `Bot ${process.env.BOT_TOKEN}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(commands)
		});
		const body = await res.json();
		console.log(res.status, JSON.stringify(body));
	})();
}
