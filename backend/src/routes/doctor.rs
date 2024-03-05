use super::{assert_role, RouteResult, RouteState};
use crate::{
    error::Error,
    models::{Patient, Role, Room, Speciality, User},
};
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use itertools::Itertools;
use serde::{Deserialize, Serialize};
use sqlx::{query, query_as};
use std::collections::BTreeMap;
use time::{Duration, OffsetDateTime, Time, Weekday};
use tower_sessions::Session;
use utoipa::{IntoParams, ToSchema};

/// Get doctor by id
#[utoipa::path(
    get,
    path = "/doctor/:id",
    params(
        ("id" = i32, Path, description = "Doctor id")
    ),
    responses(
        (status = 200, description = "Successfully returned doctor", body = [User]),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is forbidden from accessing facility information")
    )
)]
pub async fn get_by_id(
    session: Session,
    State(state): RouteState,
    Path(id): Path<i32>,
) -> RouteResult<Json<User>> {
    assert_role(&session, &[Role::Admin, Role::Receptionist]).await?;

    let Some(r) = query!(
        r#"SELECT
        first_name, last_name, middle_name, phone_number,
        experience, speciality.name as speciality_name, speciality.id as speciality_id,
        room.id as "room_id: Option<i32>",
        room.label as "room_label: Option<String>"
        FROM Doctor
        JOIN Account ON Account.id = Doctor.account_id
        LEFT JOIN Room ON Room.id = Doctor.room_id
        JOIN Speciality ON Speciality.id = Doctor.speciality_id
        WHERE role = 'doctor' AND
        Doctor.account_id = $1"#,
        id
    )
    .fetch_optional(&state.db)
    .await?
    else {
        return Err(Error::NotFound("Doctor"));
    };

    let user = User {
        id,
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
    };

    Ok(Json(user))
}

#[derive(IntoParams, Deserialize)]
pub struct Get {
    pub name: Option<String>,
    pub speciality: Option<i32>,
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
        r#"SELECT
        Doctor.account_id as id,
        first_name, last_name, middle_name, phone_number,
        experience, speciality.name as speciality_name, speciality.id as speciality_id,
        room.id as "room_id: Option<i32>",
        room.label as "room_label: Option<String>"
        FROM Doctor
        JOIN Account ON Account.id = Doctor.account_id
        LEFT JOIN Room ON Room.id = Doctor.room_id
        JOIN Speciality ON Speciality.id = Doctor.speciality_id
        WHERE role = 'doctor' AND
        (LOWER(last_name || first_name || middle_name) LIKE ('%' || $1 || '%') OR $1 IS NULL) AND
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
        Patient.account_id as id, first_name, last_name, middle_name, details,
        phone_number, male, address, date_of_birth, contract_id,
        appointment.time as last_appointment
        FROM Appointment
        JOIN Patient ON Patient.account_id = Appointment.patient_id
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

#[derive(ToSchema, Serialize)]
pub struct Statistics {
    last_month_unique_patients: i64,
}

/// Get patients that had appointment with this doctor
#[utoipa::path(
    get,
    path = "/doctor/:id/patients",
    params(
        ("id" = i32, Path, description = "Doctor id")
    ),
    responses(
        (status = 200, description = "Successfully returned doctor's patients", body = Statistics),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is forbidden from accessing facility information")
    )
)]
pub async fn stats(
    session: Session,
    State(state): RouteState,
    Path(id): Path<i32>,
) -> RouteResult<Json<Statistics>> {
    assert_role(&session, &[Role::Admin, Role::Receptionist]).await?;

    let record = query!("SELECT COUNT (DISTINCT patient_id) as last_month_unique_patients FROM Appointment
        WHERE doctor_id = $1 AND time < current_date AND time > (current_date - interval '1 month')", id).fetch_one(&state.db).await?;
    let stats = Statistics {
        last_month_unique_patients: record.last_month_unique_patients.unwrap_or(0),
    };

    Ok(Json(stats))
}

/// Returns schedule of the doctor
#[utoipa::path(
    get,
    path = "/doctor/:id/schedule",
    params(
        ("id" = i32, Path, description = "Doctor id")
    ),
    responses(
        (status = 200, description = "Successfully returned doctor's schedule"),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is forbidden from accessing facility information")
    )
)]
pub async fn schedule(
    session: Session,
    State(state): RouteState,
    Path(id): Path<i32>,
) -> RouteResult<impl IntoResponse> {
    assert_role(&session, &[Role::Admin]).await?;

    let mut schedule = vec![];
    let mut current = OffsetDateTime::now_utc();

    for _ in 0..7 {
        let mut map = BTreeMap::new();

        if !matches!(current.weekday(), Weekday::Sunday | Weekday::Saturday) {
            for hour in 9..=17 {
                for minute in (0..60).step_by(15) {
                    map.insert(format!("{hour}:{minute:02}"), true);
                }
            }
        }

        schedule.push(map);
        current += Duration::days(1);
    }

    let mut i = 0;
    loop {
        if current.weekday() == Weekday::Saturday {
            schedule[i].clear();
            schedule[i].clear();
            break;
        }

        if current.weekday() == Weekday::Sunday {
            break;
        }

        i += 1;
        current += Duration::days(1);
    }

    let active = query!(
        r#"SELECT
        EXTRACT(DAY FROM (time - current_date))::integer as "day!",
        EXTRACT(HOUR FROM time)::integer as "hour!",
        EXTRACT(MINUTE FROM time)::integer as "minute!"
        FROM Appointment WHERE doctor_id = $1 AND time::date >= current_date AND time::date < (current_date + interval '7 days')::date"#,
        id
    )
    .fetch_all(&state.db)
    .await?;

    for record in active {
        *schedule[record.day as usize]
            .get_mut(&format!("{}:{:02}", record.hour, record.minute))
            .unwrap() = false;
    }

    Ok(Json(schedule))
}

