import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";

type OrderStatus = "PENDING"|"PREPARING"|"DELIVERING"|"SUCCEEDED"|"CANCELED";

type OrderRow = {
  id: number;
  customerName: string;
  phone?: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
};

type PageResp<T> = {
  content: T[];
  totalElements: number;
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  PENDING: "secondary",
  PREPARING: "warning",
  DELIVERING: "info",
  SUCCEEDED: "success",
  CANCELED: "danger",
};

export default function AdminOrders() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage]   = useState(0);
  const [size, setSize]   = useState(10);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const canNext = useMemo(()=> (page+1)*size < total, [page,size,total]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get<PageResp<OrderRow>>("/api/admin/orders", {
        params: {
          page, size,
          sort: "createdAt,desc",
          status: status || undefined,
          keyword: keyword || undefined,
        }
      });
      setRows(res.data?.content ?? []);
      setTotal(res.data?.totalElements ?? 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchData(); }, [page, size, status]); // keyword tìm theo Enter

  const changeStatus = async (id:number, next:OrderStatus) => {
    await api.patch(`/api/admin/orders/${id}/status`, { status: next });
    fetchData();
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchData();
  };

  return (
    <div className="card">
      <div className="card-header d-flex flex-wrap gap-2 align-items-center">
        <form className="d-flex gap-2" onSubmit={onSearch}>
          <input
            className="form-control"
            placeholder="Tìm theo tên/điện thoại/ID…"
            value={keyword}
            onChange={e=>setKeyword(e.target.value)}
            style={{maxWidth: 320}}
          />
          <button className="btn btn-outline-secondary" type="submit">Tìm</button>
        </form>
        <div className="ms-auto d-flex gap-2">
          <select className="form-select w-auto" value={status}
                  onChange={e=>{ setPage(0); setStatus(e.target.value as any); }}>
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">PENDING</option>
            <option value="PREPARING">PREPARING</option>
            <option value="DELIVERING">DELIVERING</option>
            <option value="SUCCEEDED">SUCCEEDED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
          <select className="form-select w-auto" value={size}
                  onChange={e=>{ setPage(0); setSize(Number(e.target.value)); }}>
            <option>10</option><option>20</option><option>50</option>
          </select>
        </div>
      </div>

      <div className="card-body p-0">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
          <tr>
            <th>#</th><th>Khách</th><th>Tổng</th><th>Ngày</th><th>Trạng thái</th><th className="text-end">Thao tác</th>
          </tr>
          </thead>
          <tbody>
          {loading ? (
            <tr><td colSpan={6} className="text-center py-4">Đang tải…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-4">Không có đơn</td></tr>
          ) : rows.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customerName}<div className="small text-muted">{o.phone}</div></td>
              <td>{o.totalAmount?.toLocaleString("vi-VN")} ₫</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td><span className={`badge bg-${STATUS_BADGE[o.status]}`}>{o.status}</span></td>
              <td className="text-end">
                {o.status==="PENDING"    && <button className="btn btn-sm btn-outline-primary me-1" onClick={()=>changeStatus(o.id,"PREPARING")}>Chuẩn bị</button>}
                {o.status==="PREPARING"  && <button className="btn btn-sm btn-outline-primary me-1" onClick={()=>changeStatus(o.id,"DELIVERING")}>Giao hàng</button>}
                {o.status==="DELIVERING" && <button className="btn btn-sm btn-success me-1"        onClick={()=>changeStatus(o.id,"SUCCEEDED")}>Hoàn tất</button>}
                {o.status!=="SUCCEEDED" && o.status!=="CANCELED" &&
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>changeStatus(o.id,"CANCELED")}>Hủy</button>}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      <div className="card-footer d-flex justify-content-between align-items-center">
        <div>Trang {page+1}/{Math.max(1, Math.ceil(total/size))} • {total} đơn</div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary" disabled={page===0} onClick={()=>setPage(p=>p-1)}>Trước</button>
          <button className="btn btn-sm btn-outline-secondary" disabled={!canNext} onClick={()=>setPage(p=>p+1)}>Sau</button>
        </div>
      </div>
    </div>
  );
}
