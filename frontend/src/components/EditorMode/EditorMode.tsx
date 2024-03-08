import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import "./EditorMode.scss";
import React, { useState } from "react";
import { useAddDoctorMutation } from "../../api/doctorsApi";

// const patientFields = [
//   { label: "Фамилия:", type: "text" },
//   { label: "Имя:", type: "text" },
//   { label: "Отчество:", type: "text" },
//   { label: "Дата рождения:", type: "text" },
// ];

const doctorFields = [
  { label: "Фамилия:", type: "text", key: "last_name" },
  { label: "Имя:", type: "text", key: "first_name" },
  { label: "Отчество:", type: "text", key: "middle_name" },
  { label: "Телефон:", type: "text", key: "phone_number" },
  { label: "Пароль:", type: "text", key: "password" },
  { label: "Специализация:", type: "text", key: "speciality_id" },
  { label: "Стаж:", type: "text", key: "experience" },
];

// const administartorFields = [
//   { label: "Фамилия:", type: "text" },
//   { label: "Имя:", type: "text" },
//   { label: "Отчество:", type: "text" },
//   { label: "Дата рождения:", type: "text" },
//   { label: "Биба:", type: "text" },
// ];

// const receptionFields = [
//   { label: "Фамилия:", type: "text" },
//   { label: "Имя:", type: "text" },
//   { label: "Отчество:", type: "text" },
//   { label: "Дата рождения:", type: "text" },
//   { label: "Биба:", type: "text" },
//   { label: "БумаБум:", type: "text" },

// ];

const radioButtonUsers = [
  // { text: "Пациент", value: "Patient", fields: patientFields },
  { text: "Врач", value: "Doctor", fields: doctorFields },
  // {
  //   text: "Администратор",
  //   value: "Administartor",
  //   fields: administartorFields,
  // },
  // {
  //   text: "Регистратура",
  //   value: "Reception",
  //   fields: receptionFields,
  // },
];

type User = "Patient" | "Doctor" | "Administartor" | "";

export const EditorMode: React.FC = () => {
  const [userType, setUserType] = useState("");
  const [addDoctor, {isError, isLoading, isSuccess}] = useAddDoctorMutation();
  // const [doctorInfo, setDoctorInfo] = useState({});
  const [last_name, setlast_name] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [middle_name, setmiddle_name] = useState("");
  const [speciality_id, setspeciality_id] = useState("");
  const [phone_number, setphone_number] = useState("");
  const [password, setpassword] = useState("");
  const [experience, setexperience] = useState("");

  const handleSendInfo = () => {
    addDoctor({
      last_name: last_name,
      first_name: first_name,
      middle_name: middle_name,
      speciality_id: parseInt(speciality_id),
      phone_number: phone_number,
      password: password,
      experience: parseInt(experience)
    })
  }
  if (isError) {
    return <>ошибка</>
  }
  if (isLoading) {
    return <>Загрузка</>
  }
  return (
    <>
      <div className="EditorContainer">
        <div className="EditorFields">
          <div className="switcher">
            <span>Добавить врача</span>
            <div className="switcher-buttons">
              {radioButtonUsers.map((user) => {
                return (
                  <>
                    <div>
                      {/* <span className="user-name">{user.text}</span> */}
                      {/* <input
                        key={user.value}
                        type="radio"
                        name="user"
                        value={user.value}
                        onClick={() => setUserType(user.value)}
                      /> */}
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <div>
            <div className="fields">
              <label>{"Имя:"}</label>
              <Input
                onChange={(e) => setfirst_name(e.target.value)}
                value={first_name}
              />
              <label>{"Фамилия:"}</label>
              <Input
                onChange={(e) => setlast_name(e.target.value)}
                value={last_name}
              />
              <label>{"Отчество:"}</label>
              <Input
                onChange={(e) => setmiddle_name(e.target.value)}
                value={middle_name}
              />
              <label>{"Телефон:"}</label>
              <Input
                onChange={(e) => setphone_number(e.target.value)}
                value={phone_number}
              />
              <label>{"Пароль:"}</label>
              <Input
                onChange={(e) => setpassword(e.target.value)}
                value={password}
              />
              <label>{"Стаж:"}</label>
              <Input
                onChange={(e) => setexperience(e.target.value)}
                value={experience}
              />
              <label>{"Специальность:"}</label>
              <Input
                onChange={(e) => setspeciality_id(e.target.value)}
                value={speciality_id}
              />
              {/* {radioButtonUsers
                .find((user) => userType === user.value)
                ?.fields.map((field) => {
                  return (
                    <>
                      <label>{field.label}</label>
                      <Input
                        onChange={(e) =>
                          setDoctorInfo({
                            ...doctorInfo,
                            [field.key]: e.target.value,
                          })
                        }
                        value={}
                      />
                    </>
                  );
                })} */}
            </div>
          </div>
          <Button text="Добавить" onClick={handleSendInfo}/>
        </div>
      </div>
    </>
  );
};
