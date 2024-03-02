-- Add up migration script here

CREATE TYPE ROLE AS ENUM('patient', 'doctor', 'admin', 'receptionist');

CREATE TABLE Account(
    id SERIAL PRIMARY KEY,
    role ROLE NOT NULL,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    middle_name VARCHAR(32),
    phone_number VARCHAR(32) UNIQUE NOT NULL,
    password_hash VARCHAR(255)
);

CREATE TABLE Patient(
    id SERIAL PRIMARY KEY,
    date_of_birth TIMESTAMPTZ NOT NULL,
    address VARCHAR(255),
    male BOOLEAN NOT NULL,
    contract_id INTEGER UNIQUE NOT NULL,
    account_id INTEGER REFERENCES Account(id) NOT NULL,
    details TEXT
);

CREATE TABLE Speciality(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Facility(
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Room(
    id SERIAL PRIMARY KEY,
    label VARCHAR(32) NOT NULL,
    facility_id INTEGER REFERENCES Facility(id) NOT NULL
);

CREATE TABLE Doctor(
    id SERIAL PRIMARY KEY,
    experience INTEGER NOT NULL DEFAULT 0,
    account_id INTEGER NOT NULL REFERENCES Account(id),
    speciality_id INTEGER NOT NULL REFERENCES Speciality(id),
    room_id INTEGER REFERENCES Room(id)
);

CREATE TABLE Appointment(
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL REFERENCES Doctor(id),
    patient_id INTEGER NOT NULL REFERENCES Patient(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    time TIMESTAMPTZ NOT NULL,
    complaint TEXT,
    diagnosis TEXT
);

CREATE TABLE Consented(
    doctor_id INTEGER NOT NULL REFERENCES Doctor(id),
    patient_id INTEGER NOT NULL REFERENCES Patient(id)
);

