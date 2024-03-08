import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseURL } from './api';

export interface IGetPatients {
    address: string;
    contract_id: number;
    date_of_birth: string;
    details: string;
    first_name: string;
    id: number;
    last_appointment: string;
    last_name: string;
    male: boolean;
    middle_name: string;
    phone_number: string;
}

export interface IGetDiagnosis {
    complaint: string;
    created_at: string;
    diagnosis: string;
    doctor_id: number;
    id: number;
    patient_id: number;
    time: string;
    recomendations: string;
}

interface ISendRequestDiagnosis {
    id: number;
}

type TPatients = IGetPatients[]
type TGetDiagnosis = IGetDiagnosis[]

export const patientApi = createApi({
    reducerPath: 'patientApi',
    baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
    endpoints: (builder) => ({
        getPatient: builder.query<TPatients, any>({
            query: () => `/patient`,
        }),
        getAppointment: builder.query<TGetDiagnosis, ISendRequestDiagnosis>({
            query: (credentials) => ({
                url: `/appointment?patient_id=${credentials.id}`,
                method: 'GET'
            }),
        }),
    })
})

export const { useGetPatientQuery, useGetAppointmentQuery } = patientApi;