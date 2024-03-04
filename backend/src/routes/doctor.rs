use super::{assert_role, RouteResult, RouteState};
use crate::models::{Role, Speciality, User};
use axum::{
    extract::{Query, State},
    Json,
};
use itertools::Itertools;
use serde::Deserialize;
use sqlx::query;
use tower_sessions::Session;
use utoipa::IntoParams;

#[derive(IntoParams, Deserialize)]
pub struct Get {
    // Name filter
    name: Option<String>,
    // Speciality id filter
    speciality: Option<i32>,
}

/// Get doctors
#[utoipa::path(
    get,
    path = "/doctor",
    params(Get),
    responses(
        (status = 200, description = "Successfully returned current user", body = [User]),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is forbidden from accessing facility information")
    )
)]
pub async fn get(
    session: Session,
    State(state): RouteState,
    Query(query): Query<Get>,
) -> RouteResult<Json<Vec<User>>> {
    assert_role(&session, &[Role::Admin, Role::Receptionist]).await?;

    let records = query!(
        r#"SELECT Doctor.id,
        first_name, last_name, middle_name, phone_number,
        experience, speciality.name as speciality_name, speciality.id as speciality_id
        FROM Doctor
        JOIN Account ON Account.id = Doctor.account_id
        JOIN Speciality ON Speciality.id = Doctor.speciality_id
        WHERE role = 'doctor' AND
        (LOWER(first_name || last_name || middle_name) LIKE ('%' || $1 || '%') OR $1 IS NULL) AND
        (speciality_id = $2 OR $2 IS NULL)"#,
        query.name,
        query.speciality
    )
    .fetch_all(&state.db)
    .await?;

    let records = records
        .into_iter()
        .map(|r| User {
            id: r.id,
            phone_number: r.phone_number,
            first_name: r.first_name,
            last_name: r.last_name,
            middle_name: r.middle_name,
            class: crate::models::Class::Doctor {
                speciality: Speciality {
                    id: Some(r.speciality_id),
                    name: r.speciality_name,
                },
                experience: r.experience,
            },
        })
        .collect_vec();

    Ok(Json(records))
}
