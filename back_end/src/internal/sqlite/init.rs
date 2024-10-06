use rusqlite::{Connection, Result};

pub fn init(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            key TEXT NOT NULL UNIQUE DEFAULT (hex(randomblob(16)))
        )",
        [],
    )?;

    conn.execute(
        "CREATE TRIGGER IF NOT EXISTS update_users
         AFTER UPDATE ON users
         WHEN NEW.password <> OLD.password
         BEGIN
             UPDATE users SET updated_at = CURRENT_TIMESTAMP,
                key = hex(randomblob(16))
             WHERE id = NEW.id;
         END",
        [],
    )?;

    // Anime Defender Table
    // Columns: updated_at, computer, name, gem, ticket, gold, rr, dice, frost_bind, random
    conn.execute(
        "CREATE TABLE IF NOT EXISTS anime_defender (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT NOT NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            computer TEXT NOT NULL,
            name TEXT NOT NULL,
            gem INTEGER NOT NULL DEFAULT 0,
            ticket INTEGER NOT NULL DEFAULT 0,
            gold INTEGER NOT NULL DEFAULT 0,
            rr INTEGER NOT NULL DEFAULT 0,
            dice INTEGER NOT NULL DEFAULT 0,
            frost_bind INTEGER NOT NULL DEFAULT 0,
            random INTEGER NOT NULL DEFAULT 0
        )",
        [],
    )?;

    conn.execute(
        "CREATE TRIGGER IF NOT EXISTS update_anime_defender_timestamp
         AFTER UPDATE ON anime_defender
         WHEN NEW.random <> OLD.random
         BEGIN
             UPDATE anime_defender SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
         END",
        [],
    )?;

    let mut stmt = conn.prepare("SELECT id FROM users WHERE username = ?")?;

    match stmt.query_row(&["admin"], |row| row.get::<_, i64>(0)) {
        Ok(_) => {
            println!("Admin user already exists.");
        }
        Err(rusqlite::Error::QueryReturnedNoRows) => {
            let default_password = "admin";
            let password_hash = bcrypt::hash(default_password, bcrypt::DEFAULT_COST)
                .expect("Failed to hash password");
            conn.execute(
                "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
                &["admin", &password_hash, "admin"],
            )?;
            println!(
                "Admin account created with username: admin and password: {}.",
                default_password
            );
            println!("IMPORTANT: Please change the admin password immediately if you intend to make this server public.");
            println!("This message will only be displayed once.");
        }
        Err(err) => {
            eprintln!("Error checking admin account existence: {}", err);
            return Err(err.into());
        }
    }
    Ok(())
}
