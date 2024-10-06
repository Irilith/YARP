use rusqlite::Connection;

pub fn clean(conn: &Connection) -> Result<(), rusqlite::Error> {
    conn.execute(
        "DELETE FROM anime_defender WHERE updated_at < DATETIME('now', '-3 days')",
        [],
    )?;
    Ok(())
}
