    import React, { useState } from 'react';
    import PatientCard from './PatientCard';
    import Popup from '../Popup/Popup'; // Импортируем компонент Popup

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
        diagnosis: string }[];
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
        diagnosis: string } | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Состояние для открытия/закрытия модального окна
    const patientsPerPage = 5;

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
        <table>
            <thead>
            <tr>
                <th>ФИО</th>
                <th>Последний визит</th>
                <th>Диагноз</th>
            </tr>
            </thead>
            <tbody>
            {currentPatients.map((patient, index) => (
                <tr key={index} onClick={() => handlePatientClick(patient)}>
                <td>{patient.name}</td>
                <td>{patient.lastvisitdate}</td>
                <td>{patient.diagnosis}</td>
                </tr>
            ))}
            </tbody>
        </table>
        <div>
            <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
            <span>{currentPage} / {totalPages}</span>
            <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
        {/* Передаем состояние isPopupOpen и функцию для закрытия модального окна */}
        <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
            {/* Отображаем карточку пациента внутри модального окна */}
            {selectedPatient && <PatientCard {...selectedPatient} />}
        </Popup>
        </div>
    );
    }

    export default PatientList;
