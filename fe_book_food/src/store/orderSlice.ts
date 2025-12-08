import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../services/orderService";
import {
    OrderResponse,
    UserOrderResponse,
    CreateOrderRequest,
    OrderStatus,
    UpdateOrderStatusRequest,
    StatisticsOrders
} from "../types/order";
import { Page } from "../types/page";

interface OrderState {
    orders: Page<OrderResponse> | null;              // danh sách order (admin)
    userOrders: UserOrderResponse | null; // danh sách order theo user
    myOrders: UserOrderResponse | null;   // đơn hàng của bản thân
    currentOrder: OrderResponse | null;   // chi tiết 1 đơn hàng
    totalRevenue: number | null;
    newOrder: OrderResponse[];
    loading: boolean;
    error: string | null;
    createLoading: boolean;
    updateLoading: boolean;
    cancelLoading: boolean;
}

const initialState: OrderState = {
    orders: null,
    userOrders: null,
    myOrders: null,
    currentOrder: null,
    totalRevenue: null,
    newOrder: [],
    loading: false,
    error: null,
    createLoading: false,
    updateLoading: false,
    cancelLoading: false,
};

// --- Async thunks ---

// Lấy tất cả đơn hàng (ADMIN)
export const fetchOrdersAsync = createAsyncThunk(
    "order/fetchOrders",
    async (
        { status, page = 0, size = 10 }: { status?: OrderStatus; page?: number; size?: number },
        { rejectWithValue }
    ) => {
        try {
            const results = await orderService.getOrders(status, page, size);
            if (!results) throw new Error("No orders found");
            return results;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch orders");
        }
    }
);

// Lấy đơn hàng theo user (ADMIN)
export const fetchOrdersByUserAsync = createAsyncThunk(
    "order/fetchOrdersByUser",
    async ({ userId, page = 0, size = 10 }: { userId: number; page?: number; size?: number }, { rejectWithValue }) => {
        try {
            const userOrders = await orderService.getOrdersByUser(userId, page, size);
            if (!userOrders) throw new Error("No user orders found");
            return userOrders;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch orders by user");
        }
    }
);

// Lấy đơn hàng của bản thân (USER)
export const fetchMyOrdersAsync = createAsyncThunk(
    "order/fetchMyOrders",
    async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
        try {
            const myOrders = await orderService.getMyOrders(page, size);
            if (!myOrders) throw new Error("No my orders found");
            return myOrders;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch my orders");
        }
    }
);

// Lấy chi tiết order (ADMIN)
export const fetchOrderByIdAsync = createAsyncThunk(
    "order/fetchOrderById",
    async (orderId: number, { rejectWithValue }) => {
        try {
            const order = await orderService.getOrderById(orderId);
            if (!order) throw new Error("Order not found");
            return order;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch order");
        }
    }
);

// Lấy chi tiết order của bản thân (USER)
export const fetchMyOrderAsync = createAsyncThunk(
    "order/fetchMyOrder",
    async (orderId: number, { rejectWithValue }) => {
        try {
            const order = await orderService.getMyOrder(orderId);
            if (!order) throw new Error("My order not found");
            return order;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch my order");
        }
    }
);

// Tạo order (USER / ADMIN)
export const createOrderAsync = createAsyncThunk(
    "order/createOrder",
    async ({ request, userId }: { request: CreateOrderRequest; userId?: number }, { rejectWithValue }) => {
        try {
            const result = await orderService.createOrder(request, userId);
            if (!result) throw new Error("Failed to create order");
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to create order");
        }
    }
);

// Hủy order (USER / ADMIN)
export const cancelOrderAsync = createAsyncThunk(
    "order/cancelOrder",
    async (orderId: number, { rejectWithValue }) => {
        try {
            const result = await orderService.cancelOrder(orderId);
            if (!result) throw new Error("Failed to cancel order");
            return orderId;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to cancel order");
        }
    }
);

