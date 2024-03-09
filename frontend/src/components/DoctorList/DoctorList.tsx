import React, { useCallback, useState } from "react";
import DoctorCard from "./DoctorCard";
import Popup from "../Popup/Popup";

import "./DoctorList.scss";
import {
  useGetDoctorsQuery,
  useGetDoctorsSheduleQuery,
} from "../../api/doctorsApi";
import { IDoctor } from "../../Pages/DoctorListPage/DoctorListPage";
import { PatientCardBuba } from "../PatientCardForList/PatientCard";
import Button from "../../UI/Button/Button";
import DoctorShedulePopUp from "./DoctorShedulePopUp";
import Input from "../../UI/Input/Input";

const DoctorList: React.FC = () => {
  const { data, isError, isLoading, isSuccess } = useGetDoctorsQuery({});
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [find, setFind] = useState("");
  const [isPopupOpenSchedule, setIsPopupOpenSchedule] = useState(false);
  const handlePatientToggler = useCallback(
    (doctor: IDoctor) => {
      setSelectedDoctor(doctor);
      setIsPopupOpen(!isPopupOpen);
    },
    [isPopupOpen]
  );

  const handleClosePopup = () => {
    setSelectedDoctor(null);
    setSelectedDoctorId(null);
    setIsPopupOpen(false);
  };

  const handlePatientTogglerSchedule = useCallback((doctor: IDoctor) => {
    setSelectedDoctorId(doctor.id)
    setIsPopupOpenSchedule(!isPopupOpenSchedule);
  }, [isPopupOpenSchedule]);

  if (isError) {
    throw new Error("ошыбка чекни инет");
  }
  if (isLoading) {
    return <>{"Здесь лоадер должен был быц, хехе"}</>;
  }
  if (isSuccess) {
    return (
      <>
        <h2>Список врачей</h2>
        <div>
        <Input onChange={(e) => setFind(e.target.value)} value={find}/>
        <Button text="Поиск" onClick={() => console.log(find)}/>
        </div>
        {data.map((doctor: IDoctor, index: number) => {
          return (
            <div className="doctor-list">
              <PatientCardBuba
                {...doctor}
                flag="doctor"
                key={index + doctor.first_name}
                first_name={doctor.first_name}
                last_appointment={doctor.speciality.name}
                last_name={doctor.last_name}
                onClick={() => handlePatientToggler(doctor)}
              />
              <div style={{ marginLeft: "auto" }}>
                <Button
                  text={"Посмотреть расписание"}
                  onClick={() => handlePatientTogglerSchedule(doctor)}
                />
              </div>
              <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
                {selectedDoctor && <DoctorCard {...selectedDoctor} /> || selectedDoctorId && <DoctorShedulePopUp id={doctor.id} /> }
              </Popup>
            </div>
          );
        })}
      </>
    );
  }
};

export default DoctorList;
