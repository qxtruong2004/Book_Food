

import { useEffect, useState } from "react";
import { useOrder } from "../../../hooks/useOrder";
import { OrderResponse } from "../../../types/order";
import { formatCurrency, formatDateTime } from "../../../utils/helpers";

type OrderDetailModalProps = {
  orderId: number;
  initial?: OrderResponse | null;
  onClose: () => void;
};


// const statusBadge = (s?: OrderStatus) => {
//   switch (s) {
//     case "PENDING":
//       return { text: "Chờ xử lý", cls: "badge bg-warning text-dark" };
//     case "PREPARING":
//       return { text: "Đang xử lý", cls: "badge bg-info text-dark" };
//     case "SUCCEEDED":
//       return { text: "Đang giao", cls: "badge bg-primary" };
//     case "FAILED":
//       return { text: "Đã hủy", cls: "badge bg-danger" };
//     default:
//       return { text: String(s ?? "-"), cls: "badge bg-secondary" };
//   }
// };

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ orderId, initial, onClose }) => {
  const { currentOrder, fetchOrderById } = useOrder();
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderById(orderId);
  }, [fetchOrderById])



  if (!currentOrder) return <div>"Không có chi tiết đơn hàng</div>
  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(40, 167, 69, 0.3)' }} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-xl">
        <div className="modal-content shadow-lg">
          <div className="modal-header">

            {/* Id đơn hàng, ngày tạo */}
            <div className="d-flex flex-column">
              <h5 className="mb-1">
                Chi tiết đơn {currentOrder?.orderNumber ?? orderId}
                {/* <span className="ms-2 align-middle">
                  <span className={stx.cls}>{stx.text}</span>
                </span> */}
              </h5>
              <small className="text-muted">
                ID đơn hàng: <strong>{currentOrder.id}</strong> •
                {" "}Ngày tạo: <strong>{formatDateTime(currentOrder.createdAt)}</strong> •
                {" "}Cập nhật: <strong>{formatDateTime(currentOrder.updatedAt)}</strong>
              </small>
            </div>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {loading && <div>Đang tải chi tiết đơn hàng…</div>}
            {!loading && error && <div className="alert alert-danger mb-0">{error}</div>}

            {!loading && !error && currentOrder && (
              <>
                <div className="row g-3 mb-3">
                  {/* Thông tin người đặt & giao nhận */}
                  <div className="col-md-6">
                    <div className="border border-3 rounded-3 p-3 h-100" style={{ backgroundColor: '#ADF9E0' }}>
                      <h6 className="mb-3">Thông tin người đặt</h6>
                      <div className="mb-1">
                        <span className="text-muted">Tên khách hàng: </span>
                        <strong>{(currentOrder.user as any)?.fullName ?? "-"}</strong>
                      </div>
                      <div className="mb-1">
                        <span className="text-muted">Tên tài khoản: </span>
                        <strong>{(currentOrder.user as any)?.username ?? "-"}</strong>
                      </div>
                      <div className="mb-1">
                        <span className="text-muted">Email: </span>
                        <strong>{(currentOrder.user as any)?.email ?? "-"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* thông tin giao hàng */}
                  <div className="col-md-6">
                    <div className="border border-3 rounded-3 p-3 h-100" style={{ backgroundColor: '#9CD8EB' }}>
                      <h6 className="mb-3">Thông tin giao hàng</h6>
                      <div className="mb-1">
                        <span className="text-muted">Địa chỉ: </span>
                        <strong>{currentOrder.deliveryAddress || "-"}</strong>
                      </div>
                      <div className="mb-1">
                        <span className="text-muted">SĐT người nhận: </span>
                        <strong>{currentOrder.deliveryPhone || "-"}</strong>
                      </div>
                      <div className="mb-1">
                        <span className="text-muted">Ghi chú: </span>
                        <span>{currentOrder.notes || "-"}</span>
                      </div>
                      <div className="mb-1">
                        <span className="text-muted">Dự kiến giao: </span>
                        <strong>{currentOrder.estimatedDeliveryTime ? formatDateTime(currentOrder.estimatedDeliveryTime) : "-"}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danh sách món */}
                <div className="border rounded-3 p-3 mb-3">
                  <h6 className="mb-3">Món trong đơn</h6>
                  <div style={{maxHeight: '150px', overflowY: 'auto'}}>
                    <div className="table-responsive">
                      <table className="table table-sm align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: 56 }}>STT</th>
                            <th style={{ width: 150 }}>Mã món</th>
                            <th>Tên món</th>
                            <th className="text-end">Đơn giá</th>
                            <th className="text-end">Số lượng</th>
                            <th className="text-end">Thành tiền</th>
                          </tr>
                        </thead>

                        <tbody>
                          {currentOrder.items.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="text-center text-muted py-4">Không có món nào</td>
                            </tr>
                          ) : (
                            currentOrder.items.map((it: any, idx: number) => {
                              const name =
                                it.foodName ?? `Món #${idx + 1}`;
                              const price = it.price ?? it.unitPrice ?? 0;
                              const qty = it.quantity ?? 0;
                              const line = it.totalPrice ?? price * qty;
                              return (
                                <tr key={it.id ?? idx}>
                                  <td>{idx + 1}</td>
                                  <td>
                                    <div className="fw-semibold">{it.foodId}</div>
                                  </td>
                                  <td>
                                    <div className="fw-semibold">{name}</div>
                                  </td>
                                  <td className="text-end">{formatCurrency(price)}</td>
                                  <td className="text-end">{qty}</td>
                                  <td className="text-end">{formatCurrency(line)}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Tổng tiền */}
                <div className="d-flex justify-content-end">
                  <div className="border rounded-3 p-3" style={{ minWidth: 320, maxHeight: 100 }}>
                    <div className="d-flex justify-content-between mb-1" >
                      <span className="text-muted">Tạm tính</span>
                      <strong>{formatCurrency(currentOrder.totalAmount)}</strong>
                    </div>
                    {/* Nếu có thuế/phí/giảm giá thì thêm dòng ở đây */}
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fs-5">
                      <span>Tổng thanh toán</span>
                      <span className="fw-bold">{currentOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!loading && !error && !currentOrder && (
              <div className="text-center text-muted">Không tìm thấy đơn</div>
            )}
          </div>

          {/* <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
