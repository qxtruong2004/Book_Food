import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewService } from '../services/reviewService';
import { ReviewResponse, CreateReviewRequest, UpdateReviewRequest, FoodRatingSummaryResponse } from '../types/review';

interface ReviewState {
    reviews: ReviewResponse[];
    userReviews: ReviewResponse[];
    foodReviews: ReviewResponse[];
    currentReview: ReviewResponse | null;
    loading: boolean;
    error: string | null;
    createLoading: boolean;
    updateLoading: boolean;
    totalPages: number;
    currentPage: number;
    foodSummary: FoodRatingSummaryResponse | null;
}

const initialState: ReviewState = {
    reviews: [],
    userReviews: [],
    foodReviews: [],
    currentReview: null,
    loading: false,
    error: null,
    createLoading: false,
    updateLoading: false,
    totalPages: 0,
    currentPage: 0,
    foodSummary: null,
};

// Async thunks
export const fetchReviewsByFoodAsync = createAsyncThunk(
    'review/fetchReviewsByFood',
    async ({ foodId, page = 0, size = 10 }: { foodId: number; page?: number; size?: number }, { rejectWithValue }) => {
        try {
            const reviews = await reviewService.getReviewsByFoodId(foodId, page, size);
            if (!reviews) throw new Error('No reviews found');
            return { reviews, page, foodId };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch reviews');
        }
    }
);

export const fetchUserReviewsAsync = createAsyncThunk(
    'review/fetchUserReviews',
    async ({ userId, page = 0, size = 10 }: { userId: number; page?: number; size?: number }, { rejectWithValue }) => {
        try {
            const reviews = await reviewService.getReviewsByUserId(userId, page, size);
            if (!reviews) throw new Error('No reviews found');
            return { reviews, page };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch user reviews');
        }
    }
);

export const fetchMyReviewsAsync = createAsyncThunk(
    'review/fetchMyReviews',
    async (_, { rejectWithValue }) => {
        try {
            const reviews = await reviewService.getMyReviews();
            if (!reviews) throw new Error('No reviews found');
            return reviews;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch my reviews');
        }
    }
);

export const createReviewAsync = createAsyncThunk(
    'review/createReview',
    async (reviewData: CreateReviewRequest, { rejectWithValue }) => {
        try {
            const review = await reviewService.createReview(reviewData);
            if (!review) throw new Error('Failed to create review');
            return review;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create review');
        }
    }
);

export const updateReviewAsync = createAsyncThunk(
    'review/updateReview',
    async (params: { reviewId: number, updateReview: UpdateReviewRequest }, { rejectWithValue }) => {
        try {
            const { reviewId, updateReview } = params;
            const review = await reviewService.updateReview(reviewId, updateReview);
            return review;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update review');
        }
    }
);

export const deleteReviewAsync = createAsyncThunk(
    'review/deleteReview',
    async (reviewId: number, { rejectWithValue }) => {
        try {
            await reviewService.deleteReview(reviewId);
            return reviewId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete review');
        }
    }
);

export const fetchFoodSummaryAsync = createAsyncThunk(
    'review/fetchFoodSummary',
    async (foodId: number, { rejectWithValue }) => {
        try {
            const stats = await reviewService.getFoodReviewSummary(foodId);
            return stats;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch food summary');
        }
    }
);

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentReview: (state) => {
            state.currentReview = null;
        },
        clearFoodReviews: (state) => {
            state.foodReviews = [];
        },
        clearUserReviews: (state) => {
            state.userReviews = [];
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch reviews by food
        builder
            .addCase(fetchReviewsByFoodAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviewsByFoodAsync.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.page === 0) {
                    state.foodReviews = action.payload.reviews;
                } else {
                    state.foodReviews = [...state.foodReviews, ...action.payload.reviews];
                }
                state.currentPage = action.payload.page;
            })
            .addCase(fetchReviewsByFoodAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch user reviews
        builder
            .addCase(fetchUserReviewsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserReviewsAsync.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.page === 0) {
                    state.userReviews = action.payload.reviews;
                } else {
                    state.userReviews = [...state.userReviews, ...action.payload.reviews];
                }
            })
            .addCase(fetchUserReviewsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch my reviews
        builder
            .addCase(fetchMyReviewsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyReviewsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload; 
                
            })
            .addCase(fetchMyReviewsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                
            });

        // Create review
        builder
            .addCase(createReviewAsync.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createReviewAsync.fulfilled, (state, action) => {
                state.createLoading = false;
                state.reviews.unshift(action.payload);
                state.userReviews.unshift(action.payload);
                state.foodReviews.unshift(action.payload);
            })
            .addCase(createReviewAsync.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload as string;
            });

        // Update review
        builder
            .addCase(updateReviewAsync.fulfilled, (state, action) => {
                const updateReviewInArray = (array: ReviewResponse[]) => {
                    const index = array.findIndex(r => r.id === action.payload.id);
                    if (index !== -1) array[index] = action.payload;
                };
                updateReviewInArray(state.reviews);
                updateReviewInArray(state.userReviews);
                updateReviewInArray(state.foodReviews);
                if (state.currentReview?.id === action.payload.id) {
                    state.currentReview = action.payload;
                }
            });

        // Delete review
        builder
            .addCase(deleteReviewAsync.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter(r => r.id !== action.payload);
                state.userReviews = state.userReviews.filter(r => r.id !== action.payload);
                state.foodReviews = state.foodReviews.filter(r => r.id !== action.payload);
                if (state.currentReview?.id === action.payload) {
                    state.currentReview = null;
                }
            });

        // Fetch food summary
        builder
            .addCase(fetchFoodSummaryAsync.fulfilled, (state, action) => {
                state.foodSummary = action.payload;
            });
    },
});

export const {
    clearError,
    clearCurrentReview,
    clearFoodReviews,
    clearUserReviews,
    setCurrentPage,
} = reviewSlice.actions;

export default reviewSlice.reducer;
