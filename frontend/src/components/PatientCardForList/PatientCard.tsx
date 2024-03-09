import { FC, useState } from "react";
import defailt_avatar from "../../../public/user.svg";
import "./PatientCard.scss";
import Button from "../../UI/Button/Button";
import { useGetDoctorsSheduleQuery } from "../../api/doctorsApi";
import Popup from "../Popup/Popup";

export interface IPatientCard {
  flag: "doctor" | "patient";
  first_name: string;
  last_appointment: string;
  last_name: string;
  middle_name: string;
  id: number;
  onClick: () => void;
}
export const PatientCardBuba: FC<IPatientCard> = ({
  flag,
  first_name,
  last_appointment,
  last_name,
  middle_name,
  onClick,
  ...otherInfo
}) => {
  
  
  // const [deleteDoctor, {isError, isLoading, isSuccess}] = useDeleteDoctorMutation();
  // const handleDeleteDoctor = () => {
  //     deleteDoctor(credentials)
  // }



  return (
    <div className="patient-card-item" onClick={onClick}>
      <div className="patient-info">
        <div className="patient-avatar">
          <img src={defailt_avatar}></img>
        </div>
        <div className="patient-info1">
          <p>
            <strong>ФИО:</strong> {`${first_name} ${middle_name} ${last_name}`}
          </p>
          <p>
            {flag === "doctor" ? (
              <>
                <strong>Специальность:</strong> {last_appointment}
              </>
            ) : (
              <>
                <strong>Последний визит:</strong> {last_appointment}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
