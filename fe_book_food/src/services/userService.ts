import { Page } from "../types/page";
import { ChangeStatusUserRequest, UpdateUserRequest, UserResponse, UserSearchParams, UserStatus } from "../types/user";
import { API_ENDPOINTS, TOKEN_KEY } from "../utils/constants";
import { api, ApiResponse } from "./api";

export const userService = {
    //xem thông tin cá nhân ( user, admin)
    async getMyProfile(): Promise<UserResponse | null> {

        try {
            const response = await api.get<ApiResponse<UserResponse>>(API_ENDPOINTS.USERS.MY_PROFILE);
            return response.data.data;
        }
        catch (error) {
            console.error("Create review error: ", error);
            return null;
        }
    },

    //xem thông tin của user theo id
    async getUserById(id: number): Promise<UserResponse | null> {

        try {
            const response = await api.get<ApiResponse<UserResponse>>(API_ENDPOINTS.USERS.BY_ID(id));
            return response.data.data;
        }
        catch (error) {
            console.error("Create review error: ", error);
            return null;
        }
    },

    //lấy thông tin tất cả người dùng
    async getAllUsers(): Promise<UserResponse[] | null> {

        try {
            const response = await api.get<ApiResponse<UserResponse[]>>(API_ENDPOINTS.USERS.ALL);
            return response.data.data;
        }
        catch (error) {
            console.error("Create review error: ", error);
            return null;
        }
    },

    //lấy ds người dùng có phân trang
    async searchUsers(params: UserSearchParams): Promise<Page<UserResponse>> {
        // Giá trị mặc định an toàn
        const query: Record<string, any> = {
            page: params.page ?? 0,
            size: params.size ?? 10,
            sort: params.sort ?? "id,asc",
            name: params.name && params.name.trim() !== "" ? params.name.trim() : undefined,
        };

        //nếu có status hoặc status khác all thì mới set status vào query
        if (params.status && params.status !== 'ALL') {
            query.status = params.status;
        }

        const response = await api.get<ApiResponse<Page<UserResponse>>>(API_ENDPOINTS.USERS.SEARCH, { params: query });
        return response.data.data;
    },

    //người dùng cập nhật thông tin bản thân
    async updateUserByUser(request: UpdateUserRequest): Promise<UserResponse> {

        const response = await api.put<ApiResponse<UserResponse>>(API_ENDPOINTS.USERS.UPDATE_PROFILE, request);
        return response.data.data;
    },

    //admin cập nhật người dùng
    async updateUserById(id: number, request: UpdateUserRequest): Promise<UserResponse> {

        const response = await api.put<ApiResponse<UserResponse>>(API_ENDPOINTS.USERS.UPDATE_BY_ID(id), request);
        return response.data.data;
    },

    //lấy danh sách user bị khóa
    async getAllUsersByBlocked(): Promise<UserResponse[] | null> {

        try {
            const response = await api.get<ApiResponse<UserResponse[]>>(API_ENDPOINTS.USERS.BLOCKED);
            return response.data.data;
        }
        catch (error) {
            console.error("Create review error: ", error);
            return null;
        }
    },

    // Lấy danh sách các user còn hoạt động
    async getActiveUsers(): Promise<UserResponse[] | null> {
        try {
            const response = await api.get<ApiResponse<UserResponse[]>>(API_ENDPOINTS.USERS.ACTIVE);
            return response.data.data;
        } catch (error) {
            console.error("Create review error: ", error);
            return null;
        }
    },

    //thay đổi trạng thái tài khoản của user( cả active và block)
    async changeUserStatus(id: number, request: ChangeStatusUserRequest): Promise<UserResponse> {
        const response = await api.put<ApiResponse<UserResponse>>(API_ENDPOINTS.USERS.CHANGE_STATUS(id), request
        );
        return response.data.data;
    }
}