use super::{assert_role, RouteResult, RouteState};
use crate::models::{Patient, Role, Room, Speciality, User};
use axum::{
    extract::{Path, Query, State},
    Json,
};
use itertools::Itertools;
use serde::Deserialize;
use sqlx::{query, query_as};
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
        experience, speciality.name as speciality_name, speciality.id as speciality_id,
        room.id as "room_id: Option<i32>",
        room.label as "room_label: Option<String>"
        FROM Doctor
        JOIN Account ON Account.id = Doctor.account_id
        LEFT JOIN Room ON Room.id = Doctor.room_id
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
                room: r.room_id.zip(r.room_label).map(|(id, label)| Room {
                    label,
                    id: Some(id),
                }),
                experience: r.experience,
            },
        })
        .collect_vec();

    Ok(Json(records))
}

#[derive(IntoParams, Deserialize)]
pub struct Patients {
    /// Name filter
    name: Option<String>,
}

/// Get patients that had appointment with this doctor
#[utoipa::path(
    get,
    path = "/doctor/:id/patients",
    params(
        ("id" = i32, Path, description = "Doctor id")
    ),
    responses(
        (status = 200, description = "Successfully returned doctor's patients", body = [Patient]),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is forbidden from accessing facility information")
    )
)]
pub async fn patients(
    session: Session,
    State(state): RouteState,
    Path(id): Path<i32>,
    Query(query): Query<Patients>,
) -> RouteResult<Json<Vec<Patient>>> {
    assert_role(&session, &[Role::Receptionist, Role::Admin]).await?;

    let patients = query_as!(
        Patient,
        r#"SELECT
        DISTINCT Patient.id,
        first_name, last_name, middle_name, details,
        phone_number, male, address, date_of_birth, contract_id,
        appointment.time as last_appointment
        FROM Appointment
        JOIN Patient ON Patient.id = Appointment.patient_id
        JOIN Account ON Account.id = Patient.account_id
        WHERE doctor_id = $1 AND
        (LOWER(first_name || last_name || middle_name) LIKE ('%' || $2 || '%') OR ($2 IS NULL)) AND
        appointment.time < CURRENT_TIMESTAMP"#,
        id,
        query.name
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(patients))
}
