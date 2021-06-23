const { Command } = require('../../packages');

class PingCommand extends Command {
	constructor() {
		super('ping', {
			aliases: []
		});
	}

	exec(message) {
		return message.channel.send();
	}
}

module.exports = PingCommand;
