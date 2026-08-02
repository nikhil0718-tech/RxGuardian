import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE || "https://api.rxguardian.xyz";

const API = axios.create({
    baseURL: API_BASE
});

API.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem(
            "token"
        );

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    }
);

export default API;