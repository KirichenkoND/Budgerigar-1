use super::{assert_role, RouteResult, RouteState};
use crate::{
    error::Error,
    models::{Role, Speciality},
};
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use serde::Deserialize;
use sqlx::{error::ErrorKind, query, query_as};
use tower_sessions::Session;
use utoipa::IntoParams;

#[derive(IntoParams, Deserialize)]
pub struct Get {
    /// Speciality name filter
    name: Option<String>,
}

/// Get all specialities
#[utoipa::path(
    get,
    path = "/speciality",
    params(Get),
    responses(
        (status = 200, description = "Successfully returned specialities", body = [Speciality]),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is forbidden from accessing facility information")
    )
)]
pub async fn get(
    session: Session,
    State(state): RouteState,
    Query(query): Query<Get>,
) -> RouteResult<Json<Vec<Speciality>>> {
    assert_role(&session, &[Role::Admin]).await?;

    let results = query_as!(
        Speciality,
        "SELECT * FROM Speciality WHERE ('%' || LOWER(name) || '%') LIKE $1 OR $1 IS NULL",
        query.name
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(results))
}

/// Create new speciality
#[utoipa::path(
    post,
    path = "/speciality",
    request_body = Speciality,
    responses(
        (status = 200, description = "Successfully created new speciality"),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is forbidden from accessing facility information")
    )
)]
pub async fn create(
    session: Session,
    State(state): RouteState,
    Json(data): Json<Speciality>,
) -> RouteResult<Json<Speciality>> {
    assert_role(&session, &[Role::Admin]).await?;

    let new = query_as!(
        Speciality,
        "INSERT INTO Speciality(name) VALUES($1) RETURNING name, id",
        data.name
    )
    .fetch_one(&state.db)
    .await?;

    Ok(Json(new))
}

pub async fn delete(
    session: Session,
    State(state): RouteState,
    Path(id): Path<i32>,
) -> RouteResult {
    assert_role(&session, &[Role::Admin]).await?;

    match query!("DELETE FROM Speciality WHERE id = $1", id)
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
                "Нельзя удалить специальность к которой еще привязаны доктора",
            ))
        }
        Err(err) => Err(err.into()),
    }
}
