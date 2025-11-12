import { UserResponse } from "./user";

export enum OrderStatus{
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  PREPARING = 'PREPARING',
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Chờ xử lý",
  PREPARING: "Đang xử lý",
  SUCCEEDED: "Hoàn tất",
  FAILED: "Đã hủy",
};
export type StatusOrderKey = "Tất cả" | keyof typeof OrderStatus;


export interface OrderItemResponse{
    foodId: number;
    foodName: string;
    quantity: number;
    price: number;       
    totalPrice: number;
    reviewed: boolean;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  status: OrderStatus
  totalAmount: number;
  deliveryAddress: string;
  deliveryPhone: string;
  notes?: string;
  estimatedDeliveryTime?: string;
  items: OrderItemResponse[];
  user: UserResponse;
  createdAt: string;
  updatedAt: string;
}

export interface UserOrderResponse{
    orders: OrderResponse[];
    totalOrders: number;
}

export interface OrderItemRequest {
  foodId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  items: OrderItemRequest[];
  deliveryAddress: string;
  deliveryPhone: string;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  orderId: number;
  status: OrderStatus; 
}
//giỏ hàng tạm thời
export type DraftItem = {
  foodId: number;
  quantity: number;
  foodName?: string;
  price?: number;       // optional, nếu lúc thêm vào có sẵn giá
};

export interface StatisticsOrders{
  startDate: string;
  endDate: string;
}