import React from 'react';
import './DoctorCard.scss';

interface DoctorCardProps {
    id: number;
    name: string;
    category: string;
    experience: number;
    age: number;
    specialization: string;
    area: string;
    schedule: string;
    office: string;
    appointmentSchedule: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ id, name, category, experience, age, specialization, area, schedule, office, appointmentSchedule }) => {
    return (
        <div>
            <h2>{name}</h2>
            <p>Категория: {category}</p>
            <p>Опыт работы: {experience}</p>
            <p>Специализация: {specialization}</p>
            <p>Область работы: {area}</p>
            <p>График работы: {schedule}</p>
            <p>Кабинет: {office}</p>
            <p>График приема: {appointmentSchedule}</p>
        </div>
    );
}

export default DoctorCard;
