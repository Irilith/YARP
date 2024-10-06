use actix_web::{put, web, HttpResponse, Responder};
use serde::Deserialize;
use sqlx::PgPool;

#[derive(Deserialize)]
struct InputData {
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

#[put("/data/anime_defender")]
pub async fn update_anime_defender(
    data: web::Json<InputData>,
    pool: web::Data<PgPool>,
) -> impl Responder {
    let result = sqlx::query!(
        "INSERT INTO anime_defender (key, name, gem, ticket, gold, rr, dice, frost_bind, random, computer)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT(name) DO UPDATE SET
         name = $2, gem = $3, ticket = $4, gold = $5, rr = $6, dice = $7, frost_bind = $8, random = $9, computer = $10",
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
    )
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(_) => HttpResponse::Ok().body("Data updated successfully"),
        Err(e) => HttpResponse::InternalServerError().body(format!("Error updating data: {}", e)),
    }
}
