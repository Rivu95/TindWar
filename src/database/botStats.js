const { Pool } = require("pg");
const chalk = require("chalk");

const connectionString = process.env.DB_URL;
const pool = new Pool({ connectionString });

pool.on("error", (err, client) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

module.exports.updateStats = async (type) => {
	let query_string;
	if (type === "server add") {
		query_string = `UPDATE stats
        SET server_count = server_count + 1
        WHERE bot_id = $1`;
	}
	if (type === "war match") {
		query_string = `UPDATE stats
        SET war_matched = war_matched + 1
        WHERE bot_id = $1`;
	}
	if (type === "command") {
		query_string = `UPDATE stats
        SET commands_per_week = commands_per_week + 1
        WHERE bot_id = $1`;
	}

	const values = [process.env.BOT_ID];

	try {
		const res = await pool.query(query_string, values);
	} catch (err) {
		console.log(`${chalk.red("updateStats")} - ${err.message}`);
	}
};

module.exports.getStats = async () => {
	const query_string = `SELECT * FROM stats
    WHERE bot_id = $1`;

	const values = [process.env.BOT_ID];

	try {
		const res = await pool.query(query_string, values);
		return res.rows[0];
	} catch (err) {
		console.log(`${chalk.red("getStats")} - ${err.message}`);
	}
};
