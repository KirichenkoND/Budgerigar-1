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
    use crate::{models::Role, AppState};
    use axum::extract::State;

    type RouteResult<T = ()> = Result<T, super::error::Error>;
    type RouteState = State<AppState>;

    async fn assert_role(session: &tower_sessions::Session, required: Role) -> RouteResult {
        let role = session
            .get::<super::models::Role>("role")
            .await?
            .ok_or(super::error::Error::Unauthorized)?;
        if role != required {
            return Err(crate::error::Error::Forbidden);
        }

        Ok(())
    }

    pub mod account;
    pub mod facility;
    pub mod speciality;
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
        .route("/account/login", post(routes::account::login))
        .route("/account/logout", post(routes::account::logout))
        .route("/account/me", get(routes::account::me))
        .route(
            "/speciality",
            get(routes::speciality::get).post(routes::speciality::create),
        )
        .route("/speciality/:id", delete(routes::speciality::delete))
        .with_state(state)
        .layer(session_layer);

    let listener = TcpListener::bind("localhost:9000").await?;
    axum::serve(listener, app).await?;

    Ok(())
}
