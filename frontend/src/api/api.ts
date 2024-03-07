import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface User {
    phone: string;
    password: string;
}

const baseURL = "http://45.132.50.201:9009";

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
    })
})

export const { useLoginMutation, useLogoutMutation } = authApi;