// Cập nhật trạng thái order (ADMIN)
export const updateOrderStatusAsync = createAsyncThunk(
    "order/updateOrderStatus",
    async ({ orderId, status }: UpdateOrderStatusRequest, { rejectWithValue }) => {
        try {
            const order = await orderService.updateOrderStatus(orderId, status);
            if (!order) throw new Error("Failed to update order status");
            return order;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update order status");
        }
    }
);

// Tổng doanh thu (ADMIN)
export const fetchTotalRevenueAsync = createAsyncThunk(
    "order/fetchTotalRevenue",
    async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
        try {
            const revenue = await orderService.getTotalRevenue(startDate, endDate);
            if (revenue === null) throw new Error("No revenue data");
            return revenue;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch total revenue");
        }
    }
);

//thống kê số lượng đơn hàng theo ngày
export const fetchOrdersByDaysAsync = createAsyncThunk("order/fetchOrdersByDays",
    async(params : StatisticsOrders, { rejectWithValue }) =>{
        try{
            const orders = await orderService.getOrdersByDays(params);
            if (!orders) throw new Error("No orders found");
            return orders;
        }catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch orders");
        }
    }
)

// --- Slice ---
const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch all orders
        builder
            .addCase(fetchOrdersAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrdersAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch orders by user
        builder.addCase(fetchOrdersByUserAsync.fulfilled, (state, action) => {
            state.userOrders = action.payload;
        });

        // Fetch my orders
        builder.addCase(fetchMyOrdersAsync.fulfilled, (state, action) => {
            state.myOrders = action.payload;
        });

        // Fetch order detail (admin)
        builder.addCase(fetchOrderByIdAsync.fulfilled, (state, action) => {
            state.currentOrder = action.payload;
        });

        // Fetch my order detail
        builder.addCase(fetchMyOrderAsync.fulfilled, (state, action) => {
            state.currentOrder = action.payload;
        });

        // Create order
        builder
            .addCase(createOrderAsync.pending, (state) => {
                state.createLoading = true;
            })
            .addCase(createOrderAsync.fulfilled, (state, action) => {
                state.createLoading = false;
                state.newOrder.unshift(action.payload);
            })
            .addCase(createOrderAsync.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload as string;
            });

        // Cancel order
        builder
            .addCase(cancelOrderAsync.pending, (state) => {
                state.cancelLoading = true;
            })
            .addCase(cancelOrderAsync.fulfilled, (state, action) => {
                state.cancelLoading = false;
                // Nếu orders tồn tại và có content
                if (state.orders && Array.isArray(state.orders.content)) {
                    // Lọc bỏ order bị hủy trong content
                    const newContent = state.orders.content.filter(
                        (o) => o.id !== action.payload
                    );

                    // Cập nhật lại state.orders (giữ nguyên thông tin phân trang)
                    state.orders = {
                        ...state.orders,
                        content: newContent,
                        totalElements: state.orders.totalElements - 1, // giảm tổng số phần tử
                    };
                }

                // Xóa currentOrder nếu chính order đó bị hủy
                if (state.currentOrder?.id === action.payload) {
                    state.currentOrder = null;
                }
            })
            .addCase(cancelOrderAsync.rejected, (state, action) => {
                state.cancelLoading = false;
                state.error = action.payload as string;
            });

        // Update order status
        builder
            .addCase(updateOrderStatusAsync.pending, (state) => {
                state.updateLoading = true;
            })
            .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
                state.updateLoading = false;
                if (state.orders?.content) {
                    const idx = state.orders.content.findIndex(o => o.id === action.payload.id);
                    if (idx !== -1) {
                        // Immer cho phép gán trực tiếp
                        state.orders.content[idx] = action.payload;
                    }
                }

                if (state.currentOrder?.id === action.payload.id) {
                    state.currentOrder = action.payload;
                }
            })
            .addCase(updateOrderStatusAsync.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload as string;
            });

        // Fetch total revenue
        builder.addCase(fetchTotalRevenueAsync.fulfilled, (state, action) => {
            state.totalRevenue = action.payload;
        });

        //statistics by days
        builder
            .addCase(fetchOrdersByDaysAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrdersByDaysAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrdersByDaysAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
