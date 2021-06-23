require('dotenv').config();
const fetch = require('node-fetch');
const { ApplicationCommandOptionType, APIApplicationCommandOption } = require('discord-api-types/v8');

/**
 * @type {{ name: string; description: string; options?: APIApplicationCommandOption[] }[]}
 */
const commands = [
    {
        name: 'stats',
        description: 'Shows some stats about the bot'
    },
    {
        name: 'invite',
        description: 'TindWar Bot Invite Link'
    },
    {
        name: 'help',
        description: 'Shows all the slash commands'
    },
    {
        name: 'cancel-search',
        description: 'Cancel on-going war search!'
    },
    {
        name: 'register',
        description: 'register your server for friendly matchups',
        options: [
            {
                type: ApplicationCommandOptionType.STRING,
                name: 'team_name',
                description: 'Name of your team',
                required: true
            },
            {
                type: ApplicationCommandOptionType.STRING,
                name: 'clan_tag',
                description: 'clan tag of clan you will playing from',
                required: true
            },
            {
                type: ApplicationCommandOptionType.USER,
                name: 'server_representative',
                description: 'Tag the person who will be the point of contact',
                required: true
            },
            {
                type: ApplicationCommandOptionType.CHANNEL,
                name: 'notification_channel',
                description: 'channel where bot will post about war matchups',
                required: true
            },
            {
                type: ApplicationCommandOptionType.STRING,
                name: 'server_invite',
                description: 'server invite for negotiations, permanant invites are preferable'
            }
        ]
    },
    {
        name: 'find-war',
        description: 'find a friendly war',
        options: [
            {
                type: ApplicationCommandOptionType.STRING,
                name: 'search-time',
                description: 'Time you want to search for a friendly',
                required: true,
                choices: [
                    {
                        name: '15 minutes',
                        value: '0.25'
                    },
                    {
                        name: '30 minutes',
                        value: '0.5'
                    },
                    {
                        name: '1 hour',
                        value: '1'
                    },
                    {
                        name: '2 hours',
                        value: '2'
                    },
                    {
                        name: '4 hours',
                        value: '4'
                    }
                ]
            }
        ]
    }
];

if (process.env.NODE_ENV === 'development') {
    (async () => {
        const res = await fetch(
            `https://discord.com/api/v8/applications/${process.env.TEST_CLIENT_ID}/guilds/${process.env.TEST_GUILD_ID}/commands`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bot ${process.env.BOT_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commands)
            }
        );
        const body = await res.json();
        console.log(res.status, JSON.stringify(body));
    })();
}

if (process.env.NODE_ENV === 'production') {
    (async () => {
        const res = await fetch(`https://discord.com/api/v8/applications/${process.env.CLIENT_ID}/commands`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bot ${process.env.BOT_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commands)
        });
        const body = await res.json();
        console.log(res.status, JSON.stringify(body));
    })();
}
