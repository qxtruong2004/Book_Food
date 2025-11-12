import { useEffect, useMemo, useState } from "react";
import OrderTable from "../../components/admin/admin_order/OrderTable";
import { useOrder } from "../../hooks/useOrder"
import { OrderResponse, OrderStatus, StatusOrderKey } from "../../types/order";
import AdminPagination from "../../components/common/AdminPagination";
import OrderStatusBadge from "../../components/common/OrderStatusBadge";


const AdminOrderPage: React.FC = () => {
  const { orders, fetchOrders, fetchOrdersByDays } = useOrder();

  //chọn dòng
  const [selectedId, setSelectedId] = useState<number | null>(null);

  //phân trang
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  //tìm kiếm + lọc
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusOrderKey>("Tất cả")

  //thống kê theo ngày
  const [startDate, setStartDate] = useState<string>("");
const [endDate, setEndDate] = useState<string>("");

  //bản ghi đang chọn
  const selected: OrderResponse | null = useMemo(() => {
    const content = orders?.content ?? [];
    return content.find((u) => u.id === selectedId) || null;
  }, [orders, selectedId]);

  //lọc trạng thái order
  const handleStatusOrderChange: React.ChangeEventHandler<HTMLSelectElement> = async (e) => {
    const val = e.target.value as StatusOrderKey;
    setStatusFilter(val);
    setPage(0);
    if (val === "Tất cả") {
      await fetchOrders(OrderStatus.SUCCEEDED, 0, size);
      return;
    }
    else {
      await fetchOrders(OrderStatus[val], 0, size);
    }
  }

  //chuyển trang
  const handleChangePage = async (next: number) => {
    setPage(next);
    await fetchOrders(undefined, next, size);
  }

  //nạp danh sách ban đầu
  useEffect(() => {
    fetchOrders(undefined, 0, 10);
  }, [fetchOrders])

  if (!orders) return <div>Không có dữ liệu</div>;

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="flex-grow-1 d-flex flex-column">

        <main className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3>Danh sách đơn hàng</h3>
          </div>

          {/* các ô lọc, thống kê */}
          <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
            {/* Filter tình trạng giữ nguyên */}
            <div className="d-flex align-items-center ms-2">
              <label className="me-2 mb-0">Trạng thái đơn hàng: </label>
              <select
                className="form-select"
                style={{ maxWidth: 220 }}
                value={statusFilter}
                onChange={handleStatusOrderChange}>
                <option value="Tất cả">Tất cả</option>
                <option value="PENDING">Chờ xử lý</option>
                <option value="PREPARING">Đang xử lý</option>
                <option value="SUCCEEDED">Hoàn thành</option>
                <option value="FAILED">Đã hủy</option>
              </select>
              <label className="me-2 mb-0">Thống kê: </label>
              <input
                type="date"
                className="form-control"
                style={{ maxWidth: 170 }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Từ ngày"
              />
              <span className="text-muted">—</span>
              <input
                type="date"
                className="form-control"
                style={{ maxWidth: 170 }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Đến ngày"
              />

              <button
                className="btn btn-primary"
                onClick={() => {
                  setPage(0);
                  fetchOrdersByDays({startDate, endDate} );
                }}
              >
              Lọc
            </button>

            <button
              className="btn btn-outline-secondary"
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
      </div>

      <div className="card">
        <div className="card-body p-2">
          <OrderTable
            data={orders?.content ?? []}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

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
      </div >



    </div >
  );
}
export default AdminOrderPage;