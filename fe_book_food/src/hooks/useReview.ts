import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useCallback } from "react";
import { createReviewAsync, deleteReviewAsync, fetchFoodSummaryAsync, fetchMyReviewsAsync, fetchReviewsByFoodAsync, fetchUserReviewsAsync, updateReviewAsync } from "../store/reviewSlice";
import { CreateReviewRequest, UpdateReviewRequest } from "../types/review";
import toast from "react-hot-toast";

export const useReview = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { reviews, userReviews, foodReviews, currentReview, loading, error, createLoading, updateLoading, totalPages, currentPage, foodSummary } = useSelector((state: RootState) => state.review);

    //getReviewsByFoodId
    const getReviewsByFoodId = useCallback(
        async (foodId: number, page = 0, size = 10) => {
            await dispatch(fetchReviewsByFoodAsync({ foodId, page, size })).unwrap();
        }, [dispatch]
    );
    // --- Get reviews by user ---
    const getReviewsByUserId = useCallback(
        async (userId: number, page = 0, size = 10) => {
            return await dispatch(
                fetchUserReviewsAsync({ userId, page, size })
            ).unwrap();
        },
        [dispatch]
    );

    // --- Get my reviews ---
    const getMyReviews = useCallback(async () => {
        return await dispatch(fetchMyReviewsAsync()).unwrap();
    }, [dispatch]);

    // --- Create review ---
    const createReview = useCallback(
        async (reviewData: CreateReviewRequest) => {
            try {
                const result = await dispatch(createReviewAsync(reviewData)).unwrap();
                toast.success("Review created successfully!");

                // Refresh list & summary cho món vừa đánh giá
                await dispatch(fetchReviewsByFoodAsync({ foodId: reviewData.foodId, page: 0, size: 10 })).unwrap();
                await dispatch(fetchFoodSummaryAsync(reviewData.foodId)).unwrap();
                return result;
            } catch (error: any) {
                toast.error(error?.message || "Failed to create review");
                throw error;
            }
        },
        [dispatch]
    );

    // --- Update review ---
    const updateReview = useCallback(
        async (reviewId: number, updateReview: UpdateReviewRequest) => {
            try {
                const result = await dispatch(
                    updateReviewAsync({ reviewId, updateReview })
                ).unwrap();
                toast.success("Review updated successfully!");
                return result;
            } catch (error: any) {
                toast.error(error?.message || "Failed to update review");
                throw error;
            }
        },
        [dispatch]
    );

    // --- Delete review ---
    const deleteReview = useCallback(
        async (reviewId: number) => {
            try {
                await dispatch(deleteReviewAsync(reviewId)).unwrap();
                toast.success("Review deleted successfully!");
            } catch (error: any) {
                toast.error(error?.message || "Failed to delete review");
                throw error;
            }
        },
        [dispatch]
    );

    // --- Get food review summary ---
    const getFoodSummary = useCallback(
        async (foodId: number) => {
            return await dispatch(fetchFoodSummaryAsync(foodId)).unwrap();
        },
        [dispatch]
    );

    return {
        // State
        reviews,
        userReviews, foodReviews, currentReview, loading, error, createLoading, updateLoading, totalPages, currentPage, foodSummary,

        // Actions
        getReviewsByFoodId,
        getReviewsByUserId,
        getMyReviews,
        createReview,
        updateReview,
        deleteReview,
        getFoodSummary,
    };
}