use super::{assert_role, RouteResult, RouteState};
use crate::{
    error::Error,
    models::{Class, Role, User},
};
use argon2::{password_hash::SaltString, Argon2, PasswordHasher, PasswordVerifier};
use axum::{
    extract::{Query, State},
    http::StatusCode,
    Json,
};
use itertools::Itertools;
use rand::rngs::OsRng;
use serde::Deserialize;
use sqlx::query;
use tower_sessions::Session;
use tracing::info;
use utoipa::{IntoParams, ToSchema};

#[derive(IntoParams, Deserialize)]
pub struct FetchAccount {
    name: Option<String>,
    role: Option<String>,
    count: Option<i64>,
    offset: Option<i64>,
}

pub async fn fetch(
    session: Session,
    Query(query): Query<FetchAccount>,
    State(state): RouteState,
) -> RouteResult<Json<Vec<User>>> {
    assert_role(&session, &[Role::Admin]).await?;

    let role = query.role.map(|r| r.to_lowercase());
    if !matches!(role.as_deref(), Some("admin") | Some("receptionist") | None) {
        return Err(Error::custom(StatusCode::BAD_REQUEST, "role is invalid"));
    }

    let results = query!(
        r#"SELECT id, first_name, last_name, middle_name,
        role as "role: Role", phone_number
        FROM Account
        WHERE ((role = ($1::text)::role OR $1 IS NULL) AND role != 'doctor' AND role != 'patient') 
        AND ((first_name || last_name || middle_name) LIKE ('%' || $2 || '%') OR $2 IS NULL)
        LIMIT $3 OFFSET $4"#,
        role,
        query.name,
        query.count.unwrap_or(10).max(0),
        query.offset.unwrap_or(0)
    )
    .fetch_all(&state.db)
    .await?;

    let users = results
        .into_iter()
        .map(|r| User {
            id: r.id,
            phone_number: r.phone_number,
            first_name: r.first_name,
            last_name: r.last_name,
            middle_name: r.middle_name,
            class: match r.role {
                Role::Admin => Class::Admin,
                Role::Receptionist => Class::Receptionist,
                _ => unreachable!(),
            },
        })
        .collect_vec();

    Ok(Json(users))
}

#[derive(ToSchema, Deserialize)]
pub struct CreateAccount {
    first_name: String,
    last_name: String,
    middle_name: Option<String>,
    phone_number: String,
    password: String,
    role: String,
}

/// Create new account
#[utoipa::path(
    post,
    path = "/account",
    request_body = CreateAccount,
    responses(
        (status = 200, description = "Logged in successfully"),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is not admin")
    )
)]
pub async fn create(
    session: Session,
    State(state): RouteState,
    Json(data): Json<CreateAccount>,
) -> RouteResult {
    assert_role(&session, &[Role::Admin]).await?;

    let role = data.role.to_lowercase();
    if role != "admin" && role != "receptionist" {
        return Err(Error::custom(StatusCode::BAD_REQUEST, "role is invalid"));
    }

    let password_hash = Argon2::default()
        .hash_password(data.password.as_bytes(), &SaltString::generate(OsRng))
        .unwrap()
        .to_string();

    query!(
        "INSERT INTO Account(
            role, first_name, last_name, middle_name, phone_number, password_hash
        ) VALUES(($1::text)::role, $2, $3, $4, $5, $6)",
        role,
        data.first_name,
        data.last_name,
        data.middle_name,
        data.phone_number,
        password_hash
    )
    .execute(&state.db)
    .await?;

    Ok(())
}

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
