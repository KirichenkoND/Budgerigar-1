import React, { useState } from 'react';
import PatientCard from './PatientCard';
import Popup from '../Popup/Popup'; // Импортируем компонент Popup

import Button from '../../UI/Button/Button';

interface PatientListProps {
    patients: {
        id: number;
        name: string;
        address: string;
        gender: string;
        age: number;
        insuranceNumber: string;
        lastvisitdate: string;
        report: string;
        diagnosis: string
    }[];
}

const PatientList: React.FC<PatientListProps> = ({ patients }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPatient, setSelectedPatient] = useState<{
        id: number;
        name: string;
        address: string;
        gender: string;
        age: number;
        insuranceNumber: string;
        lastvisitdate: string;
        report: string;
        diagnosis: string
    } | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Состояние для открытия/закрытия модального окна
    const patientsPerPage = 3;

    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

    const totalPages = Math.ceil(patients.length / patientsPerPage);

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handlePatientClick = (patient: typeof patients[number]) => {
        setSelectedPatient(patient);
        setIsPopupOpen(true); // Открыть модальное окно при нажатии на пациента
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false); // Закрыть модальное окно
    };

    return (
        <div className="patient-list">
            <h2>Список пациентов</h2>
            <div className="patient-card-container">
                {currentPatients.map((patient, index) => (
                    <div key={index} className="patient-card-item" onClick={() => handlePatientClick(patient)}>
                        <div className="patient-info">
                            <p><strong>ФИО:</strong> {patient.name}</p>
                            <p><strong>Последний визит:</strong> {patient.lastvisitdate}</p>
                            <p><strong>Диагноз:</strong> {patient.diagnosis}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <Button text="Previous" onClick={prevPage} disabled={currentPage === 1} />
                <span>{currentPage} / {totalPages}</span>
                <Button text="Next" onClick={nextPage} disabled={currentPage === totalPages} />
            </div>
            {/* Передаем состояние isPopupOpen и функцию для закрытия модального окна */}
            <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
                {/* Отображаем карточку пациента внутри модального окна */}
                {selectedPatient && <PatientCard {...selectedPatient} />}
            </Popup>
        </div >
    );
}

export default PatientList;
