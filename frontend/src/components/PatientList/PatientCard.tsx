import React, { useState } from 'react';
import './PatientCard.scss';
import Button from '../../UI/Button/Button';
import Input from "../../UI/Input/Input";
import Popup from '../Popup/Popup';
import { IGetPatients, useGetAppointmentQuery } from '../../api/patientApi';

const PatientCard: React.FC<IGetPatients> = ({first_name, last_appointment, last_name, middle_name, ...props}) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    
    const [complaint, setComplaint] = useState("");
    const [recommendation, setRecommendation] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const {data, isError, isLoading, isSuccess} = useGetAppointmentQuery({id: props.id});
    const openPopup = () => {
        setIsPopupOpen(true);
    };
    const closePopup = () => {
        setIsPopupOpen(false);
    };
    if (isError) {
        return <>что то пошло не так</>;
    }
    if (isLoading) {
        return <>Зогрузочка</>;
    }

    return (
        <div className="patient-card">
            <div>
                <h2>{`${first_name} ${middle_name} ${last_name}`}</h2>
                <p>Пол: {props.male ? "мужчина" : "Женщина"}</p>
                <p>Дата рождения: {props.date_of_birth}</p>
            </div>
            <div>
                <p>Адрес: {props.address}</p>
                <p>Номер договора: {props.contract_id}</p>
            </div>
            <p>Визиты к врачу:</p>

            <div className="scroll-list">
                <div className="sessions-list">
                    {isSuccess && data.map((session, index) => (
                        <div key={index} className="session-item">
                            <p><strong>Дата визита:</strong> {session.time.slice(0, 10)}</p>
                            <p><strong>Жалобы:</strong> {session.complaint}</p>
                            <p><strong>Диагноз:</strong> {session.diagnosis}</p>
                            <p><strong>Рекомендации:</strong> {session.recomendations}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <Button text="Новый приём" onClick={openPopup} />
            </div>

            <Popup isOpen={isPopupOpen} onClose={closePopup}>
                <h3>Новый приём <br/>{first_name}</h3>
                <div>
                    <span className="user-name"></span>
                    <p>Жалобы: <Input onChange={(e) => setComplaint(e.target.value)} value={complaint}/></p>
                    <p>Диагноз: <Input onChange={(e) => setDiagnosis(e.target.value)} value={diagnosis}/></p>
                    <p>Рекомендации: <Input onChange={(e) => setRecommendation(e.target.value)} value={recommendation}/></p>
                </div>
                <Button text="Завершить приём" onClick={closePopup} />
            </Popup>

        </div>
    );
}

export default PatientCard;