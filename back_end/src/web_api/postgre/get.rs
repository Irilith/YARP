use actix_web::{get, web, HttpResponse, Responder};
use serde::Serialize;
use sqlx::PgPool;

#[derive(Serialize)]
struct Data {
    name: String,
    computer: String,
    gem: i32,
    ticket: i32,
    gold: i32,
    rr: i32,
    dice: i32,
    frost_bind: i32,
    random: i32,
    updated_at: String,
}

#[get("/data/anime_defender/{key}")]
pub async fn get_anime_defender(key: web::Path<String>, pool: web::Data<PgPool>) -> impl Responder {
    let result = sqlx::query!(
        "SELECT name, computer, gem, ticket, gold, rr, dice, frost_bind, random, updated_at FROM anime_defender WHERE key = $1",
        key.as_str()
    )
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(rows) => {
            let data: Vec<Data> = rows
                .into_iter()
                .map(|row| Data {
                    name: row.name,
                    computer: row.computer,
                    gem: row.gem,
                    ticket: row.ticket,
                    gold: row.gold,
                    rr: row.rr,
                    dice: row.dice,
                    frost_bind: row.frost_bind,
                    random: row.random,
                    updated_at: row.updated_at.to_string(),
                })
                .collect();

            if data.is_empty() {
                HttpResponse::NotFound().body("No account found in the database")
            } else {
                HttpResponse::Ok().json(data)
            }
        }
        Err(_) => HttpResponse::InternalServerError()
            .body("Error, most likely you don't have data in the database"),
    }
}
