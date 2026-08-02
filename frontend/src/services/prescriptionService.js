import API from "../api/api";

export const createPrescription = async (data) => {

    const response = await API.post(

        "/prescriptions/create",

        data
    );

    return response.data;
};

export const getPatientPrescriptions = async (patientId) => {

    const response = await API.get(

        `/prescriptions/patient/${patientId}`
    );

    return response.data;
};