use super::{assert_role, RouteResult, RouteState};
use crate::{
    error::Error,
    models::{Facility, Role, Room},
};
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::Deserialize;
use sqlx::{error::ErrorKind, query, query_as};
use tower_sessions::Session;
use utoipa::IntoParams;

#[derive(IntoParams, Deserialize)]
pub struct Get {
    /// Address filter
    address: Option<String>,
}

/// Get all facilities
#[utoipa::path(
    get,
    path = "/facility",
    params(Get),
    responses(
        (status = 200, description = "Returned all facilities successfully", body = [Facility]),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is forbidden from accessing facility information")
    )
)]
pub async fn get(
    session: Session,
    State(state): RouteState,
    Query(query): Query<Get>,
) -> RouteResult<Json<Vec<Facility>>> {
    assert_role(&session, &[Role::Admin]).await?;

    let results = query_as!(
        Facility,
        "SELECT * FROM Facility WHERE LOWER(address) LIKE ('%' || LOWER($1) || '%') OR $1 IS NULL",
        query.address
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(results))
}

/// Get facility rooms
#[utoipa::path(
    get,
    path = "/facility/:id/rooms",
    params(
        ("id" = i32, Path, description = "Facility id"),
    ),
    responses(
        (status = 200, description = "Successfully returned rooms", body = [Room]),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is forbidden from accessing facility information")
    )
)]
pub async fn rooms(
    session: Session,
    State(state): RouteState,
    Path(id): Path<i32>,
) -> RouteResult<Json<Vec<Room>>> {
    assert_role(&session, &[Role::Admin]).await?;

    let results = query_as!(
        Room,
        r#"
        SELECT id, label FROM Room
        WHERE Room.facility_id = $1
    "#,
        id
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(results))
}

/// Create new facility
#[utoipa::path(
    post,
    path = "/facility",
    request_body = Facility,
    responses(
        (status = 200, description = "Facility was created successfully", body = Facility),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is forbidden from accessing facility information")
    )
)]
pub async fn create(
    session: Session,
    State(state): RouteState,
    Json(data): Json<Facility>,
) -> RouteResult<impl IntoResponse> {
    assert_role(&session, &[Role::Admin]).await?;

    let new = query_as!(
        Facility,
        "INSERT INTO Facility(address) VALUES($1) RETURNING address, id",
        data.address
    )
    .fetch_one(&state.db)
    .await?;

    Ok(Json(new))
}

/// Delete the facility
#[utoipa::path(
    delete,
    path = "/facility/:id",
    params(
        ("id" = i32, Path, description = "Facility id"),
    ),
    responses(
        (status = 200, description = "Facility was deleted successfully"),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is forbidden from accessing facility information")
    )
)]
pub async fn delete(
    session: Session,
    State(state): RouteState,
    Path(id): Path<i32>,
) -> RouteResult {
    assert_role(&session, &[Role::Admin]).await?;

    match query!("DELETE FROM Facility WHERE id = $1", id)
        .execute(&state.db)
        .await
    {
        Ok(_) => Ok(()),
        Err(err)
            if matches!(
                err.as_database_error().unwrap().kind(),
                ErrorKind::ForeignKeyViolation
            ) =>
        {
            Err(Error::custom(
                StatusCode::BAD_REQUEST,
                "Нельзя удалить участок к которой еще привязаны доктора",
            ))
        }
        Err(err) => Err(err.into()),
    }
}
