// src/pages/OrdersTestPage.tsx
import React, { useState } from "react";
import OrderList from "../components/order/OrderList";
import OrderDetails from "../components/order/OrderDetails";

const OrdersTestPage: React.FC = () => {
  const mockOrders = [
    { id: 1, date: "2025-09-15", total: 200000, status: "Pending" as const },
    { id: 2, date: "2025-09-16", total: 350000, status: "Completed" as const },
    { id: 3, date: "2025-09-17", total: 150000, status: "Processing" as const },
  ];

  const mockItems = [
    { id: 1, name: "Pizza Bò", quantity: 1, price: 100000 },
    { id: 2, name: "Gà Rán", quantity: 2, price: 50000 },
  ];

  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Đơn hàng của tôi</h2>

      {!selectedOrder ? (
        <OrderList orders={mockOrders} onSelectOrder={setSelectedOrder} />
      ) : (
        <OrderDetails
          id={selectedOrder}
          date="2025-09-15"
          total={200000}
          status="Pending"
          items={mockItems}
        />
      )}
    </div>
  );
};

export default OrdersTestPage;
