// Apparently Sqlite is not strong enough, so i switch to Postgres for the panel data, the Panel Account data still use Sqlite.

// I swear to god, setup the postgre in local machine is pain in my ass.
// I put two example table in .sql file in the src/web_api/postgre folder.
pub mod delete;
pub mod get;
pub mod update;
