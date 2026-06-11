import axios from "axios";

const API = axios.create({

    baseURL: "http://20.40.57.133:8000"
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