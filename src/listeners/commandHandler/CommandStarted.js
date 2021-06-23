const { Listener } = require('../../../packages');

class CommandStarted extends Listener {
	constructor() {
		super('commandStarted', {
			event: 'commandStarted',
			category: 'commandHandler',
			emitter: 'commandHandler'
		});
	}

	exec(message, command) {
		console.log(`${message.author.tag} ~ ${command.id}`);
	}
}

module.exports = CommandStarted;
