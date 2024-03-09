import React, { useCallback, useState } from "react";
import { IGetDoctors, useGetDoctorsQuery } from "../../api/doctorsApi";
import { PatientCardBuba } from "../../components/PatientCardForList/PatientCard";

import "./doctor.scss";
import Popup from "../../components/Popup/Popup";
import DoctorCard from "../../components/DoctorList/DoctorCard";
import DoctorList from "../../components/DoctorList/DoctorList";

export interface IDoctor {
  id: number;
  phone_number: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  speciality: {
    id: number;
    name: string;
  };
  room: null | {
    id: number;
    label: string;
  };
  experience: number;
}

const DoctorListPage: React.FC = () => {
  // const { data, isError, isLoading, isSuccess } = useGetDoctorsQuery({});
  // const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
  // const [isPopupOpen, setIsPopupOpen] = useState(false);
  // const handlePatientToggler = useCallback((doctor: IDoctor) => {
  //   setSelectedDoctor(doctor);
  //   setIsPopupOpen(!isPopupOpen);
  // }, [isPopupOpen]);

  // const handleClosePopup = () => {
  //   setSelectedDoctor(null);
  //   setIsPopupOpen(false);
  // };

  // if (isError) {
  //   throw new Error("ошыбка чекни инет");
  // }
  // if (isLoading) {
  //   return <>{"Здесь лоадер должен был быц, хехе"}</>;
  // }
  // if (isSuccess) {
  //   return (
  //     <>
  //     <h2>Список врачей</h2>
  //     {data.map((doctor: IDoctor, index: number) => {
  //       return (
  //         <div className="doctor-list">
  //           <PatientCardBuba
  //               {...doctor}
  //               flag='doctor'
  //               key={index + doctor.first_name}
  //               first_name={doctor.first_name}
  //               last_appointment={doctor.speciality.name}
  //               last_name={doctor.last_name}
  //               onClick={() => handlePatientToggler(doctor)}
  //             />
              
  //             <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
  //               {selectedDoctor && <DoctorCard {...selectedDoctor} />}
  //             </Popup>
  //         </div>
  //       )
  //     })}
  //     </>
  //   );
  // }
  return (
    <>
      <div>
        <DoctorList />
      </div>
    </>
  );
};

export default DoctorListPage;
