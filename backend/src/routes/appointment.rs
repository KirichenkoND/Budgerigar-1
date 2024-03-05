use super::{assert_role, RouteResult, RouteState};
use crate::{
    error::Error,
    models::{Appointment, Class, Role, User},
};
use axum::{
    extract::{Path, Query, State},
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
    count: Option<i64>,
    offset: Option<i64>,
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
        query.count.unwrap_or(5).clamp(0, 25),
        query.offset.unwrap_or(0).max(0),
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(results))
}

#[derive(IntoParams, Deserialize)]
pub struct UpdateQuery {
    pub diagnosis: Option<String>,
    pub complaint: Option<String>,
}

pub async fn update(
    user: User,
    State(state): RouteState,
    Query(query): Query<UpdateQuery>,
    Path(id): Path<i32>,
) -> RouteResult<Json<Appointment>> {
    let mut tx = state.db.begin().await?;

    let result: Appointment = query_as!(
        Appointment,
        "UPDATE Appointment SET
        diagnosis = CASE WHEN $1::text IS NULL THEN diagnosis ELSE $1 END,
        complaint = CASE WHEN $2::text IS NULL THEN complaint ELSE $2 END
        WHERE id = $3
        RETURNING *",
        query.diagnosis,
        query.complaint,
        id
    )
    .fetch_one(&mut *tx)
    .await?;

    if result.doctor_id != user.id && !matches!(user.class, Class::Admin) {
        return Err(Error::Forbidden);
    }

    tx.commit().await?;
    Ok(Json(result))
}
