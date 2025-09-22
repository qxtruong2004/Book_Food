// src/components/order/OrderDetails.tsx
import React from "react";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetailsProps {
  id: number;
  date: string;
  total: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  items: OrderItem[];
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ id, date, total, status, items }) => {
  return (
    <div className="card p-4 shadow">
      <h4 className="mb-3">Chi tiết đơn hàng #{id}</h4>
      <p><strong>Ngày đặt:</strong> {date}</p>
      <p><strong>Trạng thái:</strong> {status}</p>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{(item.price * item.quantity).toLocaleString()} đ</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5 className="text-end text-danger">Tổng cộng: {total.toLocaleString()} đ</h5>
    </div>
  );
};

export default OrderDetails;
