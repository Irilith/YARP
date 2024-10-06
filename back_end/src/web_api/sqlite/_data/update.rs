use crate::internal::sqlite::open::open;
use actix_web::{put, web, HttpResponse, Responder};
use lazy_static::lazy_static;
use rusqlite::{params, Connection};
use serde::Deserialize;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Deserialize)]
struct Data {
    key: String,
    username: String,
    computer: String,
    gem: i32,
    ticket: i32,
    gold: i32,
    rr: i32,
    dice: i32,
    frost_bind: i32,
    random: i32,
}

lazy_static! {
    static ref DB_POOL: Arc<Mutex<Connection>> = {
        let conn = open().expect("Failed to open database connection");
        Arc::new(Mutex::new(conn))
    };
}

#[put("/data/anime_defender")]
pub async fn update_anime_defender(data: web::Json<Data>) -> impl Responder {
    let conn = DB_POOL.lock().await;

    let result = conn.execute(
        "INSERT INTO anime_defender (key, name, gem, ticket, gold, rr, dice, frost_bind, random, computer)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
         ON CONFLICT(key, name) DO UPDATE SET
         name = ?2, gem = ?3, ticket = ?4, gold = ?5, rr = ?6, dice = ?7, frost_bind = ?8, random = ?9",
        params![
            data.key,
            data.username,
            data.gem,
            data.ticket,
            data.gold,
            data.rr,
            data.dice,
            data.frost_bind,
            data.random,
            data.computer
        ],
    );

    match result {
        Ok(_) => HttpResponse::Ok().body("Data updated successfully"),
        Err(e) => HttpResponse::InternalServerError().body(format!("Error updating data: {}", e)),
    }
}
