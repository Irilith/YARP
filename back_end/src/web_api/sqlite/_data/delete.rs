use crate::internal::sqlite::{open::open, valid::valid};
use actix_web::{delete, web, HttpResponse, Responder};
use serde::Deserialize;

#[derive(Deserialize)]
struct Data {
    key: String,
    username: Vec<String>,
}

#[delete("/data/anime_defender/delete")]
pub async fn delete_anime_defender(data: web::Json<Data>) -> impl Responder {
    match valid(&data.key) {
        Ok(true) => {
            let conn = match open() {
                Ok(c) => c,
                Err(_) => {
                    return HttpResponse::InternalServerError()
                        .body("Failed to connect to the database");
                }
            };

            let usernames = data
                .username
                .iter()
                .map(|_| "?")
                .collect::<Vec<_>>()
                .join(",");

            let query = format!(
                "DELETE FROM anime_defender WHERE key = ?1 AND name IN ({})",
                usernames
            );

            let mut stmt = match conn.prepare(&query) {
                Ok(s) => s,
                Err(e) => {
                    eprintln!("Error preparing statement: {:?}", e);
                    return HttpResponse::InternalServerError().body("Error preparing query");
                }
            };

            let key = data.key.as_str();
            let mut params: Vec<&dyn rusqlite::ToSql> = vec![&key];
            params.extend(
                data.username
                    .iter()
                    .map(|name| name as &dyn rusqlite::ToSql),
            );

            match stmt.execute(rusqlite::params_from_iter(params)) {
                Ok(_) => HttpResponse::Ok().body("Data deleted successfully"),
                Err(e) => {
                    eprintln!("Error deleting data: {:?}", e);
                    HttpResponse::InternalServerError().body("Error deleting data")
                }
            }
        }
        Ok(false) => HttpResponse::Unauthorized().body("Invalid key"),
        Err(_) => HttpResponse::InternalServerError().body("Error checking key validity"),
    }
}
