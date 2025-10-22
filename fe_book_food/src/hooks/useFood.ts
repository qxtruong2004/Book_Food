import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { RootState, AppDispatch } from "../store";
import {
  fetchAllFoodsAsync,
  fetchFoodsByCategoryAsync,
  fetchAllFoodsByAdminAsync,
  fetchFoodByIdAsync,
  searchFoodsAsync,
  createFoodAsync,
  updateFoodAsync,
  deleteFoodAsync,
  clearError,
  clearCurrentFood,
  clearSearchResults,
} from "../store/foodSlice";
import { CreateFoodRequest, UpdateFoodRequest, FoodSearchParams } from "../types/food";

export const useFood = () => {
  const dispatch = useDispatch<AppDispatch>();

  // state từ foodSlice
  const {
    foods,
    managerFood,
    categoryFoods,
    searchResults,
    currentFood,
    loading,
    error,
    createLoading,
    updateLoading,
    deleteLoading,
  } = useSelector((state: RootState) => state.food);

  // Lấy tất cả món ăn phía user
  const fetchAllFoods = useCallback(
    async (page = 0, size = 10) => {
      try {
        return await dispatch(fetchAllFoodsAsync({ page, size })).unwrap();
      } catch (err: any) {
        toast.error(err || "Failed to fetch foods");
        throw err;
      }
    },
    [dispatch]
  );

  //lấy tất cả món ăn phía admin
  const fetchAllFoodsAdmin = useCallback(
    async (page = 0, size = 10) => {
      try {
        return await dispatch(fetchAllFoodsByAdminAsync({ page, size })).unwrap();
       
      }
      catch (err: any) {
        toast.error(err || "Failed to fetch foods");
        throw err;
      }
    }, [dispatch]
  )

  // Lấy món ăn theo category
  const fetchFoodsByCategory = useCallback(
    async (categoryId: number, page = 0, size = 10) => {
      try {
        const result = await dispatch(fetchFoodsByCategoryAsync({ categoryId, page, size })).unwrap();
        console.log("Foods fetched:", result);

      } catch (err: any) {
        toast.error(err || "Failed to fetch foods by category");
        throw err;
      }
    },
    [dispatch]
  );


  // Lấy món ăn theo id
  const fetchFoodById = useCallback(
    async (id: number) => {
      try {
        return await dispatch(fetchFoodByIdAsync(id)).unwrap();
      } catch (err: any) {
        toast.error(err || "Failed to fetch food");
        throw err;
      }
    },
    [dispatch]
  );

  // Tìm kiếm món ăn
  const searchFoods = useCallback(async (params: FoodSearchParams) => {
    try {
      return await dispatch(searchFoodsAsync(params)).unwrap(); // sẽ là [] nếu rỗng
    } catch (err: any) {
      toast.error(err || "Failed to search foods");
      return [];
    }
  }, [dispatch]);


  // Tạo món ăn
  const createFood = useCallback(
    async (request: CreateFoodRequest) => {
      try {
        const result = await dispatch(createFoodAsync(request)).unwrap();
        toast.success("Food created successfully");
        return result;
      } catch (err: any) {
        toast.error(err || "Failed to create food");
        throw err;
      }
    },
    [dispatch]
  );

  // Cập nhật món ăn
  const updateFood = useCallback(
    async (id: number, request: UpdateFoodRequest) => {
      try {
        const result = await dispatch(updateFoodAsync({ id, request })).unwrap();
        toast.success("Food updated successfully");
        return result;
      } catch (err: any) {
        toast.error(err || "Failed to update food");
        throw err;
      }
    },
    [dispatch]
  );

  // Xóa món ăn
  const deleteFood = useCallback(
    async (id: number) => {
      try {
        await dispatch(deleteFoodAsync(id)).unwrap();
        toast.success("Food deleted successfully");
      } catch (err: any) {
        toast.error(err || "Failed to delete food");
        throw err;
      }
    },
    [dispatch]
  );

  // Clear error
  const clearFoodError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear current food
  const clearSelectedFood = useCallback(() => {
    dispatch(clearCurrentFood());
  }, [dispatch]);

  // Clear search results
  const clearFoodSearchResults = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  return {
    // state
    foods,
    managerFood,
    categoryFoods,
    searchResults,
    currentFood,
    loading,
    error,
    createLoading,
    updateLoading,
    deleteLoading,

    // actions
    fetchAllFoods,
    fetchFoodsByCategory,
    fetchAllFoodsAdmin,
    fetchFoodById,
    searchFoods,
    createFood,
    updateFood,
    deleteFood,
    clearFoodError,
    clearSelectedFood,
    clearFoodSearchResults,
  };
};
