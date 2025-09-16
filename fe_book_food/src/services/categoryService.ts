import { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from "../types/category";
import { Page } from "../types/page";
import { API_ENDPOINTS, TOKEN_KEY } from "../utils/constants";
import { api, ApiResponse } from "./api";

export const categoryService = {
    // lấy tất cả categories có phân trang
    async getAllCategories(page = 0, size = 10): Promise<Page<CategoryResponse>> {
        const response = await api.get<ApiResponse<Page<CategoryResponse>>>(
            API_ENDPOINTS.CATEGORIES.ALL, {params : {page, size}}
        );
        return response.data.data;
    },

    // lấy danh mục theo id
    async getCategoryById(id: number): Promise<CategoryResponse> {
        const response = await api.get<ApiResponse<CategoryResponse>>(API_ENDPOINTS.CATEGORIES.BY_ID(id));
        return response.data.data;
    },

    // tạo mới category (ADMIN)
    async createCategory(newCategory: CreateCategoryRequest): Promise<CategoryResponse> {
        const response = await api.post<ApiResponse<CategoryResponse>>(API_ENDPOINTS.CATEGORIES.CREATE, newCategory);
        return response.data.data;
    },

    // cập nhật category (ADMIN)
    async updateCategory(id: number, updateCategory: UpdateCategoryRequest): Promise<CategoryResponse> {

        const response = await api.put<ApiResponse<CategoryResponse>>( API_ENDPOINTS.CATEGORIES.UPDATE(id), updateCategory);
        return response.data.data;
    },

    // xóa category (ADMIN)
    async deleteCategory(id: number): Promise<void> {
        const response = await api.delete<ApiResponse<string>>(API_ENDPOINTS.CATEGORIES.DELETE(id));
    },

    // lấy tổng số lượng categories
    async countCategories(): Promise<number> {
        const response = await api.get<ApiResponse<number>>(API_ENDPOINTS.CATEGORIES.TOTAL);
        return response.data.data;
    },

    // tìm kiếm categories theo tên
    async searchCategories(keywords: string): Promise<CategoryResponse[]> {
        const response = await api.get<ApiResponse<CategoryResponse[]>>(
            API_ENDPOINTS.CATEGORIES.SEARCH, {params : {keywords}}
        );
        return response.data.data;
    },

}