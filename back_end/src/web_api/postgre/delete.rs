// DELETE | /data/anime_defender/delete
// body: { key: string, username: string[] }

use crate::internal::sqlite::valid::valid;
use actix_web::{delete, web, HttpResponse, Responder};
use serde::Deserialize;
use sqlx::PgPool;

#[derive(Deserialize)]
struct Data {
    key: String,
    username: Vec<String>,
}
#[delete("/data/anime_defender/delete")]
pub async fn delete_anime_defender(
    data: web::Json<Data>,
    pool: web::Data<PgPool>,
) -> impl Responder {
    match valid(&data.key) {
        Ok(true) => {
            let result =  sqlx::query("DELETE FROM anime_defender WHERE key = $1 AND name = ANY($2::text[])")
                .bind(&data.key)
                .bind(&data.username)
                .execute(pool.get_ref())
                .await;
            match result
            {
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
