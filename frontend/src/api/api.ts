import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IProfile } from './interfaces';

export const baseURL = "http://localhost:3000/api";

interface User {
    phone: string;
    password: string;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
    endpoints: (builder) => ({
        login: builder.mutation<any, User>({
            query: (credentials) => ({
                url: '/account/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/account/logout',
                method: 'POST'
            }),
        }),
        me: builder.query<IProfile, any>({
            query: () => `/account/me`,
        }),
    })
})

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi;