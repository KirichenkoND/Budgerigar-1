import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userReducer from './slices/userSlice';
import { authApi } from '../api/api';
import { patientApi } from '../api/patientApi';
import { doctorApi } from '../api/doctorsApi';

export const store = configureStore({
    reducer: {
        user: userReducer,
        [authApi.reducerPath]: authApi.reducer,
        [patientApi.reducerPath]: patientApi.reducer,
        [doctorApi.reducerPath]: doctorApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware).concat(patientApi.middleware).concat(doctorApi.middleware),

})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector