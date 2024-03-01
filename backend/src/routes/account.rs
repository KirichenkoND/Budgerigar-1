use super::{RouteResult, RouteState};
use crate::{error::Error, models::Role};
use argon2::{Argon2, PasswordVerifier};
use axum::{extract::State, Json};
use serde::Deserialize;
use sqlx::query;
use tower_sessions::Session;

#[derive(Deserialize)]
pub struct Credentials {
    phone: String,
    password: String,
}

pub async fn login(
    session: Session,
    State(state): RouteState,
    Json(creds): Json<Credentials>,
) -> RouteResult {
    let record = query!(
        r#"SELECT id, password_hash, role as "role: Role" FROM Account WHERE phone_number = $1"#,
        creds.phone
    )
    .fetch_optional(&state.db)
    .await?
    .ok_or_else(|| Error::NotFound("User"))?;

    let argon = Argon2::default();
    argon
        .verify_password(
            creds.password.as_bytes(),
            &record.password_hash.as_str().try_into().unwrap(),
        )
        .map_err(|_| Error::InvalidCredentials)?;
    session.insert("account_id", record.id).await?;

    Ok(())
}
