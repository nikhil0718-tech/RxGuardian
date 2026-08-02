import API from "../api/api";

export const getTodayMedicines = async (patientId) => {

    const response = await API.get(

        `/prescriptions/patient/${patientId}`
    );

    return response.data;
};