use crate::error::Error;
use axum::{extract::FromRequestParts, http::request::Parts};
use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, query, PgPool};
use tower_sessions::Session;

#[derive(sqlx::Type, Serialize, Deserialize, Debug, PartialEq, Eq)]
#[sqlx(rename_all = "lowercase")]
pub enum Role {
    Admin,
    Doctor,
    Receptionist,
}

pub struct User {
    pub phone_number: String,
    pub first_last_name: (String, String),
    pub class: Class,
}

#[derive(FromRow, Serialize)]
pub struct Speciality {
    pub id: i32,
    pub name: String,
}

pub enum Class {
    Admin,
    Receptionist,
    Doctor { speciality: String, experience: i32 },
}

#[axum::async_trait]
impl FromRequestParts<PgPool> for User {
    type Rejection = Error;

    async fn from_request_parts(parts: &mut Parts, db: &PgPool) -> Result<Self, Self::Rejection> {
        let session = Session::from_request_parts(parts, db)
            .await
            .map_err(|(status, message)| Error::Custom { status, message })?;
        let Ok(Some(id)) = session.get::<i32>("account_id").await else {
            return Err(Error::Unauthorized);
        };

        let account = query!(
            r#"SELECT phone_number, first_name, last_name, role as "role: Role" FROM Account WHERE id = $1"#,
            id
        ).fetch_one(db).await?;

        let user = match account.role {
            Role::Receptionist => User {
                phone_number: account.phone_number,
                first_last_name: (account.first_name, account.last_name),
                class: Class::Receptionist,
            },
            Role::Admin => User {
                phone_number: account.phone_number,
                first_last_name: (account.first_name, account.last_name),
                class: Class::Admin,
            },
            Role::Doctor => {
                let record = query!(
                    r#"SELECT Speciality.name as speciality, experience FROM Doctor
                    JOIN Speciality ON Speciality.id = Doctor.speciality_id
                    WHERE account_id = $1"#,
                    id
                )
                .fetch_one(db)
                .await?;

                User {
                    phone_number: account.phone_number,
                    first_last_name: (account.first_name, account.last_name),
                    class: Class::Doctor {
                        speciality: record.speciality,
                        experience: record.experience,
                    },
                }
            }
        };

        Ok(user)
    }
}
