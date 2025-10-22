import { useEffect, useMemo, useState } from "react";
import FoodTable from "../../components/admin/admin_food/FoodTable";
import { useFood } from "../../hooks/useFood";
import AdminPagination from "../../components/common/AdminPagination";
import { fetchAllFoodsByAdminAsync } from "../../store/foodSlice";
import { useDispatch } from "react-redux";
import { size } from "zod";
import AdminToolbar from "../../components/admin/AdminToolbar";
import { CreateFoodRequest, FoodResponse } from "../../types/food";
import FoodFormModal from "../../components/admin/admin_food/FoodFormModal";

const AdminFoodPage: React.FC = () => {
  const { managerFood, createFood, fetchAllFoodsAdmin, loading, deleteFood } = useFood();

  //id món đang chọn
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  //món đang được chọn
  const selected: FoodResponse | null = useMemo(() => {
    const content = managerFood?.content ?? [];
    return content.find((u) => u.id === selectedId) || null;
  }, [managerFood, selectedId])

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);


  const openCreate = () => {
    setMode("create");
    setShowForm(true);
  }

  const openEdit = () => {
    if (!selected) return;
    setMode("edit");
    setShowForm(true);
  }

  const handleDelete = async () => {
    if (!selected) return;
    const confirmMsg = ` Xóa món "${selected.name}"`
    if (!window.confirm(confirmMsg)) return;
    await deleteFood(selected.id);
    //reload trang 
    await fetchAllFoodsAdmin(managerFood?.number ?? 0, managerFood?.size ?? 5)
  }

  useEffect(() => {
    fetchAllFoodsAdmin(page, size);
  }, [fetchAllFoodsAdmin, page, size])

  if (loading) return <div>Đang tải…</div>;
  if (!managerFood) return <div>Không có dữ liệu</div>; // đã loại null

  const handleChangePage = (next: number) => {
    setPage(next);
  };

  const handleChangeSize = (nextSize: number) => {
    // về trang 0 khi đổi size
    fetchAllFoodsByAdminAsync({ page: 0, size: nextSize });
  };

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
                  size={managerFood?.size}
                  totalPages={managerFood.totalPages}
                  totalElements={managerFood?.totalElements}
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
          // initial={mode === "edit" ? selected ?? undefined : undefined}
          onClose={() => setShowForm(false)}
          onSubmit={async (dto, ctx) => {
            if (ctx.mode === "create") {
              const createDto = dto as CreateFoodRequest;
              await createFood(createDto);
            }
            // reload trang hiện tại
            await fetchAllFoodsAdmin();
            setShowForm(false);
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminFoodPage;
