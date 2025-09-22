import { CategoryResponse } from "./category";
export interface Food{
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    prepartationTime: number;
    rating: number;
    category: CategoryResponse;
    createdAt: string;
    updatedAt: string;
}

export interface CreateFoodRequest{
    name: string;
    description?: string; //thuôc tính? : tùy chọn( kh bắt buộc)
    price: number;
    imageUrl?: string;
    categoryId: number;
    preparationTime: number;
}

export interface UpdateFoodRequest{
    name: string;
    description?: string; //thuôc tính? : tùy chọn( kh bắt buộc)
    price: number;
    imageUrl?: string;
    categoryId: number;
    preparationTime: number;
    isAvailable?: boolean;
}

export interface FoodSearchParams{
    keyword?: string;
    categoryId? : number;
    minPrice? : number;
    maxPrice?: number;
    page?: number;
    size?: number;
}

// DTO trả về từ backend
export interface FoodResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  preparationTime: number;
  rating: number;
  category: CategoryResponse;
  createdAt: string;  // LocalDateTime -> string
  updatedAt: string;  // LocalDateTime -> string
}

export interface FoodRatingSummaryResponse{
    averageRating: number;
    totalReviews: number;
}

