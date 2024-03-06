import React, { useState } from 'react';
import './PatientCard.scss';
import Button from '../../UI/Button/Button';
import Input from "../../UI/Input/Input";
import Popup from '../Popup/Popup';

export interface Sessions {
    visitdate: string;
    report: string;
    diagnosis: string;
    recommendations: string;
}

interface PatientCardProps {
    id: number;
    name: string;
    address: string;
    gender: string;
    age: number;
    insuranceNumber: string;
    sessions: Sessions[];
}

const PatientCard: React.FC<PatientCardProps> = ({ id, name, address, gender, age, insuranceNumber, sessions }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

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
            <p>Визиты к врачу:</p>

            <div className="scroll-list">
                <div className="sessions-list">
                    {sessions.slice().reverse().map((session, index) => (
                        <div key={index} className="session-item">
                            <p><strong>Дата визита:</strong> {session.visitdate}</p>
                            <p><strong>Жалобы:</strong> {session.report}</p>
                            <p><strong>Диагноз:</strong> {session.diagnosis}</p>
                            <p><strong>Рекомендации:</strong> {session.recommendations}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <Button text="Новый приём" onClick={openPopup} />
            </div>

            <Popup isOpen={isPopupOpen} onClose={closePopup}>
                <h3>Новый приём <br/>{name}</h3>
                <div>
                    <span className="user-name"></span>
                    <p>Жалобы: <Input /></p>
                    <p>Диагноз: <Input /></p>
                    <p>Рекомендации: <Input /></p>
                </div>
                <Button text="Завершить приём" onClick={closePopup} />
            </Popup>

        </div>
    );
}

export default PatientCard;