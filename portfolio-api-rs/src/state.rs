//! State aplikasi: pool database (opsional agar test tanpa DB tetap jalan).

use sqlx::MySqlPool;

/// State shared di seluruh handler. Pool `None` = mode tanpa DB (placeholder).
#[derive(Clone)]
pub struct AppState {
    pub pool: Option<MySqlPool>,
}

impl AppState {
    pub fn with_pool(pool: MySqlPool) -> Self {
        Self { pool: Some(pool) }
    }

    /// Untuk test: handler mengembalikan data placeholder.
    pub fn without_db() -> Self {
        Self { pool: None }
    }
}
