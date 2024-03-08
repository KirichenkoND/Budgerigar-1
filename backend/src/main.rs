use axum::{extract::FromRef, routing::*};
use sqlx::{migrate, PgPool};
use std::env::var;
use time::Duration;
use tokio::net::TcpListener;
use tower_sessions::{Expiry, SessionManagerLayer};
use tower_sessions_sqlx_store::PostgresStore;
use tracing::{info, Level};
use tracing_subscriber::{fmt, prelude::*, registry, EnvFilter};
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
    pub mod appointment;
    pub mod doctor;
    pub mod facility;
    pub mod patient;
    pub mod speciality;
}

#[derive(Clone, FromRef)]
struct AppState {
    db: PgPool,
}

#[tokio::main]
async fn main() -> Result<(), error::Error> {
    _ = dotenvy::dotenv();

    registry()
        .with(
            fmt::layer().with_filter(
                EnvFilter::builder()
                    .with_default_directive(Level::INFO.into())
                    .from_env_lossy(),
            ),
        )
        .init();

    info!("Connecting to db");
    let db = PgPool::connect(&var("DATABASE_URL").expect("env `DATABASE_URL` is required")).await?;

    migrate!("./migrations").run(&db).await.unwrap();

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
            routes::account::create,
            routes::facility::get,
            routes::facility::create,
            routes::facility::rooms,
            routes::facility::delete,
            routes::speciality::get,
            routes::speciality::create,
            routes::speciality::delete,
            routes::doctor::get,
            routes::doctor::create,
            routes::doctor::get_by_id,
            routes::doctor::patients,
            routes::doctor::stats,
            routes::doctor::schedule,
            routes::doctor::appointment,
            routes::patient::get,
            routes::patient::get_by_id,
            routes::patient::create,
            routes::appointment::get,
            routes::appointment::update,
        ),
        components(schemas(
            models::Facility,
            models::User,
            models::Speciality,
            models::Room,
            models::Patient,
            models::Appointment,
            routes::account::Credentials,
            routes::doctor::Statistics,
            routes::doctor::CreateDoctor,
            routes::patient::CreatePatient,
            routes::account::CreateAccount,
        ))
    )]
    struct ApiDoc;

    let swagger = SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi());

    let app = Router::new()
        .route("/account/login", post(routes::account::login))
        .route("/account/logout", post(routes::account::logout))
        .route("/account/me", get(routes::account::me))
        .route(
            "/account",
            post(routes::account::create).get(routes::account::fetch),
        )
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
        .route(
            "/doctor",
            get(routes::doctor::get).post(routes::doctor::create),
        )
        .route("/doctor/:id/patients", get(routes::doctor::patients))
        .route("/doctor/:id/stats", get(routes::doctor::stats))
        .route("/doctor/:id/schedule", get(routes::doctor::schedule))
        .route("/doctor/:id", get(routes::doctor::get_by_id))
        .route(
            "/doctor/:id/appointment/:patient_id",
            post(routes::doctor::appointment),
        )
        .route(
            "/patient",
            get(routes::patient::get).post(routes::patient::create),
        )
        .route("/patient/:id", get(routes::patient::get_by_id))
        .route("/appointment", get(routes::appointment::get))
        .route("/appointment/:id", patch(routes::appointment::update))
        .merge(swagger)
        .with_state(state)
        .layer(session_layer)
        .layer(tower_http::cors::CorsLayer::very_permissive());

    let listener = TcpListener::bind("0.0.0.0:9000").await?;
    info!("Listening at {}", listener.local_addr()?);

    axum::serve(listener, app).await?;

    Ok(())
}
