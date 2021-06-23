const { CommandHandlerEvents } = require('../util/Constants');
const Structures = require('../util/Structures');

class CommandHandler extends Structures.Handler {
	constructor(client, {
		directory,
		prefix = '!'
	} = {}) {
		super(client, { directory });

		this.client = client;
		this.directory = directory;
		this.prefix = typeof prefix === 'function' ? prefix.bind(this) : prefix;

		this.setup();
	}

	setup() {
		this.client.once('ready', () => {
			this.client.on('message', (msg) => {
				this.handle(msg);
			});
		});
	}

	async handle(message) {
		if (message.author.bot) return;
		const prefix = this.call(this.prefix)(message);
		const parsed = this.parsePrefix(message, prefix);
		if (!parsed.command) return;
		return this.exec(message, parsed.command, parsed.content);
	}

	call(prefix) {
		if (typeof prefix === 'function') {
			return prefix;
		}
		return () => prefix;
	}

	parsePrefix(message, prefix) {
		const msg = message.content.toLowerCase();
		if (!msg.startsWith(prefix.toLowerCase())) return {};

		const endOfPrefix = msg.indexOf(prefix.toLowerCase()) + prefix.length;
		const startOfArgs = message.content.slice(endOfPrefix).search(/\S/) + prefix.length;
		const alias = message.content.slice(startOfArgs).split(/\s{1,}|\n{1,}/)[0];
		const command = this.modules.find((cmd) => cmd.aliases.includes(alias.toLowerCase()));
		const content = message.content.slice(startOfArgs + alias.length + 1).trim();
		const afterPrefix = message.content.slice(prefix.length).trim();

		if (!command) {
			this.emit(CommandHandlerEvents.COMMAND_INVALID, message, afterPrefix);
			return { prefix, alias, content, afterPrefix };
		}

		if (command.ownerOnly && !this.client.isOwner(message.author.id)) {
			this.emit(CommandHandlerEvents.COMMAND_BLOCKED, message, command);
			return { prefix, alias, content, afterPrefix };
		}

		return { command, prefix, alias, content, afterPrefix };
	}

	async exec(message, command, args) {
		try {
			this.emit(CommandHandlerEvents.COMMAND_STARTED, message, command, args);
			await command.exec(message, args);
		} catch (error) {
			this.emit(CommandHandlerEvents.ERROR, error, message, command, args);
		}
	}
}

module.exports = CommandHandler;
