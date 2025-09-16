import { FoodResponse } from "./food";
import { OrderResponse } from "./order";
import {  UserResponse } from "./user";

export interface Review{
    id: number;
    food: FoodResponse;
    user: UserResponse;
    order: OrderResponse;
    rating: number;
    commet?: string;
    createdAt: string;
}

export interface CreateReviewRequest{
    foodId: number;
    rating: number;
    orderId: number;
    comment?: string;
}

export interface UpdateReviewRequest{
    comment: string;
    rating: number;
}

export interface FoodRatingSummaryResponse {
  averageRating: number;
  totalReviews: number;
  // ... các field bạn định nghĩa trong FoodRatingSummaryRespone
}