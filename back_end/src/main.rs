use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use back_end::internal::postgre::clean::clean;
use back_end::internal::sqlite::{init::init, open::open};
use back_end::web_api::postgre;
use back_end::web_api::sqlite::users::{
    create::create_user, key::get_username_by_key, login::login_user, update::update_user,
};
use sqlx::postgres::PgPoolOptions;
use std::env;
use tokio::time::{sleep, Duration};
// https://youtu.be/DZTXaq23534?si=OPc8VGdRP_Mk9-tt
// https://youtu.be/coQ8LLNg47A?si=WWjxn1Y8zQubyIQh
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let max_pool_size: u32 = env::var("MAX_POOL_SIZE")
        .expect("MAX_POOL_SIZE must be set")
        .parse()
        .expect("MAX_POOL_SIZE must be a valid number");
    let port: u16 = env::var("PORT")
        .expect("PORT must be set")
        .parse()
        .expect("PORT must be a valid number");
    let pool = PgPoolOptions::new()
        .max_connections(max_pool_size)
        .connect(&database_url)
        .await
        .expect("Failed to create pool");

    let clean_pool = pool.clone();
    // Clean up the database every hour
    tokio::spawn(async move {
        loop {
            let _ = clean(&clean_pool).await;
            sleep(Duration::from_secs(3600)).await;
        }
    });
    let conn = open().expect("Failed to open SQLite connection");
    init(&conn).expect("Failed to initialize SQLite");
    let pool = web::Data::new(pool);
    HttpServer::new(move || {
        App::new()
            .app_data(pool.clone())
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
                    .max_age(3600),
            )
            .service(create_user)
            .service(get_username_by_key)
            .service(login_user)
            .service(update_user)
            .service(postgre::delete::delete_anime_defender)
            .service(postgre::get::get_anime_defender)
            .service(postgre::update::update_anime_defender)
    })
    .workers(num_cpus::get()) // Maxium number of thread
    .bind(("127.0.0.1", port))?
    .run()
    .await
}
