const { Pool, Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DB_URL
const pool = new Pool({ connectionString: connectionString, })

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

// Adding clan to wait period if no match found
module.exports.addClan = async function (clan_tag, search_time, interval, server_id) {
    const query_string = `INSERT INTO war_match
	(clan_tag,  search_time,  entry_time,  search_end_time, server_id)
    VALUES ($1, $2, NOW(), NOW() + interval '${interval} hour', $3)`;

    const values = [clan_tag, search_time, server_id];

    try {
        const res = await pool.query(query_string, values);
    } catch (err) {
        console.log(`addClan - ${err.message}`);
    }
}

// getting clan details 
module.exports.getClan = async function (clan_tag) {
    const query_string = `SELECT * FROM war_match 
    INNER JOIN server_clan_registry
    ON war_match.clan_tag = server_clan_registry.clan_tag
	WHERE clan_tag = $1`;

    const values = [clan_tag];

    try {
        const res = await pool.query(query_string, values);
        return res.rows[0];
    } catch (err) {
        console.log(`getClan - ${err.message}`);
    }
}

// getting the first clan in wait list
module.exports.getAll = async function () {
    const query_string = `SELECT * FROM war_match 
    INNER JOIN server_clan_registry 
    ON war_match.clan_tag = server_clan_registry.clan_tag`;

    const values = [];

    try {
        const res = await pool.query(query_string, values);
        return res.rows[0];
    } catch (err) {
        console.log(`getAll - ${err.message}`);
    }
}

// deleting once the clan is matched
module.exports.deleteClanByServer = async function (server_id) {
    const query_string = `DELETE FROM war_match
	WHERE server_id = $1`;

    const values = [server_id];

    try {
        const res = await pool.query(query_string, values);
    } catch (err) {
        console.log(`deleteClanByServer - ${err.message}`);
    }
}

// deleting clan once wait period is over
module.exports.deleteClanByTime = async function () {
    const query_string = `DELETE FROM war_match
	WHERE NOW() > search_end_time
    RETURNING *`;

    const values = [];

    try {
        const res = await pool.query(query_string, values);
        return res.rows[0];
    } catch (err) {
        console.log(`deleteClanByTime - ${err.message}`);
    }
}