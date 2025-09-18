import { AuthResponse, UserLoginRequest, UserRegisterRequest } from "../types/auth";
import { UserResponse } from "../types/user";
import { API_BASE_URL, API_ENDPOINTS, REFRESH_TOKEN_KEY, TOKEN_KEY } from "../utils/constants";
import { api, ApiResponse } from "./api";

export const authService = {
    //login
    async login(credentials: UserLoginRequest): Promise<AuthResponse>{
        const response = await  api.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.LOGIN, {
            credentials
        });
        const {accessToken, refreshToken} = response.data.data;
        
        //lưu token
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        return response.data.data;
    },

    //register
    async register(credentials: UserRegisterRequest): Promise<AuthResponse>{
        const response = await api.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.REGISTER, {
            credentials
        });
        return response.data.data;
    },
 
    //logout
    async logout() : Promise<void>{
        const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);
        if(refresh_token){
            try {
                await api.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.LOGOUT, {refreshToken: refresh_token});
            } catch (error) {
                console.error("Logout error:", error);
            }
        }
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    //refresh
    async refresh(): Promise<AuthResponse | null>{
        const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);
        if(!refresh_token) return null;

        const response = await api.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.REFRESH, {refreshToken: refresh_token});

        const {accessToken} = response.data.data;
        localStorage.setItem(TOKEN_KEY, accessToken);
        return response.data.data; 
    },

    //me
    async me(): Promise<UserResponse>{
          const response = await api.get<ApiResponse<UserResponse>>(API_ENDPOINTS.AUTH.ME
        );
    return response.data.data;
    }
}