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

export interface UpdateReivewRequest{
    comment: string;
    rating: number;
}