// src/components/order/OrderList.tsx
import React from "react";
import OrderCard from "./OrderCard";

interface Order {
  id: number;
  date: string;
  total: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
}

interface OrderListProps {
  orders: Order[];
  onSelectOrder?: (orderId: number) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onSelectOrder }) => {
  return (
    <div>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          {...order}
          onClick={() => onSelectOrder && onSelectOrder(order.id)}
        />
      ))}
    </div>
  );
};

export default OrderList;
