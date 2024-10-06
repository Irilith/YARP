use crate::internal::sqlite::open::open;

pub fn valid(key: &str) -> Result<bool, std::io::Error> {
    let conn = match open() {
        Ok(c) => c,
        Err(_) => {
            return Err(std::io::Error::new(
                std::io::ErrorKind::Other,
                "Failed to connect to the database",
            ));
        }
    };

    let result: Result<String, _> =
        conn.query_row("SELECT username FROM users WHERE key = ?1", [key], |row| {
            row.get(0)
        });

    match result {
        Ok(_) => Ok(true),
        Err(_) => Ok(false),
    }
}
