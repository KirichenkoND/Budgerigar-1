import React from 'react';
import DoctorList from '../../components/DoctorList/DoctorList';
import data from '../../adata/doctordata.json';

const DoctorListPage: React.FC = () => {
    // Логика получения списка пациентов

    return (
        <>
            <div>
                <DoctorList doctors = {data} />
            </div>
        </>
    );
}

export default DoctorListPage;
