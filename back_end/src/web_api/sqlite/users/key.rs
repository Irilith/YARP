// GET | /users/{key}

use crate::internal::sqlite::open::open;
use actix_web::{get, web, HttpResponse, Responder};

#[get("/users/valid/{key}")]
pub async fn get_username_by_key(key: web::Path<String>) -> impl Responder {
    let conn = match open() {
        Ok(c) => c,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Failed to connect to the database")
        }
    };

    let result: Result<String, _> = conn.query_row(
        "SELECT username FROM users WHERE key = ?1",
        [key.as_str()],
        |row| row.get(0),
    );

    match result {
        Ok(username) => HttpResponse::Ok().body(username),
        Err(_) => HttpResponse::NotFound().body("User not found"),
    }
}
