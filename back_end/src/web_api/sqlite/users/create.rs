// POST | /users
use crate::internal::sqlite::open::open;
use actix_web::{post, web, HttpResponse, Responder};
use serde::Deserialize;
#[derive(Deserialize)]
struct User {
    username: String,
    password: String,
}

#[post("/users")]
pub async fn create_user(user: web::Json<User>) -> impl Responder {
    if user.username.len() < 3 {
        return HttpResponse::BadRequest().body("Username must be at least 3 characters");
    }

    if user.password.len() < 8 {
        return HttpResponse::BadRequest().body("Password must be at least 8 characters");
    }

    let hashed_password = match bcrypt::hash(&user.password, bcrypt::DEFAULT_COST) {
        Ok(hash) => hash,
        Err(_) => return HttpResponse::InternalServerError().body("Error hashing password"),
    };

    let conn = match open() {
        Ok(c) => c,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Failed to connect to the database")
        }
    };

    let result = conn.execute(
        "INSERT INTO users (username, password) VALUES (?1, ?2)",
        [&user.username, &hashed_password],
    );

    match result {
        Ok(_) => HttpResponse::Ok().body("User created successfully"),
        Err(e) => {
            if e.to_string().contains("UNIQUE constraint failed") {
                HttpResponse::Conflict().body("Username already exists")
            } else {
                HttpResponse::InternalServerError().body("Error creating user")
            }
        }
    }
}
