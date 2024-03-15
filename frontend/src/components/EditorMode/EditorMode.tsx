import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import "./EditorMode.scss";
import React, { useState } from "react";
import { useAddDoctorMutation } from "../../api/doctorsApi";
import { useAddPatientMutation } from "../../api/patientApi";

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

export const EditorMode: React.FC = () => {
  const [addDoctor, { isError, isLoading, isSuccess }] = useAddDoctorMutation();
  const [specialityState, setSpecialityState] = useState<number | 0>(0);
  const [last_name, setlast_name] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [middle_name, setmiddle_name] = useState("");
  const [phone_number, setphone_number] = useState("");
  const [password, setpassword] = useState("");
  const [experience, setexperience] = useState("");

  const [
    addPatient,
    {
      isError: isErrorPatient,
      isLoading: isLoadingPatient,
      isSuccess: isSuccessPatient,
    },
  ] = useAddPatientMutation();
  const [last_name_patient, setlast_name_patient] = useState("");
  const [first_name_patient, setfirst_name_patient] = useState("");
  const [middle_name_patient, setmiddle_name_patient] = useState("");
  const [phone_number_patient, setphone_number_patient] = useState("");
  const [pol_patient, setpol_patient] = useState<number>();
  const [contract_id, setcontract_id] = useState<string>("");
  const [address_patient, setaddress_patinet] = useState("");
  const [date_of_birth_patient, setdate_of_birth_patient] = useState("");

  const handleSendInfo = () => {
    addDoctor({
      last_name: last_name,
      first_name: first_name,
      middle_name: middle_name,
      speciality_id: specialityState || 0,
      phone_number: phone_number,
      password: password,
      experience: parseInt(experience),
    });
  };

  const handleSendInfoPatient = () => {
    addPatient({
      last_name: last_name_patient,
      first_name: first_name_patient,
      middle_name: middle_name_patient,
      phone_number: phone_number_patient,
      male: Boolean(pol_patient),
      date_of_birth: date_of_birth_patient,
      contract_id: parseInt(contract_id),
      address: address_patient,
    });
  };
  if (isErrorPatient) {
    return <>ошибка</>;
  }
  if (isLoadingPatient) {
    return <>Загрузка</>;
  }
  if (isError) {
    return <>ошибка</>;
  }
  if (isLoading) {
    return <>Загрузка</>;
  }
  return (
    <>
      <div className="EditorContainer">
        <div className="EditorFields">
          <div className="switcher">
            <span>Добавить врача</span>
            <div className="switcher-buttons"></div>
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
                type="tel"
              />
              <label>{"Пароль:"}</label>
              <Input
                type="password"
                onChange={(e) => setpassword(e.target.value)}
                value={password}
              />
              <label>{"Стаж:"}</label>
              <Input
                type="number"
                onChange={(e) => setexperience(e.target.value)}
                placeholder="В полных годах"
                value={experience}
              />
              <label>{"Специальность:"}</label>
              <select
                name="speciality"
                id="speciality"
                value={specialityState}
                onChange={(e) => {
                  setSpecialityState(parseInt(e.target.value));
                }}
                style={{ minWidth: "20vw", minHeight: "3vh" }}
              >
                <option value={0} disabled>
                  {" "}
                </option>
                <option value={1}>Хирург</option>
                <option value={2}>Ортопед</option>
                <option value={3}>МедСестра</option>
                <option value={4}>ЛОР</option>
              </select>
            </div>
          </div>
          <Button
            text="Добавить"
            onClick={handleSendInfo}
            disabled={
              !Boolean(last_name) ||
              !Boolean(first_name) ||
              !Boolean(middle_name) ||
              !Boolean(phone_number) ||
              !Boolean(password) ||
              !Boolean(experience) ||
              !Boolean(specialityState)
            }
          />
        </div>

        <div className="EditorFields">
          <div className="switcher">
            <span>Добавить пациента</span>
            <div className="switcher-buttons"></div>
          </div>
          <div>
            <div className="fields">
              <label>{"Имя:"}</label>
              <Input
                onChange={(e) => setfirst_name_patient(e.target.value)}
                value={first_name_patient}
              />
              <label>{"Фамилия:"}</label>
              <Input
                onChange={(e) => setlast_name_patient(e.target.value)}
                value={last_name_patient}
              />
              <label>{"Отчество:"}</label>
              <Input
                onChange={(e) => setmiddle_name_patient(e.target.value)}
                value={middle_name_patient}
              />
              <label>{"Телефон:"}</label>
              <Input
                onChange={(e) => setphone_number_patient(e.target.value)}
                value={phone_number_patient}
                type="tel"
              />
              <label>{"Пол:"}</label>
              <select
                name="pol"
                id="pol"
                value={pol_patient}
                onChange={(e) => {
                  setpol_patient(parseInt(e.target.value));
                }}
                style={{ minWidth: "20vw", minHeight: "3vh" }}
              >
                <option value={1}>Мужской</option>
                <option value={0}>Женский</option>
              </select>
              <label>{"Адрес:"}</label>
              <Input
                type="text"
                onChange={(e) => setaddress_patinet(e.target.value)}
                value={address_patient}
              />
              <label>{"Контракт ID:"}</label>
              <Input
                type="number"
                onChange={(e) => setcontract_id(e.target.value)}
                placeholder="ID контракта"
                value={contract_id}
              />
              <label>{"Дата рождения:"}</label>
              <Input
                type="date"
                onChange={(e) => setdate_of_birth_patient(e.target.value)}
                placeholder="30.01.2000"
                value={date_of_birth_patient}
              />
            </div>
          </div>
          <Button
            text="Добавить"
            onClick={handleSendInfoPatient}
            disabled={
              !Boolean(last_name_patient) ||
              !Boolean(first_name_patient) ||
              !Boolean(middle_name_patient) ||
              !Boolean(phone_number_patient) ||
              !Boolean(date_of_birth_patient) ||
              !Boolean(contract_id) ||
              !Boolean(address_patient)
            }
          />
        </div>
      </div>
    </>
  );
};
