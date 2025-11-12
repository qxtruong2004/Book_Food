import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { RootState, AppDispatch } from "../store";
import {
  fetchOrdersAsync,
  fetchOrdersByUserAsync,
  fetchMyOrdersAsync,
  fetchOrderByIdAsync,
  fetchMyOrderAsync,
  fetchOrdersByDaysAsync,
  createOrderAsync,
  cancelOrderAsync,
  updateOrderStatusAsync,
  fetchTotalRevenueAsync,
  clearError,
  clearCurrentOrder,
} from "../store/orderSlice";
import { CreateOrderRequest, OrderStatus, StatisticsOrders } from "../types/order";

export const useOrder = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Lấy state từ slice
  const {
    orders,
    userOrders,
    myOrders,
    currentOrder,
    totalRevenue,
    loading,
    error,
    createLoading,
    updateLoading,
    cancelLoading,
  } = useSelector((state: RootState) => state.order);

  // Fetch all orders (Admin)
  const fetchOrders = useCallback(
    async (status?: OrderStatus, page = 0, size = 10) => {
      try {
        return await dispatch(fetchOrdersAsync({ status, page, size })).unwrap();
      } catch (err: any) {
        toast.error(err || "Failed to fetch orders");
        throw err;
      }
    },
    [dispatch]
  );

  // Fetch orders by user (Admin)
  const fetchOrdersByUser = useCallback(
    async (userId: number, page = 0, size = 10) => {
      try {
        return await dispatch(fetchOrdersByUserAsync({ userId, page, size })).unwrap();
      } catch (err: any) {
        toast.error(err || "Failed to fetch orders by user");
        throw err;
      }
    },
    [dispatch]
  );

  // Fetch my orders (User)
  const fetchMyOrders = useCallback(
    async (page = 0, size = 10) => {
      try {
        return await dispatch(fetchMyOrdersAsync({ page, size })).unwrap();
      } catch (err: any) {
        toast.error(err || "Failed to fetch my orders");
        throw err;
      }
    },
    [dispatch]
  );

  // Fetch order detail (Admin)
  const fetchOrderById = useCallback(
    async (orderId: number) => {
      try {
        return await dispatch(fetchOrderByIdAsync(orderId)).unwrap();
      } catch (err: any) {
        toast.error(err || "Failed to fetch order detail");
        throw err;
      }
    },
    [dispatch]
  );

  // Fetch my order detail (User)
  const fetchMyOrder = useCallback(
    async (orderId: number) => {
      try {
        return await dispatch(fetchMyOrderAsync(orderId)).unwrap();
      } catch (err: any) {
        toast.error(err || "Failed to fetch my order detail");
        throw err;
      }
    },
    [dispatch]
  );

  // Create order
  const createOrder = useCallback(
    async (request: CreateOrderRequest, userId?: number) => {
      try {
        const result = await dispatch(createOrderAsync({ request, userId })).unwrap();
        toast.success("Order created successfully");
        return result;
      } catch (err: any) {
        toast.error(err || "Failed to create order");
        throw err;
      }
    },
    [dispatch]
  );

  // Cancel order
  const cancelOrder = useCallback(
    async (orderId: number) => {
      try {
        await dispatch(cancelOrderAsync(orderId)).unwrap();
        toast.success("Order cancelled successfully");
      } catch (err: any) {
        toast.error(err || "Failed to cancel order");
        throw err;
      }
    },
    [dispatch]
  );

  // Update order status (Admin)
  const updateOrderStatus = useCallback(
    async (orderId: number, status: OrderStatus) => {
      try {
        const result = await dispatch(updateOrderStatusAsync({ orderId, status })).unwrap();
        toast.success("Order status updated successfully");
        return result;
      } catch (err: any) {
        toast.error(err || "Failed to update order status");
        throw err;
      }
    },
    [dispatch]
  );

  // Fetch total revenue (Admin)
  const fetchTotalRevenue = useCallback(
    async (startDate: string, endDate: string) => {
      try {
        return await dispatch(fetchTotalRevenueAsync({ startDate, endDate })).unwrap();
      } catch (err: any) {
        toast.error(err || "Failed to fetch total revenue");
        throw err;
      }
    },
    [dispatch]
  );

  //fetch orders by days
   const fetchOrdersByDays = useCallback(
    async (params: StatisticsOrders) => {
      try {
        return await dispatch(fetchOrdersByDaysAsync( params)).unwrap();
      } catch (err: any) {
        toast.error(err || "Failed to fetch orders");
        throw err;
      }
    },
    [dispatch]
  );

  // Clear error
  const clearOrderError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear current order
  const clearSelectedOrder = useCallback(() => {
    dispatch(clearCurrentOrder());
  }, [dispatch]);

  return {
    // state
    orders,
    userOrders,
    myOrders,
    currentOrder,
    totalRevenue,
    loading,
    error,
    createLoading,
    updateLoading,
    cancelLoading,

    // actions
    fetchOrders,
    fetchOrdersByUser,
    fetchMyOrders,
    fetchOrderById,
    fetchMyOrder,
    createOrder,
    cancelOrder,
    fetchOrdersByDays,
    updateOrderStatus,
    fetchTotalRevenue,
    clearOrderError,
    clearSelectedOrder,
  };
};
