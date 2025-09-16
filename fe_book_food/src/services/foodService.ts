import { CreateFoodRequest, FoodResponse, FoodSearchParams, UpdateFoodRequest } from "../types/food";
import { API_ENDPOINTS } from "../utils/constants";
import { api, ApiResponse } from "./api";

export const foodService = {
    // Lấy tất cả món ăn, phân trang
    async getAllFoods(page = 0, size = 10): Promise<FoodResponse[] | null> {
        try {
            const response = await api.get<ApiResponse<FoodResponse[]>>(
                API_ENDPOINTS.FOODS.ALL, {params : {page, size}}
            );
            return response.data.data;
        } catch (error) {
            console.error("FoodService error (getAllFoods):", error);
            return null;
        }
    },

    // Lấy món ăn theo categoryId, phân trang
    async getFoodsByCategory(categoryId: number,page = 0,size = 10): Promise<FoodResponse[] | null> {
        try {
            const response = await api.get<ApiResponse<FoodResponse[]>>(
                API_ENDPOINTS.FOODS.BY_CATEGORY(categoryId), {params : {page, size}}
            );
            return response.data.data;
        } catch (error) {
            console.error("FoodService error (getFoodsByCategory):", error);
            return null;
        }
    },

    // Lấy món ăn theo id
    async getFoodById(id: number): Promise<FoodResponse | null> {
        try {
            const response = await api.get<ApiResponse<FoodResponse>>(
                API_ENDPOINTS.FOODS.BY_ID(id)
            );
            return response.data.data;
        } catch (error) {
            console.error("FoodService error (getFoodById):", error);
            return null;
        }
    },

    // Tìm kiếm món ăn
    async searchFoods(request: FoodSearchParams): Promise<FoodResponse[] | null> {
        try {
            const response = await api.get<ApiResponse<FoodResponse[]>>(
                API_ENDPOINTS.FOODS.SEARCH, {params : {request}}
            );
            return response.data.data;
        } catch (error) {
            console.error("FoodService error (searchFoods):", error);
            return null;
        }
    },

    // Thêm món ăn (ADMIN)
    async createFood(request: CreateFoodRequest): Promise<FoodResponse | null> {
        try {
            const response = await api.post<ApiResponse<FoodResponse>>(
                API_ENDPOINTS.FOODS.CREATE,
                request
            );
            return response.data.data;
        } catch (error) {
            console.error("FoodService error (createFood):", error);
            return null;
        }
    },

    // Cập nhật món ăn (ADMIN)
    async updateFood(id: number, request: UpdateFoodRequest): Promise<FoodResponse | null> {
        try {
            const response = await api.put<ApiResponse<FoodResponse>>(
                API_ENDPOINTS.FOODS.UPDATE(id),
                request
            );
            return response.data.data;
        } catch (error) {
            console.error("FoodService error (updateFood):", error);
            return null;
        }
    },

    // Xóa món ăn (ADMIN)
    async deleteFood(id: number): Promise<string | null> {
        try {
            const response = await api.delete<ApiResponse<string>>(
                API_ENDPOINTS.FOODS.DELETE(id)
            );
            return response.data.data;
        } catch (error) {
            console.error("FoodService error (deleteFood):", error);
            return null;
        }
    },
}