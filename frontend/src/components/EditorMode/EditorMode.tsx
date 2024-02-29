import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import "./EditorMode.scss";
import React, { useState } from "react";

const patientFields = [
  { label: "Фамилия:", type: "text" },
  { label: "Имя:", type: "text" },
  { label: "Отчество:", type: "text" },
  { label: "Дата рождения:", type: "text" },
];

const doctorFields = [
  { label: "Фамилия:", type: "text" },
  { label: "Имя:", type: "text" },
  { label: "Отчество:", type: "text" },
  { label: "Дата рождения:", type: "text" },
  { label: "Категория:", type: "text" },
  { label: "Специализация:", type: "text" },
  { label: "Стаж:", type: "text" },
];

const administartorFields = [
  { label: "Фамилия:", type: "text" },
  { label: "Имя:", type: "text" },
  { label: "Отчество:", type: "text" },
  { label: "Дата рождения:", type: "text" },
  { label: "Биба:", type: "text" },
];

const radioButtonUsers = [
  { text: "Пациент", value: "Patient", fields: patientFields },
  { text: "Врач", value: "Doctor", fields: doctorFields },
  {
    text: "Администратор",
    value: "Administartor",
    fields: administartorFields,
  },
];

type User = "Patient" | "Doctor" | "Administartor" | "";

export const EditorMode: React.FC = () => {
  const [userType, setUserType] = useState("");
  return (
    <>
      <div className="EditorContainer">
        <div className="EditorFields">
          <div className="switcher">
            <span>Выберите пользователя</span>
            <div className="switcher-buttons">
              {radioButtonUsers.map((user) => {
                return (
                  <>
                    <div>
                      <span className="user-name">{user.text}</span>
                      <input
                        key={user.value}
                        type="radio"
                        name="user"
                        value={user.value}
                        onClick={() => setUserType(user.value)}
                      />
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <div>
            <div className="fields">
              {radioButtonUsers
                .find((user) => userType === user.value)
                ?.fields.map((field) => {
                  return (
                    <>
                      <label>{field.label}</label>
                      <Input type={field.type} />
                    </>
                  );
                })}
            </div>
          </div>
          <ul>
            <Button text="Добавить" />
          </ul>
        </div>
      </div>
    </>
  );
};
