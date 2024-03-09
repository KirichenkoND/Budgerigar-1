export interface ILogin {
    password: string;
    phone: string;
}

export interface ILogout {
    
}

export interface IProfile {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    phone_number: string;
    role: string;
}

export type TAppointment = IAppointment[]

export interface IAppointment {
    complaint: string;
    created_at: string;
    diagnosis: string;
    doctor_id: number;
    id: number;
    patient_id: number;
    time: string;
}

export interface IAppointmentId {
    complaint: string;
    created_at: string;
    diagnosis: string;
    doctor_id: number;
    id: number;
    patient_id: number;
    time: string;
}

// TODO: написать интерфейс к каждой роли

// export type TDoctor = []

// export interface IDoctorId {
    
// }

// TODO: затереть

// export interface ICreateAppointmnet {

// }

export interface IUniquuePatientsLastMonth {
    last_month_unique_patients: number;
}

export type TFacility = IFacility[]

export interface IFacility {
    address: string;
    id: number;
}

export interface INewFacility {
    address: string;
    id: number;
}
