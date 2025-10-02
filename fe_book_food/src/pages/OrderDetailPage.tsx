import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrder";
import type { OrderResponse } from "../types/order";
import { useReview } from "../hooks/useReview";
import { toast } from "react-toastify";
import ReviewModal from "../components/review/ReviewModal";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sp] = useSearchParams();
  const { fetchMyOrder, cancelOrder, loading, cancelLoading } = useOrder();
  const [order, setOrder] = useState<OrderResponse | null>(null);

  const { createReview } = useReview();


  //modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFoodId, setActiveFoodId] = useState<number | null>(null);
  const [activeFoodName, setActiveFoodName] = useState<string>("");

  const succeeded = useMemo(() => order?.status === "SUCCEEDED", [order?.status])


  //lấy chi tiết order theo id
  const load = async () => {
    if (!id) return;
    const data = await fetchMyOrder(Number(id));
    setOrder(data);
  };

  //môi khi id trên url thay đổi thì tải chi tiết đơn theo id
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  //hiển thị feedback một lần sau khi tạo đơn, (2) dọn URL để tránh lặp và rối
  useEffect(() => {
    if (sp.get("success") === "1") toast.success("Tạo đơn thành công");
  }, [sp]);

  useEffect(() => {
    const fid = sp.get("foodId");
    if (order && succeeded && fid) {
      const item = order.items.find(it => String(it.foodId) === fid);
      if (item) {
        setActiveFoodId(item.foodId);
        setActiveFoodName(item.foodName || `Món #${item.foodId}`);
        setModalOpen(true);
      }
    }
  }, [order, succeeded, sp])


  /*
    Khi đang tải hoặc order chưa có → vế trái order là null/undefined → biểu thức trả về null/undefined (falsy) → không thể huỷ.
    Khi có order → kiểm tra order.status === "PENDING" → chỉ được huỷ nếu đơn đang chờ.*/
  const canCancel = order && order.status === "PENDING";

  /*Gọi API huỷ đơn với order.id.
  Sau khi huỷ xong thì await load() để refetch chi tiết đơn (mới nhất) → UI cập nhật trạng thái. */
  const handleCancel = async () => {
    if (!order) return;
    await cancelOrder(order.id);
    await load();
  };
  const openModal = (foodId: number, foodName: string) => {
    setActiveFoodId(foodId);
    setActiveFoodName(foodName);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setActiveFoodId(null);
    setActiveFoodName("");
  };
  const handleSubmitReview = async (rating: number, comment?: string) => {
    if (!order || !activeFoodId) return;
    try {
      await createReview({
        foodId: activeFoodId,
        orderId: order.id,       // QUAN TRỌNG: gửi kèm orderId theo backend
        rating,
        comment
      });
      toast.success("Cảm ơn bạn đã đánh giá!");
      await load(); // refetch để nhận isReviewed=true từ server
      closeModal();
    } catch (err: any) {
      const msg = err?.message || "Không thể gửi đánh giá";
      toast.error(msg);
      await load();     // trong trường hợp server báo đã đánh giá, refetch để đồng bộ UI
      closeModal();
    }
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
            {order.notes && <div>Ghi chú: {order.notes}</div>}
          </div>
          <div className="card p-3">
            <h5>Trạng thái: {order.status}</h5>
            <div>Ngày tạo: {new Date(order.createdAt).toLocaleString("vi-VN")}</div>

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
            {order.items.map(it => {
              return (
                <div key={it.foodId} className="d-flex justify-content-between align-items-center py-2">
                  <div className="me-2">
                    <div className="fw-bold">{it.foodName || `Món #${it.foodId}`}</div>
                    <small className="text-muted">
                      {it.price.toLocaleString("vi-VN")}₫ x {it.quantity}
                    </small>
                  </div>

                  {order.status === "SUCCEEDED" ? (
                    it.reviewed ? (
                      <span className="badge bg-success">Đã đánh giá</span>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openModal(it.foodId, it.foodName || `Món #${it.foodId}`)}
                      >
                        Đánh giá
                      </button>
                    )
                  ) : (
                    <span className="text-muted small">Chờ giao xong để đánh giá</span>
                  )}
                </div>
              );
            })}
            <hr />
            <div className="d-flex justify-content-between">
              <span>Tổng tiền</span>
              <span>{order.totalAmount.toLocaleString("vi-VN")}₫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal đánh giá */}
      <ReviewModal
        show={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitReview}
        foodName={activeFoodName}
      />
    </div>
  );
}