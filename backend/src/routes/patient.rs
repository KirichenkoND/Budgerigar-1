use super::{assert_role, RouteResult, RouteState};
use crate::{
    error::Error,
    models::{Patient, Role},
};
use axum::{
    extract::{Path, Query, State},
    response::IntoResponse,
    Json,
};
use serde::Deserialize;
use tower_sessions::Session;
use utoipa::IntoParams;

#[derive(IntoParams, Deserialize)]
pub struct GetPatientQuery {
    /// Name filter
    pub name: Option<String>,
}

/// Fetch patients
#[utoipa::path(
    get,
    path = "/patient", 
    params(GetPatientQuery),
    responses(
        (status = 200, description = "Successfully returned patients", body = [Patient]),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is forbidden from accessing facility information")
    )
)]
pub async fn get(
    session: Session,
    State(state): RouteState,
    Query(query): Query<GetPatientQuery>,
) -> RouteResult<impl IntoResponse> {
    assert_role(&session, &[Role::Receptionist, Role::Doctor, Role::Admin]).await?;

    let results = sqlx::query_as!(
        Patient,
        r#"
        SELECT DISTINCT ON (Patient.account_id) Patient.account_id as id, first_name, last_name, middle_name, male, details,
        phone_number, date_of_birth, contract_id, address,
        CASE
            WHEN appointment.time < CURRENT_TIMESTAMP THEN appointment.time
            ELSE NULL
        END AS last_appointment
        FROM Patient
        JOIN Account ON Account.id = Patient.account_id
        LEFT JOIN Appointment ON Appointment.patient_id = Patient.account_id
        WHERE (LOWER(last_name || first_name || middle_name) LIKE ('%' || LOWER($1) || '%') OR $1 IS NULL)
    "#,
        query.name
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(results))
}

/// Fetch patient by id
#[utoipa::path(
    get,
    path = "/patient/:id", 
    responses(
        (status = 200, description = "Successfully returned patient", body = Patient),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is forbidden from accessing facility information")
    )
)]
pub async fn get_by_id(
    session: Session,
    State(state): RouteState,
    Path(id): Path<i32>,
) -> RouteResult<impl IntoResponse> {
    assert_role(&session, &[Role::Receptionist, Role::Doctor, Role::Admin]).await?;

    let Some(result) = sqlx::query_as!(
        Patient,
        r#"
        SELECT Patient.account_id as id, first_name, last_name, middle_name, male, details,
        phone_number, date_of_birth, contract_id, address, appointment.time AS last_appointment
        FROM Patient
        JOIN Account ON Account.id = Patient.account_id
        LEFT JOIN Appointment ON Appointment.patient_id = Patient.account_id
        WHERE Patient.account_id = $1
        ORDER BY appointment.time DESC
        LIMIT 1
    "#,
        id
    )
    .fetch_optional(&state.db)
    .await?
    else {
        return Err(Error::NotFound("Patient"));
    };

    Ok(Json(result))
}
