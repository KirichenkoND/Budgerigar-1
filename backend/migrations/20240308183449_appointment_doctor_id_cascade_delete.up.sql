-- Add up migration script here
ALTER TABLE Appointment DROP CONSTRAINT appointment_doctor_id_fkey;
ALTER TABLE Appointment ADD CONSTRAINT appointment_doctor_id_fkey FOREIGN KEY(doctor_id) REFERENCES Doctor ON DELETE CASCADE;
