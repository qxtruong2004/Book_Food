import { UserResponse } from "./user";

export enum OrderStatus{
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  PREPARING = 'PREPARING',
}
export interface OrderItemResponse{
    foodId: number;
    foodName: string;
    quantity: number;
    price: number;       
    totalPrice: number;
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