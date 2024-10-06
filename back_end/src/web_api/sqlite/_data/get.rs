use crate::internal::sqlite::open::open;
use actix_web::{get, web, HttpResponse, Responder};
use rusqlite::Row;

#[derive(serde::Serialize)]
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
pub async fn get_anime_defender(key: web::Path<String>) -> impl Responder {
    let conn = match open() {
        Ok(c) => c,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Failed to connect to the database");
        }
    };

    let result: Result<Vec<Data>, _> = conn
        .prepare("SELECT name, computer, gem, ticket, gold, rr, dice, frost_bind, random, updated_at FROM anime_defender WHERE key = ?1")
    .map_err(|_| HttpResponse::InternalServerError().body("Error, mostlikely you dont have data in the database"))
        .and_then(|mut stmt| {
            stmt.query_map([key.as_str()], |row: &Row| {
                Ok(Data {
                    name: row.get(0)?,
                    computer: row.get(1)?,
                    gem: row.get(2)?,
                    ticket: row.get(3)?,
                    gold: row.get(4)?,
                    rr: row.get(5)?,
                    dice: row.get(6)?,
                    frost_bind: row.get(7)?,
                    random: row.get(8)?,
                    updated_at: row.get(9)?,
                })
            })
            .map_err(|_| HttpResponse::InternalServerError().body("Error executing query"))
            .and_then(|rows| {
                let collected_rows: Vec<Data> = rows.collect::<Result<Vec<Data>, _>>().map_err(|_| {
                    HttpResponse::InternalServerError().body("Error collecting results")
                })?;
                if collected_rows.len() == 0 {
                    return Err(HttpResponse::NotFound().body("No account found in the database"));
                }

                Ok(collected_rows)
            })
        });

    match result {
        Ok(data) => HttpResponse::Ok().json(data),
        Err(err) => err,
    }
}
