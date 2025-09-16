import axios, { AxiosResponse } from "axios"; //thư viện HTTP client để gửi request (GET/POST/...).
import { toast } from "react-hot-toast";
import { API_BASE_URL, API_ENDPOINTS, REFRESH_TOKEN_KEY, TOKEN_KEY } from "../utils/constants";
import { AuthResponse } from "../types/auth";

/*
    axios: HTTP client dùng để gọi API
    tạo 1 instance api có cấu hình mặc định (baseURL + headers).
    Mọi call kiểu api.get('/foods') sẽ gọi đến ${API_BASE_URL}/foods.
*/
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
    Mục đích: trước khi axios gửi request, thêm header Authorization: Bearer <token> nếu token tồn tại.
    config là object cấu hình request (type: AxiosRequestConfig). Nó chứa các trường như url, method, headers, params, data...
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//xử lý lỗi và refresh token
api.interceptors.response.use(
    //xử lý kkhi request thành công
    (response: AxiosResponse) => response,
    async(error) => {
        const originalRequest = error.config; //error.config chính là object config của request ban đầu (url, headers, method,...).

        //Backend trả về lỗi Unauthorized - Đảm bảo request chỉ được retry 1 lần,
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true; //để đánh dấu request này đã thử refresh.

            try{
                const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
                if(refreshToken){
                    const response = await api.post<AuthResponse>(
                        API_ENDPOINTS.AUTH.REFRESH, {refreshToken}
                    );

                    const { accessToken } = response.data;
                    localStorage.setItem(TOKEN_KEY, accessToken);

                    //gắn access token mới
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch(refreshError){
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(REFRESH_TOKEN_KEY);
                window.location.href= '/login';
            }
        }
        toast.error(error.response?.data?.message || "An error occured");
        return Promise.reject(error);
    }
);
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}