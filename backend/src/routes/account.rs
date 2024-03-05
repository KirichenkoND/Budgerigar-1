use super::{RouteResult, RouteState};
use crate::{
    error::Error,
    models::{Role, User},
};
use argon2::{Argon2, PasswordVerifier};
use axum::{
    extract::{Query, State},
    Json,
};
use serde::Deserialize;
use sqlx::query;
use tower_sessions::Session;
use utoipa::IntoParams;

#[derive(IntoParams, Debug, Deserialize)]
pub struct Credentials {
    phone: String,
    password: String,
}

/// Log in into an account
#[utoipa::path(
    post,
    path = "/account/login",
    params(Credentials),
    responses(
        (status = 200, description = "Logged in successfully"),
        (status = 405, description = "Credentials are invalid"),
    )
)]
pub async fn login(
    session: Session,
    State(state): RouteState,
    Query(mut creds): Query<Credentials>,
) -> RouteResult {
    // what
    if creds.phone.starts_with(' ') {
        unsafe { creds.phone.as_bytes_mut()[0] = b'+' };
    }

    let record = query!(
        r#"SELECT id, password_hash, role as "role: Role" FROM Account WHERE phone_number = $1 AND role != 'patient'"#,
        creds.phone
    )
    .fetch_optional(&state.db)
    .await?
    .ok_or_else(|| Error::NotFound("User"))?;

    let argon = Argon2::default();
    argon
        .verify_password(
            creds.password.as_bytes(),
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
