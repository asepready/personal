//! Koneksi database MySQL — selaras dengan portfolio-api (Lumen): DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD.

use sqlx::mysql::MySqlPoolOptions;
use sqlx::MySqlPool;
use std::time::Duration;

/// Membuat pool MySQL dari variabel environment (sama seperti Lumen).
///
/// - `DATABASE_URL` (opsional): override penuh, mis. `mysql://user:pass@host:3306/db`
/// - Atau gunakan: `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
pub async fn create_pool() -> Result<MySqlPool, sqlx::Error> {
    let url = database_url()?;
    let pool = MySqlPoolOptions::new()
        .max_connections(10)
        .acquire_timeout(Duration::from_secs(5))
        .connect(&url)
        .await?;
    Ok(pool)
}

fn database_url() -> Result<String, sqlx::Error> {
    if let Ok(url) = std::env::var("DATABASE_URL") {
        return Ok(url);
    }
    let host = std::env::var("DB_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port = std::env::var("DB_PORT").unwrap_or_else(|_| "3306".to_string());
    let database = std::env::var("DB_DATABASE").unwrap_or_else(|_| "personal_portfolio".to_string());
    let username = std::env::var("DB_USERNAME").unwrap_or_else(|_| "root".to_string());
    let password = std::env::var("DB_PASSWORD").unwrap_or_else(|_| "".to_string());
    let url = format!(
        "mysql://{}:{}@{}:{}/{}",
        urlencoding::encode(&username),
        urlencoding::encode(&password),
        host,
        port,
        database
    );
    tracing::debug!("database url built (host={})", host);
    Ok(url)
}
