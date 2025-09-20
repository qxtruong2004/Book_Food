import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { RootState, AppDispatch } from "../store";
import {
    getAllCategoriesAsync,
    getCategoryByIdAsync,
    createCategoryAsync,
    updateCategoryAsync,
    deleteCategoryAsync,
    countCategoriesAsync,
    searchCategoriesAsync,
    clearError,
    clearCurrentCategory,
    setCurrentCategory,
} from "../store/categorySlice";
import { CreateCategoryRequest, UpdateCategoryRequest } from "../types/category";

export const useCategory = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Lấy state từ slice
    const {
        categories,
        currentCategory,
        total,
        loading,
        createLoading,
        updateLoading,
        error,
    } = useSelector((state: RootState) => state.category);

    // Lấy tất cả categories
    const getAllCategories = useCallback(async () => {
        try {
            return await dispatch(getAllCategoriesAsync()).unwrap();
        } catch (err: any) {
            toast.error(err || "Failed to fetch categories");
            throw err;
        }
    }, [dispatch]);

    // Lấy category theo ID
    const getCategoryById = useCallback(
        async (id: number) => {
            try {
                return await dispatch(getCategoryByIdAsync(id)).unwrap();
            } catch (err: any) {
                toast.error(err || "Failed to fetch category");
                throw err;
            }
        },
        [dispatch]
    );

    // Tạo category mới
    const createCategory = useCallback(
        async (data: CreateCategoryRequest) => {
            try {
                const result = await dispatch(createCategoryAsync(data)).unwrap();
                toast.success("Category created successfully");
                return result;
            } catch (err: any) {
                toast.error(err || "Failed to create category");
                throw err;
            }
        },
        [dispatch]
    );

    // Cập nhật category
    const updateCategory = useCallback(
        async (id: number, data: UpdateCategoryRequest) => {
            try {
                const result = await dispatch(
                    updateCategoryAsync({ id, categoryData: data })
                ).unwrap();
                toast.success("Category updated successfully");
                return result;
            } catch (err: any) {
                toast.error(err || "Failed to update category");
                throw err;
            }
        },
        [dispatch]
    );

    // Xóa category
    const deleteCategory = useCallback(
        async (id: number) => {
            try {
                await dispatch(deleteCategoryAsync(id)).unwrap();
                toast.success("Category deleted successfully");
            } catch (err: any) {
                toast.error(err || "Failed to delete category");
                throw err;
            }
        },
        [dispatch]
    );

    // Đếm số category
    const countCategories = useCallback(async () => {
        try {
            return await dispatch(countCategoriesAsync()).unwrap();
        } catch (err: any) {
            toast.error(err || "Failed to count categories");
            throw err;
        }
    }, [dispatch]);

    // Search category theo keywords
    const searchCategories = useCallback(
        async (keywords: string) => {
            try {
                return await dispatch(searchCategoriesAsync(keywords)).unwrap();
            } catch (err: any) {
                toast.error(err || "Failed to search categories");
                throw err;
            }
        },
        [dispatch]
    );

    // Clear error
    const clearCategoryError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Clear current category
    const clearSelectedCategory = useCallback(() => {
        dispatch(clearCurrentCategory());
    }, [dispatch]);

    // Set current category (thường dùng khi chọn category từ UI)
    const setSelectedCategory = useCallback(
        (category: any) => {
            dispatch(setCurrentCategory(category));
        },
        [dispatch]
    );

    return {
        // state
        categories,
        currentCategory,
        total,
        loading,
        createLoading,
        updateLoading,
        error,

        // actions
        getAllCategories,
        getCategoryById,
        createCategory,
        updateCategory,
        deleteCategory,
        countCategories,
        searchCategories,
        clearCategoryError,
        clearSelectedCategory,
        setSelectedCategory,
    };
};
