require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DB_URL });

pool.on("error", (error, client) => {
    console.error("Unexpected error on idle client", error);
    process.exit(-1);
});

const run = async () => {
    await pool.query(
        `CREATE TABLE public.server_clan_registry (
            team_name text NULL,
            clan_tag text NOT NULL,
            clan_name text NULL,
            registered_by text NULL,
            register_time timestamp(0) NULL,
            channel_id text NULL,
            CONSTRAINT server_clan_registry_pk PRIMARY KEY (clan_tag)
        );`
    );

    await pool.query(
        `CREATE TABLE public.war_match (
            clan_tag text NOT NULL,
            search_time text NULL,
            entry_time timestamp(0) NULL,
            search_end_time timestamp(0) NULL,
            format text NULL,
            CONSTRAINT war_match_pk PRIMARY KEY (clan_tag)
        );`
    );

    await pool.query(
        `CREATE TABLE public.war_history (
            matched_at timestamp(0) NULL,
            winner text NULL,
            clan_1 text NULL,
            clan_2 text NULL,
            match_id serial NOT NULL,
            format text NULL,
            CONSTRAINT war_history_pk PRIMARY KEY (match_id)
        );`
    );

    await pool.query(
        `CREATE TABLE public.stats (
            bot_id text NOT NULL,
            server_count int4 NULL,
            war_matched int4 NULL,
            commands_per_week int4 NULL,
            CONSTRAINT stats_pk PRIMARY KEY (bot_id)
        )`
    );

    await pool.query(
        `CREATE TABLE public.clan_rep_registry (
            rep_id text NOT NULL,
            clan_tag text NULL,
            discord_tag text NULL,
            CONSTRAINT clan_rep_registry_pk PRIMARY KEY (rep_id)
        );
        CREATE INDEX clan_rep_registry_rep_id_idx ON public.clan_rep_registry USING btree (rep_id);`
    )
};

run();
