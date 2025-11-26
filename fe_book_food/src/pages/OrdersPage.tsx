import React, { useEffect, useState } from "react";
import { useOrder } from "../hooks/useOrder";
import type { OrderResponse } from "../types/order";
import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";

export default function OrdersPage() {
  const { myOrders, fetchMyOrders, loading } = useOrder();
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  //lấy tất cả order của user
  useEffect(() => {
    fetchMyOrders(0, 10);
  }, [fetchMyOrders]);

  if (loading) return <div className="container py-4">Đang tải...</div>;

  return (
    <div className="container py-4">
      <h3>Đơn hàng của tôi</h3>
      <div className="mt-3">
        {(myOrders?.orders?.content ?? []).length === 0 ? (
          <p>Chưa có đơn hàng.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                  <th>Tổng tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {myOrders?.orders.content.map(o => (
                  <tr key={o.id}>
                    <td>{o.orderNumber}</td>
                    <td>{new Date(o.createdAt).toLocaleString("vi-VN")}</td>
                    <td>{o.status}</td>
                    <td>{o.totalAmount.toLocaleString("vi-VN")}₫</td>
                    <td><Link to={ROUTES.orderDetail(o.id)} className="btn btn-sm btn-outline-primary">Xem</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}