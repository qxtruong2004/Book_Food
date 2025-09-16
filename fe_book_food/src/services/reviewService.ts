import { ca } from "zod/v4/locales";
import { CreateReviewRequest, FoodRatingSummaryResponse, Review, UpdateReviewRequest } from "../types/review";
import { API_ENDPOINTS, TOKEN_KEY } from "../utils/constants"
import { api, ApiResponse } from "./api";
export const reviewService = {
    //xem review
    async getReviewsByFoodId(foodId: number, page = 0, size = 10): Promise<Review[]> {
        const response = await api.get<ApiResponse<Review[]>>(API_ENDPOINTS.REVIEWS.BY_FOOD(foodId), {params: {page, size}});
        return response.data.data;
    },

    //tạo review
    async createReview(review: CreateReviewRequest): Promise<Review | null> {
        try {
            const response = await api.post<ApiResponse<Review>>(API_ENDPOINTS.REVIEWS.CREATE, review);
            return response.data.data;
        }
        catch (error) {
            console.error("Create review error: ", error);
            return null;
        }
    },

    //xóa review
    async deleteReview(reviewId: number): Promise<void> {
        try {
            const response = await api.delete<ApiResponse<void>>(`${API_ENDPOINTS.REVIEWS.DELETE}/${reviewId}`);
        } catch (error) {
            console.error("Create review error: ", error);
        }
    },

    //lấy review theo user
    async getReviewsByUserId(userId: number, page = 0, size = 10): Promise<Review[] | null> {

        try {
            const response = await api.get<ApiResponse<Review[]>>(`${API_ENDPOINTS.REVIEWS.BY_USER}/${userId}`);
            return response.data.data;
        }
        catch (error) {
            console.error("Create review error: ", error);
            return null;
        }
    }, 
    
    // Lấy reviews của chính mình
    async getMyReviews(): Promise<Review[]>{
        const response = await api.get<ApiResponse<Review[]>>(
            API_ENDPOINTS.REVIEWS.MY_REVIEWS);
        return response.data.data;
    },

    // Lấy tổng quan review của 1 món ăn
    async getFoodReviewSummary(foodId: number): Promise<FoodRatingSummaryResponse>{
        const response = await api.get<ApiResponse<FoodRatingSummaryResponse>>(
            API_ENDPOINTS.REVIEWS.SUMMARY_BY_FOOD(foodId)
        );
        return response.data.data;
    },

    // Cập nhật review
    async updateReview(reviewId: number, updateReviewRequest: UpdateReviewRequest): Promise<Review>{
        const response = await api.put<ApiResponse<Review>>(
            API_ENDPOINTS.REVIEWS.UPDATE(reviewId),
            updateReviewRequest);

        return response.data.data;
    }
}