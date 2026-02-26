//! Personal Portfolio API (Axum/Rust)
//!
//! Mengikuti standar dokumentasi: OpenAPI 3, Swagger UI, format respons
//! `{ data, message, errors }` selaras dengan portfolio-api (Lumen).
//! Database: MySQL/MariaDB (DB_* / DATABASE_URL) seperti portfolio-api.

use std::net::SocketAddr;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use portfolio_api_rs::{app, create_db_pool, AppState};

#[tokio::main]
async fn main() {
    let _ = dotenvy::dotenv();

    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info,portfolio_api_rs=debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let state = match create_db_pool().await {
        Ok(pool) => {
            tracing::info!("database connected");
            AppState::with_pool(pool)
        }
        Err(e) => {
            tracing::warn!("database not available ({}), running without DB", e);
            AppState::without_db()
        }
    };

    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8000);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("listening on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.expect("bind");
    axum::serve(listener, app(state)).await.expect("serve");
}
