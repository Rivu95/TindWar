const { Pool } = require("pg");
const chalk = require("chalk");

const connectionString = process.env.DB_URL;
const pool = new Pool({ connectionString });

pool.on("error", (err, client) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

// Adding clan to wait period if no match found
module.exports.addClan = async (clan_tag, search_time, interval, server_id, format) => {
	const query_string = `INSERT INTO war_match
    (clan_tag,  search_time,  entry_time,  search_end_time, server_id, format)
    VALUES ($1, $2, NOW(), NOW() + interval '${interval} hour', $3, $4)`;

	const values = [clan_tag, search_time, server_id, format];

	try {
		const res = await pool.query(query_string, values);
	} catch (err) {
		console.log(`${chalk.red("addClan")} - ${err.message}`);
	}
};

// getting clan details
module.exports.getClan = async (clan_tag) => {
	const query_string = `SELECT * FROM war_match
    INNER JOIN server_clan_registry
    ON war_match.clan_tag = server_clan_registry.clan_tag
    WHERE clan_tag = $1`;

	const values = [clan_tag];

	try {
		const res = await pool.query(query_string, values);
		return res.rows[0];
	} catch (err) {
		console.log(`${chalk.red("getClan")} - ${err.message}`);
	}
};

// getting the first clan in wait list
module.exports.getAll = async (format) => {

	if (format) {
		const query_string = `SELECT * FROM war_match
    	INNER JOIN server_clan_registry
    	ON war_match.clan_tag = server_clan_registry.clan_tag
    	WHERE format = $1`;

		const values = [format];

		try {
			const res = await pool.query(query_string, values);
			return res.rows[0];
		} catch (err) {
			console.log(`${chalk.red("getAll")} - ${err.message}`);
		}
	} else {
		const query_string = `SELECT * FROM war_match
    	INNER JOIN server_clan_registry
    	ON war_match.clan_tag = server_clan_registry.clan_tag`;

		const values = [];

		try {
			const res = await pool.query(query_string, values);
			return res.rows;
		} catch (err) {
			console.log(`${chalk.red("getAll")} - ${err.message}`);
		}
	}
};

// deleting once the clan is matched
module.exports.deleteClanByServer = async (server_id) => {
	const query_string = `DELETE FROM war_match
    WHERE server_id = $1
    RETURNING *`;

	const values = [server_id];

	try {
		const res = await pool.query(query_string, values);
		return res.rows[0];
	} catch (err) {
		console.log(`${chalk.red("deleteClanByServer")} - ${err.message}`);
	}
};

// deleting clan once wait period is over
module.exports.deleteClanByTime = async () => {
	const query_string = `DELETE FROM war_match
    WHERE NOW() > search_end_time
    RETURNING *`;

	const values = [];

	try {
		const res = await pool.query(query_string, values);
		return res.rows[0];
	} catch (err) {
		console.log(`${chalk.red("deleteClanByTime")} - ${err.message}`);
	}
};
