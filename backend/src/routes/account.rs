use super::{RouteResult, RouteState};
use crate::{error::Error, models::Role};
use argon2::{Argon2, PasswordVerifier};
use axum::{extract::State, response::IntoResponse, Json};
use serde::Deserialize;
use serde_json::json;
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

pub async fn logout(session: Session) {
    _ = session.delete().await;
}

pub async fn me(session: Session, State(state): RouteState) -> RouteResult<impl IntoResponse> {
    let (id, role) = (
        session
            .get::<i32>("account_id")
            .await?
            .ok_or(Error::Unauthorized)?,
        session
            .get::<Role>("role")
            .await?
            .ok_or(Error::Unauthorized)?,
    );

    match role {
        Role::Receptionist | Role::Admin => {
            let Some(record) = query!(
                r#"SELECT role as "role: String", last_name, first_name, middle_name, phone_number FROM Account WHERE id = $1"#,
                id
            )
            .fetch_optional(&state.db)
            .await? else {
                session.delete().await?;
                return Err(Error::Unauthorized);
            };

            Ok(Json(json! {{
                "first_name": record.first_name,
                "last_name": record.last_name,
                "middle_name": record.middle_name,
                "phone_number": record.phone_number,
                "role": record.role
            }}))
        }
        Role::Doctor => {
            let Some(record) = query!(
                r#"SELECT
                    role as "role: String",
                    last_name, first_name, middle_name,
                    phone_number,
                    experience, speciality.name as speciality
                    FROM Account
                    JOIN Doctor ON Doctor.account_id = Account.id
                    JOIN Speciality ON Speciality.id = Doctor.speciality_id
                    WHERE Account.id = $1"#,
                id
            )
            .fetch_optional(&state.db)
            .await?
            else {
                session.delete().await?;
                return Err(Error::Unauthorized);
            };

            Ok(Json(json! {{
                "first_name": record.first_name,
                "last_name": record.last_name,
                "middle_name": record.middle_name,
                "phone_number": record.phone_number,
                "experience": record.experience,
                "speciality": record.speciality,
                "role": record.role
            }}))
        }
    }
}
