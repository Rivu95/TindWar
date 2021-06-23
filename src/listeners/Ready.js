const { Listener } = require('../../packages');

class Ready extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			category: 'client',
			event: 'ready'
		});
	}

	exec() {
		console.log('/');
	}
}

module.exports = Ready;
