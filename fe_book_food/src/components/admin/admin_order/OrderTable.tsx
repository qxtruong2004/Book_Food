import React from "react";
import { OrderResponse } from "../../../types/order";
import { formatCurrency, formatDate } from "../../../utils/helpers";
import OrderStatusBadge from "../../common/OrderStatusBadge";

interface Props {
    data: OrderResponse[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    onOpenDetail?: (id: number) => void; 
}

const OrderTable: React.FC<Props> = ({ data, selectedId, onSelect , onOpenDetail}) => {
    return (
        <div className="border rounded-3 bg-white shadow-sm" style={{ minHeight: 320, overflow: "hidden" }}>
            <div className="table-responsive">
                <table className="table table-sm mb-0 align-middle"
                    style={{ height: "100%" }}>

                    <thead
                        className="table-light sticky-top"
                        style={{ top: 0, background: "linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%)", borderBottom: "2px solid #c8e6c9", textAlign: 'center' }}
                    >
                        <tr>
                            <th style={{ color: "#2e7d32", width: 30, fontWeight: 600, padding: "16px 12px" }}>
                                <i className="fas fa-hashtag me-1" /> ID
                            </th>
                            <th style={{ color: "#2e7d32", width: 70, fontWeight: 600, padding: "16px 12px" }}>
                                <i className="fas fa-tag me-1" /> Mã đơn hàng
                            </th>
                            <th style={{ color: "#2e7d32", width: 80, fontWeight: 600, padding: "16px 12px" }}>
                                <i className="fas fa-list me-1" /> Người đặt
                            </th>
                            <th style={{ color: "#2e7d32", width: 70, fontWeight: 600, padding: "16px 12px" }}>
                                SĐT Người nhận
                            </th>

                            <th style={{ color: "#2e7d32", width: 70, fontWeight: 600, padding: "16px 12px" }}>
                                <i className="fas fa-coins me-1" /> Trạng thái
                            </th>
                            <th style={{ color: "#2e7d32", width: 70, fontWeight: 600, padding: "16px 12px" }}>
                                <i className="fas fa-toggle-on me-1" /> Tổng tiền
                            </th>

                            <th style={{ color: "#2e7d32", width: 70, fontWeight: 600, padding: "16px 12px" }}>
                                <i className="fas fa-shopping-bag me-1" /> Ngày tạo
                            </th>
                        </tr>
                    </thead>

                    <tbody style={{ textAlign: 'center' }}>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-muted">Chưa có dữ liệu</td>
                            </tr>
                        ) : (
                            data.map((f) => {
                                const isActive = f.id === selectedId;
                                return (
                                    <tr
                                        key={f.id}
                                        className={isActive ? "table-success" : ""}
                                        style={{height: "60px", verticalAlign: "middle",  cursor: "pointer" }}
                                        onClick={() => onSelect(f.id)}
                                        onDoubleClick={() => onOpenDetail?.(f.id)}
                                    >
                                        <td className="fw-semibold">#{f.id}</td>

                                        {/* Mã đơn hàng */}
                                        <td className="fw-semibold">{f.orderNumber}</td>

                                        {/* Người đặt */}
                                        <td className="fw-medium" style={{ color: "#2e7d32" }}>{f.user.username}</td>

                                        {/* SĐT Người nhận */}
                                        <td className="text-truncate">{f.deliveryPhone}</td>

                                        {/* Trạng thái */}
                                        <td>
                                            <OrderStatusBadge status={f.status}/>
                                        </td>

                                        {/* Tổng tiền */}
                                        <td className="fw-semibold">{formatCurrency(f.totalAmount)}</td>

                                        {/* Ngafy tạo đonnư */}
                                        <td>{formatDate(f.createdAt)}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default React.memo(OrderTable);