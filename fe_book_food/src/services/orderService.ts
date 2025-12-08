import { CreateOrderRequest, OrderResponse, OrderStatus, StatisticsOrders, UserOrderResponse } from "../types/order";
import { Page } from "../types/page";
import { API_ENDPOINTS } from "../utils/constants";
import { api, ApiResponse } from "./api";

export const orderService = {
    // Lấy tất cả đơn hàng (ADMIN) + có thể lọc trạng thái + phân trang
    async getOrders(orderStatus?: OrderStatus,page = 0,size = 10): Promise<Page<OrderResponse> | null> {
        try {
           const params: any = {};
            if (page !== undefined) params.page = page;
            if (size !== undefined) params.size = size;
            if (orderStatus) params.orderStatus = orderStatus;
            const response = await api.get<ApiResponse<Page<OrderResponse>>>(API_ENDPOINTS.ORDERS.GET_ALL,{ params }
    );
            return response.data.data;
        } catch (error) {
            console.error("OrderService error (getOrders):", error);
            return null;
        }
    },


    // Tạo order (ADMIN / USER) (id chỉ có admin dùng)
    async createOrder(createOrderRequest: CreateOrderRequest, userId?: number): Promise<OrderResponse | null> {
        try {
            const params = userId ? { userId } : undefined;
            const response = await api.post<ApiResponse<OrderResponse>>(
                API_ENDPOINTS.ORDERS.CREATE,
                createOrderRequest,
                { params }
            );
            return response.data.data;
        } catch (error) {
            console.error("OrderService error (createOrder):", error);
            return null;
        }
    },

    // Hủy đơn hàng (USER / ADMIN)
    async cancelOrder(orderId: number): Promise<string | null> {
        try {
            const response = await api.delete<ApiResponse<string>>(
                API_ENDPOINTS.ORDERS.CANCEL(orderId)
            );
            return response.data.data;
        } catch (error) {
            console.error("OrderService error (cancelOrder):", error);
            return null;
        }
    },

    // Tính tổng doanh thu (ADMIN)
    async getTotalRevenue(startDate: string, endDate: string): Promise<number | null> {
        try {
            const response = await api.get<ApiResponse<number>>(API_ENDPOINTS.ORDERS.TOTAL_REVENUE, {params: {startDate, endDate}});
            return response.data.data;
        } catch (error) {
            console.error("OrderService error (getTotalRevenue):", error);
            return null;
        }
    },

    // Cập nhật trạng thái đơn hàng (ADMIN)
    async updateOrderStatus(orderId: number, status: OrderStatus): Promise<OrderResponse | null> {
        try {
            const response = await api.put<ApiResponse<OrderResponse>>(
                API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), null, {params: {status}}
            );
            return response.data.data;
        } catch (error) {
            console.error("OrderService error (updateOrderStatus):", error);
            return null;
        }
    },

    // Xem chi tiết đơn hàng (ADMIN)
    async getOrderById(orderId: number): Promise<OrderResponse | null> {
        try {
            const response = await api.get<ApiResponse<OrderResponse>>(
                API_ENDPOINTS.ORDERS.DETAIL_ADMIN(orderId)
            );
            return response.data.data;
        } catch (error) {
            console.error("OrderService error (getOrderById):", error);
            return null;
        }
    },

    // Lấy ds order của bản thân (USER)
    async getMyOrders(page = 0, size = 10): Promise<UserOrderResponse | null> {
        try {
            const response = await api.get<ApiResponse<UserOrderResponse>>(
                API_ENDPOINTS.ORDERS.MY_ORDERS, {params: {page, size}}
            );
            return response.data.data;
        } catch (error) {
            console.error("OrderService error (getMyOrders):", error);
            return null;
        }
    },

    // Xem chi tiết đơn hàng của bản thân (USER)
    async getMyOrder(orderId: number): Promise<OrderResponse | null> {
        try {
            const response = await api.get<ApiResponse<OrderResponse>>(
                API_ENDPOINTS.ORDERS.MY_ORDER_DETAIL(orderId)
            );
            return response.data.data;
        } catch (error) {
            console.error("OrderService error (getMyOrder):", error);
            return null;
        }
    },

    // Lấy danh sách order của user (ADMIN)
    async getOrdersByUser(userId: number, page = 0, size = 10): Promise<UserOrderResponse | null> {
        try {
            const response = await api.get<ApiResponse<UserOrderResponse>>(
                API_ENDPOINTS.ORDERS.BY_USER(userId),
                { params: { page, size } }
            );
            return response.data.data;
        } catch (error) {
            console.error("OrderService error (getOrdersByUser):", error);
            return null;
        }
    },

    //thống kê số lượng đơn hàng theo ngày
    async getOrdersByDays(statistics: StatisticsOrders, page = 0, size = 10): Promise<Page<OrderResponse> | null>{
        try{
            const response = await api.get<ApiResponse<Page<OrderResponse>>>(
                API_ENDPOINTS.ORDERS.STATISTICS_BY_DAYS(statistics.startDate, statistics.endDate, statistics.orderStatus));
                return response.data.data;
        } catch (error) {
            console.error("OrderService error (getOrders):", error);
            return null;
        }

    }
}