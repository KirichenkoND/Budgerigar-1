import React from 'react';
import { useParams } from 'react-router-dom';
import PatientCard from '../../components/PatientList/PatientCard';

interface PatientCardPageProps {
  patients: { 
    id: number;
    name: string; 
    address: string;
    gender: string;
    age: number;
    insuranceNumber: string;
    lastvisitdate: string; 
    report: string;
    diagnosis: string }[];
}

const PatientCardPage: React.FC<PatientCardPageProps> = ({ patients }) => {
    const { id } = useParams<{ id?: string }>(); // Add "?" to make id optional
    const patient = patients.find(patient => patient.id === parseInt(id || "", 10)); // Provide a default value for id

    return (
        <div>
            {patient ? <PatientCard {...patient} /> : <p>Patient not found</p>}
        </div>
    );
}

export default PatientCardPage;
