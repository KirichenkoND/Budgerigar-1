use axum::{extract::FromRef, routing::*};
use sqlx::PgPool;
use std::env::var;
use time::Duration;
use tokio::net::TcpListener;
use tower_sessions::{Expiry, SessionManagerLayer};
use tower_sessions_sqlx_store::PostgresStore;

mod error;
mod models;

mod routes {
    use crate::AppState;
    use axum::extract::State;

    type RouteResult<T = ()> = Result<T, super::error::Error>;
    type RouteState = State<AppState>;

    pub mod account;
}

#[derive(Clone, FromRef)]
struct AppState {
    db: PgPool,
}

#[tokio::main]
async fn main() -> Result<(), error::Error> {
    _ = dotenvy::dotenv();

    let db = PgPool::connect(&var("DATABASE_URL").expect("env `DATABASE_URL` is required")).await?;
    let state = AppState { db: db.clone() };

    let session_store = PostgresStore::new(db.clone());
    session_store.migrate().await?;

    let session_layer = SessionManagerLayer::new(session_store)
        .with_expiry(Expiry::OnInactivity(Duration::weeks(2)));

    let app = Router::new()
        .route("/account/login", get(routes::account::login))
        .route("/account/logout", post(routes::account::logout))
        .with_state(state)
        .layer(session_layer);

    let listener = TcpListener::bind("localhost:9999").await?;
    axum::serve(listener, app).await?;

    Ok(())
}
