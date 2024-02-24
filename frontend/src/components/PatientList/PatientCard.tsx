import React from 'react';

interface PatientCardProps {
    id: number;
    name: string;
    address: string;
    gender: string;
    age: number;
    insuranceNumber: string;
    lastvisitdate: string;
    report: string;
    diagnosis: string
}

const PatientCard: React.FC<PatientCardProps> = ({ id, name, address, gender, age, insuranceNumber, lastvisitdate, report, diagnosis }) => {
    return (
        <div className="patient-card">
            <h2>{name}</h2>
            <p>Адрес: {address}</p>
            <p>Пол: {gender}</p>
            <p>Возраст: {age}</p>
            <p>Номер договора: {insuranceNumber}</p>
            <p>Дата посещения: {lastvisitdate}</p>
            <p>Жалобы: {report}</p>
            <p>Диагноз: {diagnosis}</p>
        </div>
    );
}

export default PatientCard;