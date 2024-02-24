import React, { useState } from 'react';
import DoctorCard from './DoctorCard';
import Popup from '../Popup/Popup';

interface DoctorListProps {
  doctors: {
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
  }[];
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<{
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
  } | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const doctorsPerPage = 5;
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleDoctorClick = (doctor: typeof doctors[number]) => {
    setSelectedDoctor(doctor);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="doctor-list">
      <h2>Список врачей</h2>
      <table>
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Категория</th>
            <th>Опыт работы</th>
            <th>Специализация</th>
          </tr>
        </thead>
        <tbody>
          {currentDoctors.map((doctor, index) => (
            <tr key={index} onClick={() => handleDoctorClick(doctor)}>
              <td>{doctor.name}</td>
              <td>{doctor.category}</td>
              <td>{doctor.experience}</td>
              <td>{doctor.specialization}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
      <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
        {selectedDoctor && <DoctorCard {...selectedDoctor} />}
      </Popup>
    </div>
  );
}

export default DoctorList;
