import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from "../types/category";
import { categoryService } from "../services/categoryService";

interface CategoryState {
  categories: CategoryResponse[];              // danh sách tất cả categories (list, search)
  currentCategory: CategoryResponse | null;    // chi tiết category đang xem/chỉnh sửa
  total: number;
  loading: boolean;                           // loading chung khi fetch dữ liệu
  createLoading: boolean;                     // loading riêng khi tạo mới
  updateLoading: boolean;                     // loading riêng khi update
  error: string | null;                       // lưu lỗi nếu API fail
}

//trạng thái mặc định khi web khởi động => Sau khi gọi API → Redux sẽ cập nhật lại các field này.
const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  total: 0,
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
};

//async thunks
export const getAllCategoriesAsync = createAsyncThunk('category/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const categories = await categoryService.getAllCategories();
      return categories;
    }
    catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const getCategoryByIdAsync = createAsyncThunk('category/categoryID',
  async (id: number, { rejectWithValue }) => {
    try {
      const category = await categoryService.getCategoryById(id);
      return category;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category');
    }
  }
);

export const createCategoryAsync = createAsyncThunk(
  'category/createCategory',
  async (categoryData: CreateCategoryRequest, { rejectWithValue }) => {
    try {
      const category = await categoryService.createCategory(categoryData);
      return category;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const updateCategoryAsync = createAsyncThunk(
  'category/updateCategory',
  async (params: { id: number; categoryData: UpdateCategoryRequest }, { rejectWithValue }) => {
    try {
      const { id, categoryData } = params;
      const category = await categoryService.updateCategory(id, categoryData);
      return category;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  'category/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(id);
      return id;  // Trả về id để reducer có thể xóa luôn phần tử trong state
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

export const countCategoriesAsync = createAsyncThunk(
  'category/totalCategory',
  async (_, { rejectWithValue }) => {
    try {
      const total = await categoryService.countCategories();
      return total;
    }
    catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to count category');
    }
  }
)

export const searchCategoriesAsync = createAsyncThunk(
  'category/search',
  async (keywords: string, { rejectWithValue }) => {
    try {
      const categories = await categoryService.searchCategories(keywords);
      return categories;
    }
    catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search categories"');
    }
  }
)

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
  },

  extraReducers: (builder) => {
    //getAll category
    builder
      .addCase(getAllCategoriesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategoriesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.content; // <-- lấy mảng CategoryResponse
        state.total = action.payload.totalElements; // <-- cập nhật thêm tổng số lượng nếu cần
        state.error = null;
      })
      .addCase(getAllCategoriesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch category by ID
    builder
      .addCase(getCategoryByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
        state.error = null;
      })
      .addCase(getCategoryByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create category
    builder
      .addCase(createCategoryAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        state.createLoading = false;
        state.categories.unshift(action.payload);
        state.error = null;
      })
      .addCase(createCategoryAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload as string;
      });

    // Update category
    builder
      .addCase(updateCategoryAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        state.updateLoading = false;

        // Update in categories array
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }

        // Update current category
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCategoryAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });

    // Delete category
    builder
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.updateLoading = false;
        //Cập nhật lại danh sách categories bằng cách filter bỏ category có id bằng action.payload
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
        if (state.currentCategory?.id === action.payload) {
          state.currentCategory = null;
        }
        state.error = null;
      })
      .addCase(deleteCategoryAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });

    //count
    builder
      .addCase(countCategoriesAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(countCategoriesAsync.fulfilled, (state, action) => {
        state.updateLoading = false;
        //action.payload chính là con số (số lượng categories) bạn đã return từ countCategoriesAsync.
        state.total = action.payload;
        state.error = null;
      })
      .addCase(countCategoriesAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });

    //search
    builder
      .addCase(searchCategoriesAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(searchCategoriesAsync.fulfilled, (state, action) => {
        state.updateLoading = false;
        // action.payload chính là mảng CategoryResponse[] trả về từ API search
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(searchCategoriesAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });
  },
});
export const {
  clearError,
  clearCurrentCategory,
  setCurrentCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
