import React, { FC } from "react";
import defailt_avatar from "../../../public/user.svg";
import './PatientCard.scss';

export interface IPatientCard {
    first_name: string;
    last_appointment: string;
    last_name: string;
    middle_name: string;
    onClick: () => void;
}
export const PatientCardBuba: FC<IPatientCard> = ({first_name, last_appointment, last_name, middle_name, onClick, ...otherInfo }) => {
  return (
    <div
      className="patient-card-item"
      onClick={onClick}
    >
      <div className="patient-info">
        <div className="patient-avatar">
          <img src={defailt_avatar}></img>
        </div>
        <div className="patient-info1">
          <p>
            <strong>ФИО:</strong> {`${first_name} ${middle_name} ${last_name}`}
          </p>
          <p>
            <strong>Последний визит:</strong>{" "}
            {last_appointment}
          </p>
        </div>
      </div>
    </div>
  );
};
