import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100/supermercado-service';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }
)

apiClient.interceptors.response.use(
    (response) => {
        console.log('RESPONSE AXIOS', response);
        return response.data
    },
        
    (error) => {
        if(error.response.status === 401) {
            localStorage.remoteItem('token');
            localStorage.removeItem('refreshToken');
        }
        return Promise.reject(error);
    }
)



