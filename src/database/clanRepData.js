const { Pool } = require("pg");
const chalk = require("chalk");

const connectionString = process.env.DB_URL;
const pool = new Pool({ connectionString });

pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});

// adding and new rep
module.exports.addRep = async (discord_id, clan_tag, discord_tag) => {

    const query_string = `INSERT INTO clan_rep_registry
	(rep_id, clan_tag, discord_tag)
	VALUES ($1, $2, $3)`

    const values = [discord_id, clan_tag, discord_tag];

    try {
        const res = await pool.query(query_string, values);
    } catch (err) {
        console.log(`${chalk.red("addRep")} - ${err.message}`);
        return false;
    }
}

// getting data for a rep id
module.exports.getClan = async (discord_id) => {

    const query_string = `Select * FROM clan_rep_registry
    INNER JOIN server_clan_registry
    ON clan_rep_registry.clan_tag = server_clan_registry.clan_tag
	WHERE rep_id =$1`;

    const values = [discord_id];

    try {
        const res = await pool.query(query_string, values);
        return res.rows[0];
    } catch (err) {
        console.log(`${chalk.red("getRep")} - ${err.message}`);
        return false;
    }
}

// getting all reps of a clan
module.exports.getAllReps = async (clan_tag) => {

    const query_string = `Select * FROM clan_rep_registry
	WHERE clan_tag =$1`;

    const values = [clan_tag];

    try {
        const res = await pool.query(query_string, values);
        return res.rows;
    } catch (err) {
        console.log(`${chalk.red("getRep")} - ${err.message}`);
        return false;
    }
}

// delete rep_id
module.exports.deleteRep = async (discord_id, clan_tag) => {

    const query_string = `DELETE FROM  clan_rep_registry
	WHERE rep_id =$1 
    AND clan_tag = $2
    RETURNING *`;

    const values = [discord_id, clan_tag];

    try {
        const res = await pool.query(query_string, values);
        return res.rows[0];
    } catch (err) {
        console.log(`${chalk.red("deleteRep")} - ${err.message}`);
        return false;
    }
}