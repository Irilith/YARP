// Get | /users?username=name&password=password

use crate::internal::sqlite::open::open;
use actix_web::{get, web, HttpResponse, Responder};
use serde::Deserialize;

#[derive(Deserialize)]
struct User {
    username: String,
    password: String,
}

#[get("/users")]
pub async fn login_user(user: web::Query<User>) -> impl Responder {
    let conn = match open() {
        Ok(c) => c,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Failed to connect to the database")
        }
    };

    let username = user.username.clone();
    let password = user.password.clone();

    let result: Result<(String, String), _> = conn.query_row(
        "SELECT password, key FROM users WHERE username = ?1",
        [&username],
        |row| Ok((row.get(0)?, row.get(1)?)),
    );

    match result {
        Ok((stored_password, user_key)) => match bcrypt::verify(&password, &stored_password) {
            // Return only the key and client will use it as auth key
            Ok(true) => HttpResponse::Ok().body(format!("{}", user_key)),
            Ok(false) => {
                println!("Incorrect password");
                HttpResponse::Unauthorized().body("Incorrect password")
            }
            Err(err) => {
                eprintln!("Error verifying password: {}", err);
                HttpResponse::InternalServerError().body("Error verifying password")
            }
        },
        Err(rusqlite::Error::QueryReturnedNoRows) => {
            println!("User not found");
            HttpResponse::NotFound().body("User not found")
        }
        Err(err) => {
            eprintln!("Database error: {}", err);
            HttpResponse::InternalServerError().body("Database error")
        }
    }
}
