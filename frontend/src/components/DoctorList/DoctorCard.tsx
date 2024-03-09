import React from 'react';
import Button from '../../UI/Button/Button';

import './DoctorCard.scss';
import { IDoctor } from '../../Pages/DoctorListPage/DoctorListPage';
import { useDeleteDoctorMutation, useGetDoctorsSheduleQuery } from '../../api/doctorsApi';
import { useNavigate } from 'react-router-dom';


const DoctorCard: React.FC<IDoctor> = (props) => {
    const {data, isError, isLoading, isSuccess} = useGetDoctorsSheduleQuery(props.id);
    // const [deleteDoctor, {isError, isLoading, isSuccess}] = useDeleteDoctorMutation();
    // const handleDeleteDoctor = () => {
    //     deleteDoctor(credentials)
    // }

    if (isError) {
        return <>не может такого быть!!!! да ты меня достал, мне не платят, а я тут пишу, распинаюс уже сил моих нет, скиньте деняк я бедный айтышнык</>
    }
    if (isLoading) {
        return <>загрузили жесть 09.03.2024 3:34</>
    }
    if (isSuccess) {
        
    }
    return (
        <>
            <div>
                <h2>{`${props.first_name} ${props.last_name} ${props.middle_name}`}</h2>
                <p>Опыт работы: {props.experience}</p>
                <p>Специализация: {props.speciality.name}</p>
                {props.room ? <p>Кабинет: {props.room.label}</p> : <>Кабинет отсутствует звоните по номеру: {props.phone_number}</>}
                
            </div>
            <div>
                <Button text="Удалить" styleName="red_btn" /*onClick={handleDeleteDoctor}*/ />
            </div>
        </>
    );
}

export default DoctorCard;
