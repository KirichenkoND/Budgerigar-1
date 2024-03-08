import React from 'react';
import PatientList from '../../components/PatientList/PatientList';
import patientsdata from '../../adata/patientdata.json';

const PatientListPage: React.FC = () => {
    return (
        <>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: "70vw", justifyItems: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                <PatientList/>
            </div>
        </>
    );
}

export default PatientListPage;
