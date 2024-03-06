use super::{RouteResult, RouteState};
use crate::{
    error::Error,
    models::{Role, User},
};
use argon2::{Argon2, PasswordVerifier};
use axum::{extract::State, Json};
use serde::Deserialize;
use sqlx::query;
use tower_sessions::Session;
use tracing::info;
use utoipa::ToSchema;

#[derive(ToSchema, Debug, Deserialize)]
pub struct Credentials {
    phone: String,
    password: String,
}

/// Log in into an account
#[utoipa::path(
    post,
    path = "/account/login",
    request_body = Credentials,
    responses(
        (status = 200, description = "Logged in successfully"),
        (status = 405, description = "Credentials are invalid"),
    )
)]
pub async fn login(
    session: Session,
    State(state): RouteState,
    Json(data): Json<Credentials>,
) -> RouteResult {
    info!("Attempted login {}", data.phone);

    let record = query!(
        r#"SELECT id, password_hash, role as "role: Role" FROM Account WHERE phone_number = $1 AND role != 'patient'"#,
        data.phone
    )
    .fetch_optional(&state.db)
    .await?
    .ok_or_else(|| Error::NotFound("User"))?;

    let argon = Argon2::default();
    argon
        .verify_password(
            data.password.as_bytes(),
            &record.password_hash.unwrap().as_str().try_into().unwrap(),
        )
        .map_err(|_| Error::InvalidCredentials)?;
    session.insert("account_id", record.id).await?;
    session.insert("role", record.role).await?;

    Ok(())
}

/// Logout of the account and quit session
#[utoipa::path(
    post,
    path = "/account/logout",
    responses(
        (status = 200, description = "Logged out successfully")
    )
)]
pub async fn logout(session: Session) {
    _ = session.delete().await;
}

/// Return current account information
#[utoipa::path(
    get,
    path = "/account/me",
    responses(
        (status = 200, description = "Successfully returned current user", body = User),
        (status = 401, description = "Request is not authorized"),
    )
)]
pub async fn me(user: User) -> RouteResult<Json<User>> {
    Ok(Json(user))
}
