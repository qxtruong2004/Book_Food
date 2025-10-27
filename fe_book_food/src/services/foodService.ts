import axios from "axios";
import { CreateFoodRequest, Food, FoodResponse, FoodSearchParams, UpdateFoodRequest } from "../types/food";
import { API_ENDPOINTS } from "../utils/constants";
import { api, ApiResponse } from "./api";
import { Page } from "../types/page";

export const foodService = {
    //lấy tất cả món ăn có phân trang phía admin
    async getAllFoodsByAdmin(page = 0, size = 10): Promise<Page<FoodResponse>> {
        const res = await api.get<ApiResponse<any>>(API_ENDPOINTS.FOODS.ALL, { params: { page, size } });

        const payload = res.data.data;
        return payload;
    },

    // Lấy tất cả món ăn, phân trang
    async getAllFoods(page = 0, size = 10): Promise<Food[] | null> {
        try {
            const response = await api.get<ApiResponse<FoodResponse[]>>(
                API_ENDPOINTS.FOODS.ALL, { params: { page, size } }
            );
            // map sang type Food để UI dùng dễ hơn
            return response.data.data.map((f) => ({
                id: f.id,
                name: f.name,
                price: f.price,
                image: f.imageUrl, // ✅ đổi tên để hợp với FoodCard
            }));
        } catch (error) {
            console.error("FoodService error (getAllFoods):", error);
            return null;
        }
    },

    // Lấy món ăn theo categoryId, phân trang
    async getFoodsByCategory(categoryId: number, page = 0, size = 10): Promise<Page<FoodResponse> | null> {
        try {
            const response = await api.get<ApiResponse<Page<FoodResponse>>>(
                API_ENDPOINTS.FOODS.BY_CATEGORY(categoryId), { params: { page, size } }
            );
            const payload = response.data.data;
        return payload;
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
            const f = response.data.data;
            return response.data.data;
        } catch (error) {
            console.error("FoodService error (getFoodById):", error);
            return null;
        }
    },

    // Tìm kiếm món ăn
    async searchFoods(request: FoodSearchParams): Promise<Page<FoodResponse> | null> {
        try {
            const response = await api.get<ApiResponse<Page<FoodResponse>>>(
                API_ENDPOINTS.FOODS.SEARCH, { params: request }
            );
            return response.data.data; // ✅ luôn là mảng
        } catch (error) {
            // Nếu backend trả 404/“No search results” -> coi như []
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const msg = String(error.response?.data?.message ?? "").toLowerCase();
                if (status === 404 || msg.includes("no search results")) {
                    return null;
                }
            }
            // Lỗi thật mới ném ra
            throw error;
        }
    },


    // Thêm món ăn (ADMIN)
    async createFood(request: CreateFoodRequest): Promise<Food | null> {
        try {
            const response = await api.post<ApiResponse<FoodResponse>>(
                API_ENDPOINTS.FOODS.CREATE,
                request
            );
            const f = response.data.data;
            return {
                id: f.id,
                name: f.name,
                price: f.price,
                image: f.imageUrl, // map luôn ở service
            };
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
            const f = response.data.data;
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