import React, { useState } from 'react';
import DoctorCard from './DoctorCard';
import Popup from '../Popup/Popup';

import defailt_avatar from '../../../public/user.svg';
import Button from '../../UI/Button/Button';

import './DoctorList.scss';

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

  const doctorsPerPage = 2;
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
            <div className="doctor-cards-container">
                {currentDoctors.map((doctor, index) => (
                    <div className="doctor-card-item" key={index} onClick={() => handleDoctorClick(doctor)}>
                        <div className="doctor-info">
                            <div className="doctor-avatar">
                            <img src={defailt_avatar}></img>
                            </div>
                            <div className='doctor-info1'>
                                <p><strong>ФИО:</strong> {doctor.name}</p>
                                <p><strong>Специализация:</strong> {doctor.specialization}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

      <div className="pagination">
        <Button text="Previous" onClick={prevPage} disabled={currentPage === 1} />
        <span>{currentPage} / {totalPages}</span>
        <Button text="Next" onClick={nextPage} disabled={currentPage === totalPages} />
      </div>
      <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
        {selectedDoctor && <DoctorCard {...selectedDoctor} />}
      </Popup>
    </div>
  );
}

export default DoctorList;
