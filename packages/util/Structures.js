const { Collection, Client } = require('discord.js');
const { EventEmitter } = require('events');
const path = require('path');
const fs = require('fs');

class Category extends Collection {
	constructor(id, iterable) {
		super(iterable);
		this.id = id;
	}
}

class Module {
	constructor(id, { category = 'default' } = {}) {
		this.id = id;
		this.category = null;
		this.filepath = null;
		/**
		 * @type {Client}
		 */
		this.client = null;
		this.handler = null;
		this.categoryID = category;
	}

	toString() {
		return this.id;
	}
}

class Handler extends EventEmitter {
	constructor(client, { directory }) {
		super();
		this.client = client;
		this.directory = directory;
		this.modules = new Collection();
		this.categories = new Collection();
	}

	construct(instance) {
		this.modules.set(instance.id, Object.assign(instance, {
			client: this.client,
			handler: this
		}));
		if (!this.categories.has(instance.categoryID)) {
			this.categories.set(instance.categoryID, new Category(instance.categoryID));
		}
		const category = this.categories.get(instance.categoryID);
		category.set(instance.id, Object.assign(instance, { category }));
	}

	load() {
		const filepaths = this.readDirectory(this.directory);
		for (const filepath of filepaths) {
			const Instance = require(path.resolve(filepath));
			if (typeof Instance !== 'function') continue;
			const instance = new Instance();
			this.construct(instance);
		}
	}

	readDirectory(directory) {
		const filepaths = [];
		(function read(dir) {
			const files = fs.readdirSync(dir);
			for (const file of files) {
				const filepath = path.join(dir, file);
				if (fs.statSync(filepath).isDirectory()) {
					read(filepath);
				} else {
					filepaths.push(filepath);
				}
			}
		})(directory);

		return filepaths;
	}
}

module.exports = { Module, Handler };
