require("dotenv").config();

const { Pool } = require("pg");

const connectionString = process.env.DB_URL;
const pool = new Pool({ connectionString });

pool.on("error", (err, client) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

const run = async () => {
	await pool.query(
		`
        CREATE TABLE server_clan_registry (
            server_id text NOT NULL,
            team_name text NULL,
            clan_tag text NULL,
            clan_name text NULL,
            representative_id text NULL,
            server_invite text NULL,
            registered_by text NULL,
            register_time timestamp(0) NULL,
            last_played_with text NULL,
            channel_id text NULL,
            CONSTRAINT server_clan_registry_pk PRIMARY KEY (server_id)
        )
        `
	);
};

run();
