import React from 'react';
import PatientList from '../components/PatientList/PatientList';
import patientsdata from '../adata/patientdata.json';

const PatientListPage: React.FC = () => {
    // Логика получения списка пациентов

    return (
        <>
            <div>
                <PatientList patients={patientsdata} />
            </div>
            <div>
                
            </div>
        </>
    );
}

export default PatientListPage;
