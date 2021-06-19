const { Pool, Client } = require('pg');
require('dotenv').config();
const chalk = require('chalk');

const connectionString = process.env.DB_URL;
const pool = new Pool({ connectionString });

pool.on('error', (err, client) => {
	console.error('Unexpected error on idle client', err);
	process.exit(-1);
});

module.exports.addWar = async (server_1, server_2, clan_1, clan_2) => {
	const query_string = `INSERT INTO war_history
    (server_1,  server_2, matched_at, clan_1,  clan_2)
    VALUES($1, $2, NOW(), $3, $4)`;

	const values = [server_1, server_2, clan_1, clan_2];

	try {
		const res = await pool.query(query_string, values);
	} catch (err) {
		console.log(`${chalk.red("addWar")} - ${err.message}`);
	}
};

module.exports.getWar = async (server_id) => {
	const query_string = `SELECT * FROM war_history
    WHERE server_1 = $1
    OR server_2 = $1`;

	const values = [server_id];

	try {
		const res = await pool.query(query_string, values);
		return res.rows;
	} catch (err) {
		console.log(`${chalk.red("getWar")} - ${err.message}`);
	}
};
