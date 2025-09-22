// src/components/order/OrderCard.tsx
import React from "react";

interface OrderCardProps {
  id: number;
  date: string;
  total: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  onClick?: () => void;
}

const statusColors: Record<string, string> = {
  Pending: "warning",
  Processing: "info",
  Completed: "success",
  Cancelled: "danger",
};

const OrderCard: React.FC<OrderCardProps> = ({ id, date, total, status, onClick }) => {
  return (
    <div
      className="card mb-3 shadow-sm"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1">Đơn hàng #{id}</h6>
          <small className="text-muted">{date}</small>
        </div>
        <div>
          <span className={`badge bg-${statusColors[status]} me-3`}>{status}</span>
          <span className="fw-bold text-danger">{total.toLocaleString()} đ</span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
