use crate::{error::Error, AppState};
use axum::{extract::FromRequestParts, http::request::Parts};
use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, query, PgPool};
use time::OffsetDateTime;
use tower_sessions::Session;
use utoipa::ToSchema;

#[derive(sqlx::Type, Serialize, Deserialize, Debug, PartialEq, Eq)]
#[sqlx(rename_all = "lowercase")]
pub enum Role {
    Admin,
    Doctor,
    Receptionist,
}

#[derive(ToSchema, FromRow, Serialize, Deserialize)]
pub struct Speciality {
    pub id: Option<i32>,
    pub name: String,
}

#[derive(ToSchema, FromRow, Serialize, Deserialize)]
pub struct Facility {
    pub id: Option<i32>,
    pub address: String,
}

#[derive(ToSchema, FromRow, Serialize)]
pub struct User {
    pub id: i32,
    pub phone_number: String,
    pub first_name: String,
    pub last_name: String,
    pub middle_name: Option<String>,
    #[serde(flatten)]
    #[schema(inline)]
    #[sqlx(flatten)]
    pub class: Class,
}

impl User {
    pub async fn by_id(id: i32, db: &PgPool) -> Result<Self, Error> {
        let r = query!(
            r#"SELECT
                phone_number,
                first_name, last_name, middle_name,
                role as "role: Role",
                doctor.experience as "experience: Option<i32>",
                speciality.name as "speciality_name: Option<String>",
                speciality.id as "speciality_id: Option<i32>",
                room.label as "room_label: Option<String>",
                room.id as "room_id: Option<i32>"
                FROM Account
                LEFT JOIN Doctor ON Doctor.account_id = Account.id
                LEFT JOIN Room ON Room.id = Doctor.room_id
                LEFT JOIN Speciality ON Speciality.id = Doctor.speciality_id
                WHERE Account.id = $1"#,
            id
        )
        .fetch_one(db)
        .await?;

        let user = match r.role {
            Role::Receptionist => User {
                id,
                phone_number: r.phone_number,
                first_name: r.first_name,
                last_name: r.last_name,
                middle_name: r.middle_name,
                class: Class::Receptionist,
            },
            Role::Admin => User {
                id,
                phone_number: r.phone_number,
                first_name: r.first_name,
                last_name: r.last_name,
                middle_name: r.middle_name,
                class: Class::Admin,
            },
            Role::Doctor => User {
                id,
                phone_number: r.phone_number,
                first_name: r.first_name,
                last_name: r.last_name,
                middle_name: r.middle_name,
                class: Class::Doctor {
                    speciality: Speciality {
                        name: r.speciality_name.unwrap(),
                        id: r.speciality_id,
                    },
                    experience: r.experience.unwrap(),
                    room: r.room_id.zip(r.room_label).map(|(id, label)| Room {
                        label,
                        id: Some(id),
                    }),
                },
            },
        };

        Ok(user)
    }
}

#[derive(Serialize, ToSchema)]
#[serde(tag = "role", rename_all = "lowercase")]
pub enum Class {
    Admin,
    Receptionist,
    Doctor {
        speciality: Speciality,
        room: Option<Room>,
        experience: i32,
    },
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

        Self::by_id(id, &state.db).await
    }
}

#[derive(ToSchema, Serialize)]
pub struct Room {
    pub id: Option<i32>,
    pub label: String,
}

#[derive(ToSchema, Serialize)]
pub struct Patient {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub middle_name: Option<String>,
    #[serde(with = "time::serde::rfc3339")]
    pub date_of_birth: OffsetDateTime,
    pub male: bool,
    pub contract_id: i32,
    pub address: String,
    pub details: Option<String>,
    pub phone_number: String,
    #[serde(with = "time::serde::rfc3339::option")]
    pub last_appointment: Option<OffsetDateTime>,
}
