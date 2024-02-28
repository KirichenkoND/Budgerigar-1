import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import './EditorMode.scss'
import React, { useState } from 'react';

const PatientFields = [
    { label: "Фамилия:", type: "text" },
    { label: "Имя:", type: "text" },
    { label: "Отчество:", type: "text" },
    { label: "Дата рождения:", type: "text" },
]

const doctorFields = [
    { label: "Фамилия:", type: "text" },
    { label: "Имя:", type: "text" },
    { label: "Отчество:", type: "text" },
    { label: "Дата рождения:", type: "text" },
    { label: "Категория:", type: "text" },
    { label: "Специализация:", type: "text" },
    { label: "Стаж:", type: "text" },
];

export const EditorMode: React.FC = () => {
    const [isRegistratorMode, setisRegistratorMode] = useState(true);

    const toggleMode = () => {
        setisRegistratorMode(!isRegistratorMode);
    }
    return (
        <>
            <div className='EditorContainer'>
                <input type="checkbox" checked={isRegistratorMode} onChange={toggleMode} />
                <div className='EditorFields'>
                    {isRegistratorMode ? "Новый пациент" : "Новый врач"}
                    <ul>
                        {
                            isRegistratorMode ?
                                PatientFields.map((field, index) => (
                                    <li key={index}>
                                        <label>{field.label}</label>
                                        <Input type={field.type} />
                                    </li>
                                )) :
                                doctorFields.map((field, index) => (
                                    <li key={index}>
                                        <label>{field.label}</label>
                                        <Input type={field.type} />
                                    </li>
                                ))

                        }
                        <Button text="Добавить" />
                    </ul>
                </div>
            </div>
        </>
    )
}