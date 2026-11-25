import axios from 'axios';

// Ensure baseURL doesn't have duplicate slashes (e.g. if VITE_API_URL ends with '/')
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');

const api = axios.create({
    baseURL: `${cleanBaseUrl}/api`,
});

// Add a request interceptor to add the JWT token to the headers
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');

        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);

            if (parsedUserInfo.token) {
                config.headers.Authorization = `Bearer ${parsedUserInfo.token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;