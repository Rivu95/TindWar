const { Listener } = require('../../../packages');

class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			category: 'client',
			event: 'ready'
		});
	}

	exec() {
		console.log(`Ready ${this.client.user.tag}`);
	}
}

module.exports = ReadyListener;
