BEGIN;

INSERT INTO Facility(address) VALUES('807691, Калининградская область, город Домодедово, пр. 1905 года, 08');

INSERT INTO Room(label, facility_id) VALUES(
    'Б-13',
    (SELECT id FROM Facility LIMIT 1)
);
INSERT INTO Room(label, facility_id) VALUES(
    'Б-14',
    (SELECT id FROM Facility LIMIT 1)
);
INSERT INTO Room(label, facility_id) VALUES(
    'Б-15',
    (SELECT id FROM Facility LIMIT 1)
);

INSERT INTO Speciality(name) VALUES('Медсестра');
INSERT INTO Speciality(name) VALUES('Хирург');
INSERT INTO Speciality(name) VALUES('Ортопед');

-- Doctors

INSERT INTO Account(role, last_name, first_name, middle_name, phone_number, password_hash) VALUES ('doctor', 'Никольская', 'Анастасия', 'Александровна', '+7911111111', '$argon2id$v=19$m=19456,t=2,p=1$Thp1sdQRzX56K/zT0JUdxA$ZhuWd5m4ovZ2oPtTLLFHvi62YepiFEcYU+7NF+sN27I');

INSERT INTO Doctor(experience, account_id, speciality_id)
VALUES(
    1,
    (SELECT id FROM Account WHERE last_name = 'Никольская'),
    (SELECT id FROM Speciality WHERE name = 'Медсестра')
);

INSERT INTO Account(role, last_name, first_name, middle_name, phone_number, password_hash) VALUES ('doctor', 'Иванова', 'Ева', 'Ярославовна', '+7911111112', '$argon2id$v=19$m=19456,t=2,p=1$Thp1sdQRzX56K/zT0JUdxA$ZhuWd5m4ovZ2oPtTLLFHvi62YepiFEcYU+7NF+sN27I');

INSERT INTO Doctor(experience, account_id, speciality_id, room_id) 
VALUES(
    2,
    (SELECT id FROM Account WHERE last_name = 'Иванова'),
    (SELECT id FROM Speciality WHERE name = 'Хирург'),
    (SELECT id FROM Room WHERE label = 'Б-13')
);

INSERT INTO Account(role, last_name, first_name, middle_name, phone_number, password_hash) VALUES ('doctor', 'Павлов', 'Макар', 'Никитич', '+7911111113', '$argon2id$v=19$m=19456,t=2,p=1$Thp1sdQRzX56K/zT0JUdxA$ZhuWd5m4ovZ2oPtTLLFHvi62YepiFEcYU+7NF+sN27I');

INSERT INTO Doctor(experience, account_id, speciality_id, room_id)
VALUES(
    3,
    (SELECT id FROM Account WHERE last_name = 'Павлов'),
    (SELECT id FROM Speciality WHERE name = 'Ортопед'),
    (SELECT id FROM Room WHERE label = 'Б-14')
);

-- Admin

INSERT INTO Account(role, last_name, first_name, middle_name, phone_number, password_hash) VALUES ('admin', 'Новикова', 'Вероника', 'Степановна', '+7911111114', '$argon2id$v=19$m=19456,t=2,p=1$Thp1sdQRzX56K/zT0JUdxA$ZhuWd5m4ovZ2oPtTLLFHvi62YepiFEcYU+7NF+sN27I');

-- Receptionist

INSERT INTO Account(role, last_name, first_name, middle_name, phone_number, password_hash) VALUES ('receptionist', 'Лапшин', 'Александр', 'Леонович', '+7911111115', '$argon2id$v=19$m=19456,t=2,p=1$Thp1sdQRzX56K/zT0JUdxA$ZhuWd5m4ovZ2oPtTLLFHvi62YepiFEcYU+7NF+sN27I');

-- Patients

INSERT INTO Account(role, last_name, first_name, middle_name, phone_number) VALUES ('patient', 'Панков', 'Георгий', 'Никитич', '+7911111116');

INSERT INTO Patient(date_of_birth, address, male, contract_id, account_id)
VALUES(
    '1984-03-01 13:13:00',
    '362300, Липецкая область, город Балашиха, шоссе Ладыгина, 02',
    true,
    123,
    (SELECT id FROM Account WHERE last_name = 'Панков')
);

INSERT INTO Appointment(doctor_id, patient_id, time)
VALUES(
    (SELECT doctor.account_id FROM Doctor JOIN Account ON Account.id = Doctor.account_id WHERE last_name = 'Павлов'),
    (SELECT patient.account_id FROM Patient JOIN Account ON Account.id = Patient.account_id WHERE last_name = 'Панков'),
    '2024-03-07 13:15:00'
);

INSERT INTO Account(role, last_name, first_name, middle_name, phone_number) VALUES ('patient', 'Виноградов', 'Денис', 'Кириллович', '+7911111117');

INSERT INTO Patient(date_of_birth, address, male, contract_id, account_id) VALUES(
    '1984-03-01 13:13:00',
    '131195, Оренбургская область, город Ногинск, проезд Ленина, 83',
    true,
    321,
    (SELECT id FROM Account WHERE last_name = 'Виноградов')
);

INSERT INTO Appointment(doctor_id, patient_id, time)
VALUES(
    (SELECT doctor.account_id FROM Doctor JOIN Account ON Account.id = Doctor.account_id WHERE last_name = 'Иванова'),
    (SELECT patient.account_id FROM Patient JOIN Account ON Account.id = Patient.account_id WHERE last_name = 'Виноградов'),
    '2024-03-01 14:15:00'
);

INSERT INTO Appointment(doctor_id, patient_id, time)
VALUES(
    (SELECT doctor.account_id FROM Doctor JOIN Account ON Account.id = Doctor.account_id WHERE last_name = 'Иванова'),
    (SELECT patient.account_id FROM Patient JOIN Account ON Account.id = Patient.account_id WHERE last_name = 'Виноградов'),
    '2024-02-27 14:15:00'
);

COMMIT;
