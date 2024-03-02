use crate::{error::Error, AppState};
use axum::{extract::FromRequestParts, http::request::Parts};
use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, query};
use tower_sessions::Session;

#[derive(sqlx::Type, Serialize, Deserialize, Debug, PartialEq, Eq)]
#[sqlx(rename_all = "lowercase")]
pub enum Role {
    Admin,
    Doctor,
    Receptionist,
}

#[derive(FromRow, Serialize)]
pub struct Speciality {
    pub id: i32,
    pub name: String,
}

#[derive(Serialize)]
pub struct User {
    pub phone_number: String,
    pub first_name: String,
    pub last_name: String,
    pub middle_name: Option<String>,
    #[serde(flatten)]
    pub class: Class,
}

#[derive(Serialize)]
#[serde(tag = "role", rename_all = "lowercase")]
pub enum Class {
    Admin,
    Receptionist,
    Doctor { speciality: String, experience: i32 },
}

#[axum::async_trait]
impl FromRequestParts<AppState> for User {
    type Rejection = Error;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let session = Session::from_request_parts(parts, state)
            .await
            .map_err(|(status, message)| Error::Custom { status, message })?;
        let Ok(Some(id)) = session.get::<i32>("account_id").await else {
            return Err(Error::Unauthorized);
        };

        let record = query!(
            r#"SELECT
                phone_number,
                first_name, last_name, middle_name,
                role as "role: Role",
                doctor.experience as "experience: Option<i32>",
                speciality.name as "speciality: Option<String>"
                FROM Account
                LEFT JOIN Doctor ON Doctor.account_id = Account.id
                LEFT JOIN Speciality ON Speciality.id = Doctor.speciality_id
                WHERE Account.id = $1"#,
            id
        )
        .fetch_one(&state.db)
        .await?;

        let user = match record.role {
            Role::Receptionist => User {
                phone_number: record.phone_number,
                first_name: record.first_name,
                last_name: record.last_name,
                middle_name: record.middle_name,
                class: Class::Receptionist,
            },
            Role::Admin => User {
                phone_number: record.phone_number,
                first_name: record.first_name,
                last_name: record.last_name,
                middle_name: record.middle_name,
                class: Class::Admin,
            },
            Role::Doctor => User {
                phone_number: record.phone_number,
                first_name: record.first_name,
                last_name: record.last_name,
                middle_name: record.middle_name,
                class: Class::Doctor {
                    speciality: record.speciality.unwrap(),
                    experience: record.experience.unwrap(),
                },
            },
        };

        Ok(user)
    }
}
