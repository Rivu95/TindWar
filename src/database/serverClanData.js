const { Pool } = require("pg");
const chalk = require("chalk");

const connectionString = process.env.DB_URL;
const pool = new Pool({ connectionString });

pool.on("error", (err, client) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

// adding and updating new Servers
module.exports.addServer = async (team_name, clan_tag, clan_name, regisered_by, channel_id) => {
	const query_string = `INSERT INTO server_clan_registry
	(team_name,  clan_tag,  clan_name, registered_by,  register_time, channel_id)
	VALUES ($1, $2, $3, $4, NOW(), $5)
    ON CONFLICT (clan_tag)
	DO UPDATE SET
	team_name = $1,
    clan_name = $3,
    registered_by = $4,
    register_time = NOW(),
    channel_id = $5`;

	const values = [team_name, clan_tag, clan_name, regisered_by, channel_id];

	try {
		const res = await pool.query(query_string, values);
	} catch (err) {
		console.log(`${chalk.red("addServer")} - ${err.message}`);
		return false;
	}
};

// getting server by clan used in register to find cliamed clans
module.exports.getServerByClan = async (clan_tag) => {
	const query_string = `SELECT * FROM server_clan_registry
	WHERE clan_tag = $1`;

	const values = [clan_tag];

	try {
		const res = await pool.query(query_string, values);
		return res.rows[0];
	} catch (err) {
		console.log(`${chalk.red("getServerByClan")} - ${err.message}`);
		return false;
	}
};

// deleting server on server leave
module.exports.deleteClan = async (clan_tag) => {
	const query_string = `DELETE FROM server_clan_registry
	WHERE clan_tag = $1`;

	const values = [server_id];

	try {
		const res = await pool.query(query_string, values);
	} catch (err) {
		console.log(`${chalk.red("deleteServer")} - ${err.message}`);
		return false;
	}
};
