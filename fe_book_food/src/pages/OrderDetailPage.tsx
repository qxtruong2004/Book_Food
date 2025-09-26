import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrder";
import type { OrderResponse } from "../types/order";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sp] = useSearchParams();
  const { fetchMyOrder, cancelOrder, loading, cancelLoading } = useOrder();
  const [order, setOrder] = useState<OrderResponse | null>(null);

  //lấy chi tiết order theo id
  const load = async () => {
    const data = await fetchMyOrder(Number(id));
    setOrder(data);
  };

  //môi khi id trên url thay đổi thì tải chi tiết đơn theo id
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  //hiển thị feedback một lần sau khi tạo đơn, (2) dọn URL để tránh lặp và rối
  useEffect(() => {
    if (sp.get("success") === "1") console.log("Tạo đơn thành công");
  }, [sp]);


  /*
    Khi đang tải hoặc order chưa có → vế trái order là null/undefined → biểu thức trả về null/undefined (falsy) → không thể huỷ.
    Khi có order → kiểm tra order.status === "PENDING" → chỉ được huỷ nếu đơn đang chờ.*/
  const canCancel = order && order.status === "PENDING";

  /*Gọi API huỷ đơn với order.id.
  Sau khi huỷ xong thì await load() để refetch chi tiết đơn (mới nhất) → UI cập nhật trạng thái. */
  const handleCancel = async () => {
    if(!order) return;
    await cancelOrder(order.id);
    await load();
  };

  if (loading || !order) return <div className="container py-4">Đang tải...</div>;

  return (
    <div className="container py-4">
      <h3>Đơn hàng {order.orderNumber}</h3>
      <div className="row mt-3">
        <div className="col-md-7">
          <div className="card p-3 mb-3">
            <h5>Thông tin giao hàng</h5>
            <div>Người đặt hàng: {order.user.username}</div>
            <div>Địa chỉ: {order.deliveryAddress}</div>
            <div>SĐT: {order.deliveryPhone}</div>
            {/* chỉ hiện “Ghi chú” nếu có dữ liệu. */}
            {order.notes && <div>Ghi chú: {order.notes}</div>} 
          </div>
          <div className="card p-3">
            <h5>Trạng thái: {order.status}</h5>
            <div>Ngày tạo: {new Date(order.createdAt).toLocaleString("vi-VN")}</div>

            {/* chỉ hiển thị nút huỷ khi trạng thái là PENDING. */}
            {canCancel && (
              <button className="btn btn-outline-danger mt-2" disabled={cancelLoading} onClick={handleCancel}>
                {cancelLoading ? "Đang huỷ..." : "Huỷ đơn"}
              </button>
            )}
          </div>
        </div>
        <div className="col-md-5">
          <div className="card p-3">
            <h5>Chi tiết món</h5>
            {/* Lặp qua items để hiển thị tên và số lượng. */}
            {order.items.map(it => (
              <div key={it.foodId} className="d-flex justify-content-between">
                <span>{it.foodName || `Món #${it.foodId}`}</span>
                <span>{it.price.toLocaleString("vi-VN")}₫ x {it.quantity}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between"><span>Tổng tiền</span><span>{order.totalAmount.toLocaleString("vi-VN")}₫</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
