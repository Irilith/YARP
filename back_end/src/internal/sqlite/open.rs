use rusqlite::{Connection, Result, OpenFlags};

pub fn open() -> Result<Connection> {
    let conn = Connection::open_with_flags("db/db.sqlite", OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE | OpenFlags::SQLITE_OPEN_FULL_MUTEX)?;
    Ok(conn)
}
