import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { foodService } from "../services/foodService";
import {
    FoodResponse,
    CreateFoodRequest,
    UpdateFoodRequest,
    FoodSearchParams,
    Food,
} from "../types/food";
import { Page } from "../types/page";

interface FoodState {
    foods: Food[];
    categoryFoods: Page<FoodResponse> | null;
    managerFood: Page<FoodResponse> | null;
    searchResults: Page<FoodResponse> | null;
    currentFood: FoodResponse | null;
    loading: boolean;
    error: string | null;
    createLoading: boolean;
    updateLoading: boolean;
    deleteLoading: boolean;
}

const initialState: FoodState = {
    foods: [],
    categoryFoods: null,
    searchResults: null,
    managerFood: null,
    currentFood: null,
    loading: false,
    error: null,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
};

// --- Async thunks ---

// Lấy tất cả món ăn phía user
export const fetchAllFoodsAsync = createAsyncThunk(
    "food/fetchAllFoods",
    async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
        try {
            const foods = await foodService.getAllFoods(page, size);
            if (!foods) throw new Error("No foods found");
            return foods;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch foods");
        }
    }
);

//lấy tất cả món ăn phía admin
export const fetchAllFoodsByAdminAsync = createAsyncThunk("foods/fetchAllFoodsByAdmin",
    async ({ page = 0, size = 10 }: { page?: number, size?: number }, { rejectWithValue }) => {
        try {
            const result = await foodService.getAllFoodsByAdmin(page, size);
            if (!result?.content || result.content.length === 0) {
                return { ...result, content: [] };  // Giữ Page nhưng empty
            }
            return result;
        }
        catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch foods");
        }
    }
)

// Lấy món ăn theo category
export const fetchFoodsByCategoryAsync = createAsyncThunk(
    "food/fetchFoodsByCategory",
    async (
        { categoryId, page = 0, size = 10 }: { categoryId: number; page?: number; size?: number },
        { rejectWithValue }
    ) => {
        try {
            const categoryFoods = await foodService.getFoodsByCategory(categoryId, page, size);
            if (!categoryFoods) throw new Error("No foods found for category");
            return categoryFoods;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch foods by category");
        }
    }
);

// Lấy món ăn theo id
export const fetchFoodByIdAsync = createAsyncThunk(
    "food/fetchFoodById",
    async (id: number, { rejectWithValue }) => {
        try {
            const food = await foodService.getFoodById(id);
            if (!food) throw new Error("Food not found");
            return food;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch food");
        }
    }
);

// Tìm kiếm món ăn
export const searchFoodsAsync = createAsyncThunk<
    Page<FoodResponse> | null,                // payload type khi fulfilled
    FoodSearchParams,              // tham số đầu vào
    { rejectValue: string }        // type khi reject
>(
    "food/searchFoods",
    async (params, { rejectWithValue }) => {
        try {
            const results = await foodService.searchFoods(params);
            // ✅ coi null/undefined là; không có kết quả -> mảng rỗng
            return results ?? null;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to search foods");
        }
    }
);


// Thêm món ăn
export const createFoodAsync = createAsyncThunk(
    "food/createFood",
    async (request: CreateFoodRequest, { rejectWithValue }) => {
        try {
            const food = await foodService.createFood(request);
            if (!food) throw new Error("Failed to create food");
            return food;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to create food");
        }
    }
);

// Cập nhật món ăn
export const updateFoodAsync = createAsyncThunk(
    "food/updateFood",
    async ({ id, request }: { id: number; request: UpdateFoodRequest }, { rejectWithValue }) => {
        try {
            const food = await foodService.updateFood(id, request);
            if (!food) throw new Error("Failed to update food");
            return food;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update food");
        }
    }
);

// Xóa món ăn
export const deleteFoodAsync = createAsyncThunk(
    "food/deleteFood",
    async (id: number, { rejectWithValue }) => {
        try {
            const result = await foodService.deleteFood(id);
            if (!result) throw new Error("Failed to delete food");
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to delete food");
        }
    }
);

//lấy tất cả món ăn + phân trang
// export const searchFoodAdmin = createAsyncThunk(
//     "foods/searchFoods",
//     async(params: )
// )

// --- Slice ---
const foodSlice = createSlice({
    name: "food",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentFood: (state) => {
            state.currentFood = null;
        },
        clearSearchResults: (state) => {
            state.searchResults = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch all foods by user
        builder
            .addCase(fetchAllFoodsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllFoodsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.foods = action.payload || [];
            })
            .addCase(fetchAllFoodsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        //lấy tất cả món ăn phía admin
        builder
            .addCase(fetchAllFoodsByAdminAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllFoodsByAdminAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.managerFood = action.payload;
            })
            .addCase(fetchAllFoodsByAdminAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch foods by category
        builder.addCase(fetchFoodsByCategoryAsync.fulfilled, (state, action) => {
            state.categoryFoods = action.payload;
        });

        // Fetch food by id
        builder.addCase(fetchFoodByIdAsync.fulfilled, (state, action) => {
            state.currentFood = action.payload;
        });

        //search food
        builder
            .addCase(searchFoodsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchFoodsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.managerFood = action.payload; // có thể là []
            })
            .addCase(searchFoodsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) ?? "Failed to search foods";
            });


        // Create food
        builder
            .addCase(createFoodAsync.pending, (state) => {
                state.createLoading = true;
            })
            .addCase(createFoodAsync.fulfilled, (state, action) => {
                state.createLoading = false;
                state.foods.unshift(action.payload);
            })
            .addCase(createFoodAsync.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload as string;
            });

        // Update food
        builder
            .addCase(updateFoodAsync.pending, (state) => {
                state.updateLoading = true;
            })
            .addCase(updateFoodAsync.fulfilled, (state, action) => {
                state.updateLoading = false;

                // Map sang Food để update list
                const updated: Food = {
                    id: action.payload.id,
                    name: action.payload.name,
                    price: action.payload.price,
                    image: action.payload.imageUrl,
                };

                const idx = state.foods.findIndex((f) => f.id === action.payload.id);
                if (idx !== -1) state.foods[idx] = updated;
                // Update currentFood đầy đủ (FoodResponse)
                if (state.currentFood?.id === action.payload.id) {
                    state.currentFood = action.payload;
                }
            })
            .addCase(updateFoodAsync.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload as string;
            });

        // Delete food
        builder
            .addCase(deleteFoodAsync.pending, (state) => {
                state.deleteLoading = true;
            })
            .addCase(deleteFoodAsync.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.foods = state.foods.filter((f) => f.id !== action.payload);
                if (!state.categoryFoods) return;

                const idToRemove = action.payload;
                state.categoryFoods.content = state.categoryFoods.content?.filter((f) => f.id !== idToRemove) ?? [];
                if (state.currentFood?.id === action.payload) {
                    state.currentFood = null;
                }
            })
            .addCase(deleteFoodAsync.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearCurrentFood, clearSearchResults } = foodSlice.actions;
export default foodSlice.reducer;
