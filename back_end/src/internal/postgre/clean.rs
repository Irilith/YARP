use sqlx::{postgres::PgPool, Result};

pub async fn clean(pool: &PgPool) -> Result<()> {
    sqlx::query!(
        "DELETE FROM anime_defender WHERE updated_at < CURRENT_TIMESTAMP - INTERVAL '3 days'",
    )
    .execute(pool)
    .await?;
    Ok(())
}
