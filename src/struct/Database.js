const { Pool } = require('pg');

class Db extends Pool {
	constructor() {
		super({ connectionString: process.env.DB_URL });
	}
}

module.exports = Db;
