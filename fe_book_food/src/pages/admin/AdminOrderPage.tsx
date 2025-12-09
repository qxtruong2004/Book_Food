import { useEffect, useMemo, useState } from "react";
import OrderTable from "../../components/admin/admin_order/OrderTable";
import { useOrder } from "../../hooks/useOrder";
import { OrderResponse, OrderStatus, StatusOrderKey } from "../../types/order";
import AdminPagination from "../../components/common/AdminPagination";
import OrderStatusBadge from "../../components/common/OrderStatusBadge";
import OrderDetailModal from "../../components/admin/admin_order/OrderDetailModal";
import toast from "react-hot-toast";

const AdminOrderPage: React.FC = () => {
  const { orders, fetchOrders, fetchOrdersByDays, updateOrderStatus, updateLoading } = useOrder();

  // Chọn dòng
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Phân trang
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // Tìm kiếm + lọc
  const [keyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusOrderKey>("Tất cả");

  // Thống kê theo ngày
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Form chỉnh sửa trạng thái (mới thêm)
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");

  // Bản ghi đang chọn
  const selected: OrderResponse | null = useMemo(() => {
    const content = orders?.content ?? [];
    return content.find((u) => u.id === selectedId) || null;
  }, [orders, selectedId]);

  // Lọc trạng thái order
  const handleStatusOrderChange: React.ChangeEventHandler<HTMLSelectElement> = async (e) => {
    const val = e.target.value as StatusOrderKey;
    setStatusFilter(val);
    setPage(0);
    if (val === "Tất cả") {
      await fetchOrders(undefined, 0, size);
    } else {
      await fetchOrders(OrderStatus[val], 0, size);
    }
  };

  // Chuyển trang
  const handleChangePage = async (next: number) => {
    setPage(next);
    await fetchOrders(undefined, next, size);
  };

  // Mở modal chi tiết
  const [showDetail, setShowDetail] = useState(false);

  // Hàm lưu trạng thái mới
  const handleSaveStatus = async () => {
    if (!selectedId || !newStatus) return;

    try {
      await updateOrderStatus(selectedId, newStatus as OrderStatus);
      toast.success("Cập nhật trạng thái thành công!");
      setShowStatusForm(false);
      setNewStatus("");
      // Refresh lại trang hiện tại
      await fetchOrders(undefined, page, size);
    } catch {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  // Nạp danh sách ban đầu
  useEffect(() => {
    fetchOrders(undefined, 0, 10);
  }, [fetchOrders]);

  if (!orders) return <div>Không có dữ liệu</div>;

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="flex-grow-1 d-flex flex-column">
        <main className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3>Danh sách đơn hàng</h3>
          </div>

          {/* =================== FORM CHỈNH SỬA TRẠNG THÁI (mới thêm) =================== */}
          {showStatusForm && selected && (
            <div className="alert alert-light border mb-3 d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <strong>Đơn #{selected.orderNumber || selected.id}</strong>
                <span>→</span>
                <select
                  className="form-select w-auto"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                >
                  <option value="">Chọn trạng thái mới</option>
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="PREPARING">Đang chuẩn bị</option>
                  <option value="DELIVERING">Đang giao</option>
                  <option value="SUCCEEDED">Hoàn thành</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-success btn-sm"
                  onClick={handleSaveStatus}
                  disabled={updateLoading || !newStatus}
                >
                  {updateLoading ? "Đang lưu..." : "Lưu"}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowStatusForm(false);
                    setNewStatus("");
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Thanh công cụ */}
          <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
            <div className="d-flex align-items-center">
              <label className="form-label mb-0 fw-medium text-muted">Trạng thái đơn hàng: </label>
              <select
                className="form-select"
                style={{ maxWidth: 220, marginLeft: 10, marginRight: 10 }}
                value={statusFilter}
                onChange={handleStatusOrderChange}
              >
                <option value="Tất cả">Tất cả</option>
                <option value="PENDING">Chờ xử lý</option>
                <option value="PREPARING">Đang xử lý</option>
                <option value="SUCCEEDED">Hoàn thành</option>
                <option value="FAILED">Đã hủy</option>
              </select>

              <label className="me-2 mb-0">Thống kê: </label>
              <input type="date" className="form-control" style={{ maxWidth: 170 }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <span className="text-muted mx-2">-</span>
              <input type="date" className="form-control" style={{ maxWidth: 170 }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />

              <button className="btn btn-primary mx-2" onClick={() => { setPage(0); fetchOrdersByDays({ startDate, endDate }); }}>
                Lọc
              </button>

              <button
                className="btn btn-outline-secondary me-3"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setPage(0);
                  fetchOrders(undefined, 0, 10);
                }}
              >
                Xóa lọc
              </button>
            </div>

            {/* NÚT XEM CHI TIẾT */}
            <button
              className="btn btn-info me-2"
              disabled={!selectedId}
              onClick={() => selectedId && setShowDetail(true)}
            >
              Xem chi tiết
            </button>

            {/* NÚT CHỈNH SỬA TRẠNG THÁI */}
            <button
              className="btn btn-warning"
              disabled={!selectedId}
              onClick={() => {
                if (selectedId) {
                  setNewStatus(""); // reset
                  setShowStatusForm(true);
                }
              }}
            >
              Chỉnh sửa trạng thái
            </button>
          </div>

          {/* BẢNG ĐƠN HÀNG */}
          <div className="card">
            <div className="card-body p-2">
              <OrderTable
                data={orders?.content ?? []}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onOpenDetail={(id) => { setSelectedId(id); setShowDetail(true); }}
              />

              {/* Modal chi tiết */}
              {showDetail && selectedId && (
                <OrderDetailModal
                  orderId={selectedId}
                  initial={selected}
                  onClose={() => setShowDetail(false)}
                />
              )}

              {/* Phân trang */}
              <div className="mt-3">
                <AdminPagination
                  page={orders.number}
                  size={orders.size}
                  totalPages={orders.totalPages}
                  totalElements={orders.totalElements}
                  onChangePage={handleChangePage}
                  tieude="đơn hàng"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminOrderPage;