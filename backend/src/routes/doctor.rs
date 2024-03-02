use super::{RouteResult, RouteState};
use crate::{error::Error, models::Role};
use axum::extract::State;
use tower_sessions::Session;

pub async fn add(session: Session, State(state): RouteState) -> RouteResult {
    let role = session
        .get::<Role>("role")
        .await?
        .ok_or(Error::Unauthorized)?;
    if !matches!(role, Role::Admin) {
        return Err(Error::Forbidden);
    }

    Ok(())
}
