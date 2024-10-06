// PUT | /users/:name
// struct user include old_password and new_password
// if old_password is correct, update password to new_password

// If you're intend to public the server
// you should add rate limit and captcha
use crate::internal::{sqlite::open::open, utils::check_pass::check_password};
use actix_web::{put, web, HttpResponse, Responder};
use serde::Deserialize;

#[derive(Deserialize)]
struct User {
    old_password: String,
    new_password: String,
}

#[put("/users/{name}")]
pub async fn update_user(user: web::Json<User>, name: web::Path<String>) -> impl Responder {
    let hashed_new_password = match bcrypt::hash(&user.new_password, bcrypt::DEFAULT_COST) {
        Ok(hash) => hash,
        Err(_) => return HttpResponse::InternalServerError().body("Error hashing password"),
    };

    let conn = match open() {
        Ok(c) => c,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Failed to connect to the database")
        }
    };

    let username = name.into_inner();

    let result: Result<String, _> = conn.query_row(
        "SELECT password FROM users WHERE username = ?1",
        [&username],
        |row| row.get(0),
    );

    match result {
        Ok(stored_password) => match check_password(&user.old_password, &stored_password) {
            Ok(true) => {
                let update_result = conn.execute(
                    "UPDATE users SET password = ?1 WHERE username = ?2",
                    [&hashed_new_password, &username],
                );

                match update_result {
                    Ok(_) => HttpResponse::Ok().body("User updated successfully"),
                    Err(_) => HttpResponse::InternalServerError().body("Error updating user"),
                }
            }
            Ok(false) => HttpResponse::Unauthorized().body("Incorrect password"),
            Err(_) => HttpResponse::InternalServerError().body("Error checking old password"),
        },
        Err(_) => HttpResponse::NotFound().body("User not found"),
    }
}