#[derive(Debug, IntoParams, Deserialize)]
pub struct AppointmentQuery {
    offset: u8,
    time: String,
}

/// Makes a new appointment for a patient
#[utoipa::path(
    get,
    path = "/doctor/:id/appointment/:patient_id",
    params(
        ("id" = i32, Path, description = "Doctor id"),
        ("patient_id" = i32, Path, description = "Patient id"),
        AppointmentQuery
    ),
    responses(
        (status = 200, description = "Successfully returned doctor's schedule"),
        (status = 401, description = "Request is not authorized"),
        (status = 403, description = "User is forbidden from accessing facility information")
    )
)]
pub async fn appointment(
    session: Session,
    State(state): RouteState,
    Path((doctor_id, patient_id)): Path<(i32, i32)>,
    Query(query): Query<AppointmentQuery>,
) -> RouteResult<impl IntoResponse> {
    assert_role(&session, &[Role::Receptionist, Role::Admin]).await?;

    let bad_req = Error::custom(StatusCode::BAD_REQUEST, "Invalid time");
    let Some((Ok(hour), Ok(minute))) = query
        .time
        .split_once(':')
        .map(|(hour, minute)| (hour.parse::<u8>(), minute.parse::<u8>()))
    else {
        return Err(bad_req);
    };

    if minute % 15 != 0 {
        return Err(bad_req);
    }

    if !(9..=17).contains(&hour) {
        return Err(bad_req);
    }

    let mut current = OffsetDateTime::now_utc();
    current += Duration::days(1) * query.offset;
    current = current.replace_time(Time::from_hms(hour, minute, 0).unwrap());

    match query!(
        "INSERT INTO Appointment(doctor_id, patient_id, time) VALUES($1, $2, $3)",
        doctor_id,
        patient_id,
        current
    )
    .execute(&state.db)
    .await
    {
        Ok(_) => Ok(()),
        Err(err) if matches!(err.as_database_error(), Some(x) if x.is_unique_violation()) => {
            Err(bad_req)
        }
        Err(err) => Err(err.into()),
    }
}
