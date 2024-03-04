use axum::{extract::FromRef, routing::*};
use sqlx::PgPool;
use std::env::var;
use time::Duration;
use tokio::net::TcpListener;
use tower_sessions::{Expiry, SessionManagerLayer};
use tower_sessions_sqlx_store::PostgresStore;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

mod error;
mod models;

mod routes {
    use crate::{models::Role, AppState};
    use axum::extract::State;

    type RouteResult<T = ()> = Result<T, super::error::Error>;
    type RouteState = State<AppState>;

    async fn assert_role(session: &tower_sessions::Session, required: &[Role]) -> RouteResult {
        for wanted in required.iter() {
            let role = session
                .get::<super::models::Role>("role")
                .await?
                .ok_or(super::error::Error::Unauthorized)?;
            if role == *wanted {
                return Ok(());
            }
        }

        Err(crate::error::Error::Forbidden)
    }

    pub mod account;
    pub mod doctor;
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

    #[derive(OpenApi)]
    #[openapi(
        paths(
            routes::account::login,
            routes::account::logout,
            routes::account::me,
            routes::facility::get,
            routes::facility::create,
            routes::facility::rooms,
            routes::facility::delete,
            routes::speciality::get,
            routes::speciality::create,
            routes::speciality::delete,
            routes::doctor::get,
            routes::doctor::patients,
            routes::doctor::stats,
            routes::doctor::schedule,
            routes::doctor::appointment,
        ),
        components(schemas(
            models::Facility,
            models::User,
            models::Speciality,
            models::Room,
            models::Patient,
            routes::doctor::Statistics
        ))
    )]
    struct ApiDoc;

    let swagger = SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi());

    let app = Router::new()
        .route("/account/login", post(routes::account::login))
        .route("/account/logout", post(routes::account::logout))
        .route("/account/me", get(routes::account::me))
        .route(
            "/speciality",
            get(routes::speciality::get).post(routes::speciality::create),
        )
        .route("/speciality/:id", delete(routes::speciality::delete))
        .route(
            "/facility",
            get(routes::facility::get).post(routes::facility::create),
        )
        .route("/facility/:id/rooms", get(routes::facility::rooms))
        .route("/facility/:id", delete(routes::facility::delete))
        .route("/doctor", get(routes::doctor::get))
        .route("/doctor/:id/patients", get(routes::doctor::patients))
        .route("/doctor/:id/stats", get(routes::doctor::stats))
        .route("/doctor/:id/schedule", get(routes::doctor::schedule))
        .route(
            "/doctor/:id/appointment/:patient_id",
            post(routes::doctor::appointment),
        )
        .merge(swagger)
        .with_state(state)
        .layer(session_layer);

    let listener = TcpListener::bind("localhost:9000").await?;
    axum::serve(listener, app).await?;

    Ok(())
}
