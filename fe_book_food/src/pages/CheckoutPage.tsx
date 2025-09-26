// src/pages/CheckoutPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOrderDraft } from "../context/OrderDraftContext";
import { useOrder } from "../hooks/useOrder";
import type { OrderItemRequest, DraftItem } from "../types/order";
import { ROUTES } from "../utils/constants";
import { toast } from "react-toastify";
import { formatCurrency } from "../utils/helpers";

//có thể đến từ state.items(orderItemRequest hoặc DraftItem)
type AnyItem = OrderItemRequest | DraftItem;

//nếu có tên món thì dùng tên kh thì set là món #id
const getItemName = (i: AnyItem) =>
  ("foodName" in i && i.foodName) ? i.foodName : `Món #${i.foodId}`;

const getItemPrice = (i: AnyItem) =>
  ("price" in i && typeof i.price === "number") ? i.price : 0; //tương tự bên trên

export default function CheckoutPage() {
  const nav = useNavigate();
  const draft = useOrderDraft();
  const { createOrder, createLoading } = useOrder();

  // Có thể tới từ trang khác (state.items) hoặc dùng draft.items
  const { state } = useLocation() as { state?: { items?: OrderItemRequest[] | DraftItem[] } };

  // state từ điều hướng (nếu trang trước truyền vào)
  const items = useMemo<AnyItem[]>(
    () => (state?.items as AnyItem[] | undefined) ?? (draft.items as AnyItem[]),
    [state?.items, draft.items]
  );

  // Dùng list cục bộ để hỗ trợ xóa/sửa khi nguồn là state
  const fromDraft = !state?.items; // true nếu đang dùng draft.items
  const [list, setList] = useState<AnyItem[]>(items);

  useEffect(() => {
    setList(items);  // đồng bộ khi nguồn items đổi (draft thay đổi hoặc state mới)
  }, [items]);

  // Form giao hàng
  const [deliveryAddress, setAddr] = useState("");
  const [deliveryPhone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // ====== Actions: remove / inc / dec ======
  const removeItem = (foodId: number) => {
    if (fromDraft) { //Nếu đang dùng draft → gọi draft.remove (cập nhật context cho toàn app) + toast báo.
      draft.remove(foodId);
      toast.success("Đã xóa sản phẩm!", {
        position: "top-center",
        autoClose: 1000, // tự tắt sau 2 giây
      });
    } else {
      //Nếu đang dùng state.items → chỉ sửa list cục bộ.
      setList(prev => prev.filter(i => i.foodId !== foodId));
    }
  };

  //tăng
  const incQty = (foodId: number) => {
    if (fromDraft) {
      const cur = draft.items.find(i => i.foodId === foodId)?.quantity ?? 0;
      draft.update(foodId, cur + 1);
    } else {
      setList(prev =>
        prev.map(i => i.foodId === foodId ? { ...i, quantity: i.quantity + 1 } : i)
      );
    }
  };

  //giảm
  const decQty = (foodId: number) => {
    if (fromDraft) {
      const cur = draft.items.find(i => i.foodId === foodId)?.quantity ?? 0;
      const next = cur - 1;
      if (next <= 0) draft.remove(foodId);
      else draft.update(foodId, next);
    } else {
      setList(prev =>
        prev.flatMap(i => {
          if (i.foodId !== foodId) return [i];
          const next = i.quantity - 1;
          return next <= 0 ? [] : [{ ...i, quantity: next }];
        })
      );
    }
  };

  //Giá trị dẫn xuất (derived)( chỉ bật nút đặt hàng khi có ít nhất 1 món, địa chỉ, sdt)
  const canSubmit =
    list.length > 0 &&
    deliveryAddress.trim().length > 0 &&
    deliveryPhone.trim().length > 0;

  //tổng tiền tạm tính
  const grandTotal = list.reduce((sum, i) => sum + getItemPrice(i) * i.quantity, 0);

  // ====== Submit ======
  const handlePlaceOrder = async () => {
    try {
      const payload: OrderItemRequest[] = list.map(i => ({
        foodId: i.foodId,
        quantity: i.quantity,
      }));

      const order = await createOrder({
        items: payload,
        deliveryAddress: deliveryAddress.trim(),
        deliveryPhone: deliveryPhone.trim(),
        notes: notes.trim(),
      });

      nav(`${ROUTES.orderDetail(order.id)}?success=1`, { replace: true });
      draft.clear(); // clear sau khi điều hướng
    } catch (e) {
      toast.error("Tạo đơn thất bại");
    }
  };

  // Guard khi rỗng
  if (list.length === 0) {
    return (
      <div className="container py-4">
        <h4>Chưa có món nào được chọn</h4>
        <button className="btn btn-link" onClick={() => nav(ROUTES.HOME || "/")}>
          Quay lại menu
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3>Thanh toán</h3>
      <div className="row mt-3">
        {/* ====== Cột trái: thông tin giao hàng ====== */}
        <div className="col-md-7">
          <div className="card p-3 mb-3">
            <h5>Thông tin giao hàng</h5>
            <div className="mb-2">
              <label className="form-label">Địa chỉ</label>
              <input
                className="form-control"
                value={deliveryAddress}
                onChange={e => setAddr(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">SĐT</label>
              <input
                className="form-control"
                value={deliveryPhone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Ghi chú</label>
              <textarea
                className="form-control"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ====== Cột phải: tóm tắt món ====== */}
        <div className="col-md-5">
          <div className="card p-3">
            <h5>Tóm tắt món</h5>

            {list.map(i => {
              const name = getItemName(i);
              const price = getItemPrice(i);
              const qty = i.quantity;
              const total = price * qty;

              return (
                <div key={i.foodId} className="d-flex justify-content-between align-items-center py-2">
                  <div className="me-3">
                    <div className="fw-medium">{name}</div>
                    <small className="text-muted">
                      {price > 0 ? `${formatCurrency(price)} × ${qty}` : `x${qty}`}
                    </small>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {/* − / qty / + */}
                    <div className="input-group input-group-sm" style={{ width: 110 }}>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => decQty(i.foodId)}
                        disabled={createLoading}
                        aria-label="Giảm số lượng"
                        title="Giảm"
                      >
                        −
                      </button>
                      <input className="form-control text-center" value={qty} readOnly />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => incQty(i.foodId)}
                        disabled={createLoading}
                        aria-label="Tăng số lượng"
                        title="Tăng"
                      >
                        +
                      </button>
                    </div>

                    {/* Thành tiền */}
                    <div className="text-end" style={{ minWidth: 110 }}>
                      <span className="fw-semibold">{price > 0 ? formatCurrency(total) : "--"}</span>
                    </div>

                    {/* Xoá món */}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      title="Xóa món này"
                      onClick={() => removeItem(i.foodId)}
                      disabled={createLoading}
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}

            <hr />

            <div className="d-flex justify-content-between">
              <span className="fw-semibold">Tổng tạm tính</span>
              <span className="fw-bold">{formatCurrency(grandTotal)}</span>
            </div>

            <button
              className="btn btn-primary mt-3"
              disabled={!canSubmit || createLoading}
              onClick={handlePlaceOrder}
            >
              {createLoading ? "Đang tạo đơn..." : "Đặt hàng"}
            </button>

            <p className="text-muted mt-2" style={{ fontSize: 12 }}>
              Giá hiển thị ở đây là tạm tính (nếu có đơn giá). Tổng tiền sẽ được hệ
              thống chốt tại thời điểm đặt và hiển thị ở chi tiết đơn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
