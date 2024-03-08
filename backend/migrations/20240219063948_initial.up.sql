-- Add up migration script here

CREATE TYPE ROLE AS ENUM('patient', 'doctor', 'admin', 'receptionist');

CREATE TABLE IF NOT EXISTS Account(
    id SERIAL PRIMARY KEY,
    role ROLE NOT NULL,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    middle_name VARCHAR(32),
    phone_number VARCHAR(32) UNIQUE NOT NULL,
    password_hash VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Patient(
    account_id INTEGER REFERENCES Account NOT NULL,
    date_of_birth TIMESTAMPTZ NOT NULL,
    address VARCHAR(255) NOT NULL,
    male BOOLEAN NOT NULL,
    contract_id INTEGER UNIQUE NOT NULL,
    details TEXT,

    PRIMARY KEY (account_id)
);

CREATE TABLE IF NOT EXISTS Speciality(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Facility(
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Room(
    id SERIAL PRIMARY KEY,
    label VARCHAR(32) NOT NULL,
    facility_id INTEGER REFERENCES Facility NOT NULL
);

CREATE TABLE IF NOT EXISTS Doctor(
    account_id INTEGER NOT NULL REFERENCES Account,
    experience INTEGER NOT NULL DEFAULT 0,
    speciality_id INTEGER NOT NULL REFERENCES Speciality,
    room_id INTEGER REFERENCES Room,

    PRIMARY KEY (account_id)
);

CREATE TABLE IF NOT EXISTS Appointment(
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL REFERENCES Doctor,
    patient_id INTEGER NOT NULL REFERENCES Patient,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    time TIMESTAMPTZ NOT NULL,
    complaint TEXT,
    diagnosis TEXT,

    UNIQUE (doctor_id, time)
);
