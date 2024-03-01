import React from 'react';
import './PatientCard.scss';

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
            <div>
                <h2>{name}</h2>
                <p>Пол: {gender}</p>
                <p>Возраст: {age}</p>
            </div>
            <div>
                <p>Адрес: {address}</p>
                <p>Номер договора: {insuranceNumber}</p>
            </div>
            <div>
                <p>Дата посещения: {lastvisitdate}</p>
                <p>Жалобы: {report}</p>
                <p>Диагноз: {diagnosis}</p>
            </div>
        </div>
    );
}прос

export default PatientCard;