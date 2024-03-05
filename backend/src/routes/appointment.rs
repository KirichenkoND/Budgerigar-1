use super::{assert_role, RouteResult, RouteState};
use crate::models::{Appointment, Role};
use axum::{
    extract::{Query, State},
    Json,
};
use serde::Deserialize;
use sqlx::query_as;
use time::OffsetDateTime;
use tower_sessions::Session;
use utoipa::IntoParams;

#[derive(IntoParams, Deserialize)]
pub struct AppointmentsQuery {
    before: Option<OffsetDateTime>,
    after: Option<OffsetDateTime>,
    doctor_id: Option<i32>,
    patient_id: Option<i32>,
    #[serde(default = "default_count")]
    count: i32,
    #[serde(default = "default_offset")]
    offset: i32,
}

fn default_count() -> i32 {
    5
}
fn default_offset() -> i32 {
    0
}

pub async fn get(
    session: Session,
    State(state): RouteState,
    Query(query): Query<AppointmentsQuery>,
) -> RouteResult<Json<Vec<Appointment>>> {
    assert_role(&session, &[Role::Admin, Role::Doctor, Role::Receptionist]).await?;

    let results = query_as!(
        Appointment,
        r#"
        SELECT *
        FROM Appointment
        WHERE
            (Appointment.doctor_id = $1 OR $1 IS NULL) AND
            (Appointment.patient_id = $2 OR $2 IS NULL) AND
            (Appointment.time < $3 OR $3 IS NULL) AND
            (Appointment.time > $4 OR $4 IS NULL)
        LIMIT $5 OFFSET $6
    "#,
        query.doctor_id,
        query.patient_id,
        query.before,
        query.after,
        u32::try_from(query.count).unwrap_or(5) as i32,
        u32::try_from(query.offset).unwrap_or(0) as i32,
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(results))
}
