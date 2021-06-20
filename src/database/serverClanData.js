const { Pool } = require("pg");
const chalk = require("chalk");

const connectionString = process.env.DB_URL;
const pool = new Pool({ connectionString });

pool.on("error", (err, client) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

// adding and updating new Servers
module.exports.addServer = async (server_id, team_name, clan_tag, clan_name, representative, seerver_invite, regisered_by, channel_id) => {
	const query_string = `INSERT INTO server_clan_registry
	(server_id,  team_name,  clan_tag,  clan_name,  representative_id,  server_invite,  registered_by,  register_time, channel_id)
	VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8)
    ON CONFLICT (server_id)
	DO UPDATE SET
	team_name = $2,
    clan_tag = $3,
    clan_name = $4,
    representative_id = $5,
    server_invite = $6,
    registered_by = $7,
    register_time = NOW(),
    channel_id = $8`;

	const values = [server_id, team_name, clan_tag, clan_name, representative, seerver_invite, regisered_by, channel_id];

	try {
		const res = await pool.query(query_string, values);
	} catch (err) {
		console.log(`${chalk.red("addServer")} - ${err.message}`);
		return false;
	}
};

// for clan change by Admin
module.exports.updateServer = async (server_id, clan_tag, clan_name) => {
	const query_string = `UPDATE server_clan_registry
	SET clan_tag = $2,
        clan_name = $3,
    WHERE server_id = $1`;

	const values = [server_id, clan_tag, clan_name];

	try {
		const res = await pool.query(query_string, values);
	} catch (err) {
		console.log(`${chalk.red("updateServer")} - ${err.message}`);
		return false;
	}
};

// getting details of a server
module.exports.getServer = async (server_id) => {
	const query_string = `SELECT * FROM server_clan_registry
	WHERE server_id = $1`;

	const values = [server_id];

	try {
		const res = await pool.query(query_string, values);
		return res.rows[0];
	} catch (err) {
		console.log(`${chalk.red("getServer")} - ${err.message}`);
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
module.exports.deleteServer = async (server_id) => {
	const query_string = `DELETE * FROM server_clan_registry
	WHERE server_id = $1`;

	const values = [server_id];

	try {
		const res = await pool.query(query_string, values);
	} catch (err) {
		console.log(`${chalk.red("deleteServer")} - ${err.message}`);
		return false;
	}
};