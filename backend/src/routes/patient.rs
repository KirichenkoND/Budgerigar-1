use super::{assert_role, RouteResult, RouteState};
use crate::models::{Patient, Role};
use axum::{
    extract::{Query, State},
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
        SELECT DISTINCT ON (Patient.id) Patient.id, first_name, last_name, middle_name, male, details,
        phone_number, date_of_birth, contract_id, address,
        CASE
            WHEN appointment.time < CURRENT_TIMESTAMP THEN appointment.time
            ELSE NULL
        END AS last_appointment
        FROM Patient
        JOIN Account ON Account.id = Patient.account_id
        LEFT JOIN Appointment ON Appointment.patient_id = Patient.id
        WHERE (LOWER(last_name || first_name || middle_name) LIKE ('%' || LOWER($1) || '%') OR $1 IS NULL)
    "#,
        query.name
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(results))
}
