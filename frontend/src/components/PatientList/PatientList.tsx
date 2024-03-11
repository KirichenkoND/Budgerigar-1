import React, { useCallback, useState } from "react";
// import PatientCard from "./PatientCard";
import Popup from "../Popup/Popup";
import "./PatientList.scss";
import { IGetPatients, useGetPatientQuery } from "../../api/patientApi";
import {
  PatientCardBuba,
} from "../PatientCardForList/PatientCard";
import PatientCard from "./PatientCard";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";

const PatientList: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<IGetPatients | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [credentials, setCredentials] = useState("");
  const [find, setFind] = useState("");
  const { data, isError, isLoading, isSuccess } = useGetPatientQuery({name: credentials});
  const handlePatientToggler = useCallback((patient: IGetPatients) => {
    setSelectedPatient(patient);
    setIsPopupOpen(!isPopupOpen);
  }, [isPopupOpen]);

  const handleClosePopup = () => {
    setSelectedPatient(null);
    setIsPopupOpen(false);
  };

  if (isError) {
    return <>что то пошло не так</>;
  }
  if (isLoading) {
    return <>Зогрузка</>;
  }
  if (isSuccess) {
    return (
      <div className="patient-list">
        <h2>Список пациентов</h2>
        <div>
          <Input onChange={(e) => setFind(e.target.value)} value={find} />
          <Button text="Поиск" onClick={() => setCredentials(find)} />
        </div>
        {data.map((patient, index) => {
          return (
            <>
              <PatientCardBuba
                {...patient}
                flag="patient"
                key={index + patient.first_name}
                first_name={patient.first_name}
                last_appointment={patient.last_appointment.slice(0, 10)}
                last_name={patient.last_name}
                onClick={() => handlePatientToggler(patient)}
              />

              <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
                {selectedPatient && <PatientCard {...selectedPatient} />}
              </Popup>
            </>
          );
        })}
      </div>
    );
  }
};

export default PatientList;
