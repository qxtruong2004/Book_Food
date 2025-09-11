import axios, { AxiosResponse } from "axios"; //thư viện HTTP client để gửi request (GET/POST/...).
import { error } from "console";
import { config } from "process";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

//tạo 1 instance api có cấu hình mặc định (baseURL + headers).
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//gắn token vào header trước khi gửi (Interceptor này chạy trước khi axios gửi request.)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if(token){
            config.headers.Authorization = `Bearer'${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//xử lý lỗi và refresh token
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async(error) => {
        const originalRequest = error.config;
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try{
                const refreshToken = localStorage.getItem('refreshToken');
                if(refreshToken){
                    const response = await api.post('/auth/refresh', {
                        refreshToken: refreshToken,
                    });

                    const {accessToken, refreshToken: newRefreshToken} = response.data.data;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshTokenn', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch(refreshError){
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href= '/login';
            }
        }
    }

)