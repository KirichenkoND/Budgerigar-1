use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use std::io;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Sqlx: {0}")]
    Sqlx(#[from] sqlx::Error),
    #[error("Io: {0}")]
    Io(#[from] io::Error),
    #[error("Session: {0}")]
    Session(#[from] tower_sessions::session::Error),
    #[error("{0} is not found")]
    NotFound(&'static str),
    #[error("Login or password is invalid")]
    InvalidCredentials,
    #[error("Not authorized")]
    Unauthorized,
    #[error("{message}")]
    Custom {
        status: StatusCode,
        message: &'static str,
    },
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        let status = match self {
            Error::Sqlx(_) | Error::Io(_) | Error::Session(_) => StatusCode::INTERNAL_SERVER_ERROR,
            Error::NotFound(_) => StatusCode::NOT_FOUND,
            Error::InvalidCredentials => StatusCode::BAD_REQUEST,
            Error::Custom { status, .. } => status,
            Error::Unauthorized => StatusCode::UNAUTHORIZED,
        };

        (
            status,
            Json(json! {{
                "error": true,
                "message": format!("{self}")
            }}),
        )
            .into_response()
    }
}
