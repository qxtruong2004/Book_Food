// src/pages/admin/AdminFoodPage.tsx
import { useEffect, useMemo, useState } from "react";
import FoodTable from "../../components/admin/admin_food/FoodTable";
import { useFood } from "../../hooks/useFood";
import AdminPagination from "../../components/common/AdminPagination";
import AdminToolbar from "../../components/admin/AdminToolbar";
import { CreateFoodRequest, FoodResponse, FoodSearchParams, UpdateFoodRequest } from "../../types/food";
import FoodFormModal from "../../components/admin/admin_food/FoodFormModal";
import { toast } from "react-toastify";

type StatusKey = "ALL" | "AVAILABLE" | "UNAVAILABLE";

const AdminFoodPage: React.FC = () => {
  const {
    managerFood,
    createFood,
    fetchAllFoodsAdmin,
    loading,
    deleteFood,
    updateFood,
    searchFoods,
    clearFoodSearchResults,
  } = useFood();

  // chọn dòng
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // modal form
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  // bản ghi đang chọn
  const selected: FoodResponse | null = useMemo(() => {
    const content = managerFood?.content ?? [];
    return content.find((u) => u.id === selectedId) || null;
  }, [managerFood, selectedId]);

  // phân trang
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // tìm kiếm + lọc
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusKey>("ALL");

  // nạp danh sách ban đầu
  useEffect(() => {
    fetchAllFoodsAdmin(0, size);
  }, [fetchAllFoodsAdmin, size]);


  const openCreate = () => {
    setMode("create");
    setShowForm(true);
  };

  const openEdit = () => {
    if (!selected) return;
    setMode("edit");
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!selected) return;
    const confirmMsg = `Xóa món "${selected.name}"?`;
    if (!window.confirm(confirmMsg)) return;
    await deleteFood(selected.id);
    await fetchAllFoodsAdmin(managerFood?.number ?? 0, managerFood?.size ?? 10);
    setSelectedId(null);
    toast.success("Đã xóa thành công");
  };

  const toIsAvailable = (k: StatusKey): boolean | undefined =>
    k === "ALL" ? undefined : k === "AVAILABLE" ? true : false;

  // gọi tìm kiếm (giữ ngữ cảnh page/size)
  const doSearch = async (nextPage: number, nextSize: number, status?: StatusKey) => {
    const key = status ?? statusFilter;
    const params: FoodSearchParams = {
      page: nextPage,
      size: nextSize,
      keyword: keyword.trim() || undefined,
      isAvailable: toIsAvailable(key),
    };
    await searchFoods(params);
  };

  const handleStatusChange: React.ChangeEventHandler<HTMLSelectElement> = async (e) => {
    const val = e.target.value as StatusKey;
    setStatusFilter(val);
    setPage(0);

    if (val === "ALL") {
      await fetchAllFoodsAdmin(0, size);
      return;
    }
    await doSearch(0, size, val);
  }

  // bấm nút tìm kiếm
  const handleSearchClick = async () => {
    setPage(0);
    await doSearch(0, size);
  };

  // xóa filter
  const handleClear = async () => {
    setKeyword("");
    setStatusFilter("ALL");
    clearFoodSearchResults?.();
    setPage(0);
    await fetchAllFoodsAdmin(0, size);
  };

  // Enter để tìm
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  // đổi trang
  const handleChangePage = async (next: number) => {
    setPage(next);
    if (keyword.trim() || statusFilter !== "ALL") {
      await doSearch(next, size);
    } else {
      await fetchAllFoodsAdmin(next, size);
    }
  };

  // đổi kích thước trang
  const handleChangeSize = async (nextSize: number) => {
    setSize(nextSize);
    setPage(0);
    if (keyword.trim() || statusFilter !== "ALL") {
      await doSearch(0, nextSize);
    } else {
      await fetchAllFoodsAdmin(0, nextSize);
    }
  };

  if (loading) return <div>Đang tải…</div>;
  if (!managerFood) return <div>Không có dữ liệu</div>;

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="flex-grow-1 d-flex flex-column">
        <header className="px-3 py-2 border-bottom" style={{ backgroundColor: "#cfd3df" }}>
          <AdminToolbar
            canEdit={!!selected}
            onAdd={openCreate}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </header>

        <main className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3>Danh sách món ăn</h3>
          </div>

          {/* Thanh tìm kiếm + lọc */}
          <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
            {/* Ô tìm kiếm và nút riêng biệt với gap để tránh dính sát */}
            <div className="d-flex align-items-center gap-2" style={{ maxWidth: 420 }}>
              <input
                type="text"
                className="form-control flex-grow-1"  // Thêm flex-grow-1 để input chiếm không gian
                placeholder="Tìm theo tên món…"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
              <button className="btn btn-primary" type="button" onClick={handleSearchClick}>
                Tìm
              </button>
              <button className="btn btn-outline-secondary" type="button" onClick={handleClear}>
                Xóa
              </button>
            </div>

            {/* Filter tình trạng giữ nguyên */}
            <div className="d-flex align-items-center ms-2">
              <label className="me-2 mb-0">Tình trạng:</label>
              <select
                className="form-select"
                style={{ maxWidth: 220 }}
                value={statusFilter}
                onChange={handleStatusChange}
              >
                <option value="ALL">Tất cả</option>
                <option value="AVAILABLE">Còn hàng</option>
                <option value="UNAVAILABLE">Hết hàng</option>
              </select>
            </div>
          </div>

          <div className="card">
            <div className="card-body p-2">
              <FoodTable
                data={managerFood?.content ?? []}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />

              <div className="mt-3">
                <AdminPagination
                  page={managerFood.number}
                  size={managerFood.size}
                  totalPages={managerFood.totalPages}
                  totalElements={managerFood.totalElements}
                  onChangePage={handleChangePage}
                  onChangeSize={handleChangeSize}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal tạo/sửa */}
      {showForm && (
        <FoodFormModal
          mode={mode}
          initial={mode === "edit" ? selected ?? undefined : undefined}
          onClose={() => setShowForm(false)}
          onSubmit={async (dto, ctx) => {
            if (ctx.mode === "create") {
              const createDto = dto as CreateFoodRequest;
              await createFood(createDto);
            } else {
              const updateDto = dto as UpdateFoodRequest;
              await updateFood(selected?.id ?? 0, updateDto);
            }

            // reload theo ngữ cảnh hiện tại (đang filter hay không)
            if (keyword.trim() || statusFilter !== "ALL") {
              await doSearch(page, size);
            } else {
              await fetchAllFoodsAdmin(page, size);
            }

            setShowForm(false);
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminFoodPage;
