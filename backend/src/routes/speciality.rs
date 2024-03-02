use super::{assert_role, RouteResult, RouteState};
use crate::{
    error::Error,
    models::{Role, Speciality},
};
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::Deserialize;
use serde_json::json;
use sqlx::{error::ErrorKind, query, query_as};
use tower_sessions::Session;

#[derive(Deserialize)]
pub struct Get {
    name: Option<String>,
}

pub async fn get(
    session: Session,
    State(state): RouteState,
    Query(query): Query<Get>,
) -> RouteResult<impl IntoResponse> {
    assert_role(&session, Role::Admin).await?;

    let results = query_as!(
        Speciality,
        "SELECT * FROM Speciality WHERE LOWER(name) LIKE $1 OR $1 IS NULL",
        query.name.map(|n| n.to_lowercase() + "%")
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(results))
}

#[derive(Deserialize)]
pub struct Create {
    name: String,
}

pub async fn create(
    session: Session,
    State(state): RouteState,
    Json(data): Json<Create>,
) -> RouteResult<impl IntoResponse> {
    assert_role(&session, Role::Admin).await?;

    let id = query!(
        "INSERT INTO Speciality(name) VALUES($1) RETURNING id",
        data.name
    )
    .fetch_one(&state.db)
    .await?
    .id;

    Ok(Json(json! {{
        "id": id
    }}))
}

pub async fn delete(
    session: Session,
    State(state): RouteState,
    Path(id): Path<i32>,
) -> RouteResult {
    assert_role(&session, Role::Admin).await?;

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
