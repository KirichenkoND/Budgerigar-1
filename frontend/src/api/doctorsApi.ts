import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseURL } from './api';

// export interface IGetDoctorsPayload {
//     name?: string;
//     speciality?: number;
// }

export interface IGetDoctors {
    experience?: number;
    first_name?: string;
    middle_name?: string;
    last_name?: string | null;
    password?: string;
    phone_number?: string;
    speciality_id?: number;
}

// type TDoctors = IGetDoctors[]

export const doctorApi = createApi({
    reducerPath: 'doctorApi',
    baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
    endpoints: (builder) => ({
        getDoctors: builder.query<any, any>({
            query: (credentials) => `/doctor?name=${credentials.name || ""}`,
        }),
        addDoctor: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/doctor',
                method: 'POST',
                body: credentials,
            })
        }),
        deleteDoctor: builder.mutation<any, any>({
            query: (credentials) => ({
                url: `/doctor/${credentials.id}`,
                method: 'DELETE',
            })
        }),
        getDoctorsShedule: builder.query({
            query: (id) => `/doctor/${id}/schedule`,
        }),
    })
})

export const { useGetDoctorsQuery, useAddDoctorMutation, useDeleteDoctorMutation, useGetDoctorsSheduleQuery } = doctorApi;