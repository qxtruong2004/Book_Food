import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";

type FoodRow = {
  id: number;
  name: string;
  price: number;
  stock?: number;
  active?: boolean;
  imageUrl?: string;
  categoryName?: string;
  createdAt?: string;
};

type PageResp<T> = { content: T[]; totalElements: number };

export default function AdminFoods() {
  const [rows, setRows]   = useState<FoodRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage]   = useState(0);
  const [size, setSize]   = useState(10);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FoodRow | null>(null);

  const canNext = useMemo(()=> (page+1)*size < total, [page,size,total]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get<PageResp<FoodRow>>("/api/admin/foods", {
        params: { page, size, sort: "id,desc", keyword: keyword || undefined }
      });
      setRows(res.data?.content ?? []);
      setTotal(res.data?.totalElements ?? 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchData(); }, [page, size]); // keyword theo Enter

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchData();
  };

  const handleDeleteClick = (item: FoodRow) => {
    setItemToDelete(item);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/api/admin/foods/${itemToDelete.id}`);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      // Có thể thêm toast notification ở đây
    } finally {
      setShowConfirm(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setItemToDelete(null);
  };

  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-wrap gap-2 align-items-center">
          <div className="fw-semibold">Quản lý món ăn</div>
          <form className="d-flex gap-2 ms-auto" onSubmit={onSearch}>
            <input
              className="form-control"
              placeholder="Tìm theo tên…"
              value={keyword}
              onChange={e=>setKeyword(e.target.value)}
              style={{maxWidth: 280}}
            />
            <button className="btn btn-outline-secondary" type="submit">Tìm</button>
            <button className="btn btn-primary" type="button" onClick={()=>alert("TODO: điều hướng /admin/foods/create hoặc mở modal tạo mới")}>
              + Tạo món
            </button>
          </form>
        </div>

        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
            <tr>
              <th>#</th><th>Ảnh</th><th>Tên</th><th>Giá</th><th>Tồn</th><th>TT</th><th className="text-end">Thao tác</th>
            </tr>
            </thead>
            <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-4">Đang tải…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4">Không có dữ liệu</td></tr>
            ) : rows.map(f => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.imageUrl && <img src={f.imageUrl} alt={f.name} style={{height:40}} />}</td>
                <td>
                  {f.name}
                  {f.categoryName && <div className="small text-muted">{f.categoryName}</div>}
                </td>
                <td>{f.price?.toLocaleString("vi-VN")} ₫</td>
                <td>{f.stock ?? 0}</td>
                <td>
                  <span className={`badge bg-${f.active ? "success":"secondary"}`}>
                    {f.active ? "Hiển thị" : "Ẩn"}
                  </span>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-1"
                          onClick={()=>alert(`TODO: điều hướng /admin/foods/${f.id}/edit hoặc mở modal chỉnh sửa`)}>
                    Sửa
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>handleDeleteClick(f)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>

        <div className="card-footer d-flex justify-content-between align-items-center">
          <div>Trang {page+1}/{Math.max(1, Math.ceil(total/size))} • {total} món</div>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-secondary" disabled={page===0} onClick={()=>setPage(p=>p-1)}>Trước</button>
            <button className="btn btn-sm btn-outline-secondary" disabled={!canNext} onClick={()=>setPage(p=>p+1)}>Sau</button>
            <select className="form-select form-select-sm w-auto" value={size}
                    onChange={e=>{ setPage(0); setSize(Number(e.target.value)); }}>
              <option>10</option><option>20</option><option>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Custom Confirm Modal */}
      {showConfirm && itemToDelete && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050
          }}
          onClick={cancelDelete}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h5 className="mb-3">Xác nhận xóa</h5>
            <p>Bạn có chắc chắn muốn xóa món "{itemToDelete.name}"?</p>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-secondary" onClick={cancelDelete}>Hủy</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}