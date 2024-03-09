import React, { FC, useState } from "react";
import Button from "../../UI/Button/Button";
import Popup from "../Popup/Popup";
import { useGetDoctorsSheduleQuery } from "../../api/doctorsApi";
interface PopUpProps {
  id: number;
}

const days: Record<number, string> = {
  0: "Сегодня",
  1: "Завтра",
  2: "Через 1 день",
  3: "Через 3 дня",
  4: "Через 4 дня",
  5: "Через 5 дня",
  6: "Через 6 дней",
};

const DoctorShedulePopUp: FC<PopUpProps> = ({ id }) => {
  const { data, isError, isLoading, isSuccess } = useGetDoctorsSheduleQuery(id);
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {isSuccess &&
        data.map((day: Record<string, boolean>, index: number) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                marginRight: 30,
              }}
            >
              <h5>{days[index]}</h5>
              {Object.entries(day).map(
                ([timeStamp, stateTime]: [string, boolean]) => {
                  return (
                    <div key={timeStamp}>
                      {stateTime && (
                        <>
                          <span>{timeStamp}</span>
                          <span>Свободно</span>
                        </>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          );
        })}
    </div>
  );
};

export default DoctorShedulePopUp;
