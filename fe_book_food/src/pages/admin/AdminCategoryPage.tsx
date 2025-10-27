// src/components/category/CategoryPage.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCategory } from "../../hooks/useCategory"; // logic FE của bạn
import { CategoryResponse } from "../../types/category";
import AdminToolbar from "../../components/admin/AdminToolbar";
import CategoryTable from "../../components/admin/admin_category/CategoryTable";
import CategoryFormModal from "../../components/admin/admin_category/CategoryFormModal";
import CategorySearchBar from "../../components/common/SearchBar";
import SearchBar from "../../components/common/SearchBar";

const AdminCategoryPage: React.FC = () => {
  const {
    categories,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories,
    countCategories,
    total,
    loading,
    error
  } = useCategory();

  //id của mục đang chọn
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [keyword, setKeyword] = useState("");

  //Tìm danh mục tương ứng với selectedId từ mảng categories.
  const selected: CategoryResponse | null = useMemo(
    () => categories.find(c => c.id === selectedId) || null,
    [categories, selectedId]
  );

  //form chỉnh sửa, thêm
  const [showForm, setShowForm] = useState(false);
  //chế độ của form
  const [mode, setMode] = useState<"create" | "edit">("create");

  useEffect(() => {
    getAllCategories();
    countCategories();
  }, [getAllCategories, total, countCategories]);

  // khi đổi trang trong chế độ có keyword
  useEffect(() => {
    if (keyword.trim()) {
      searchCategories(keyword);
    }
  }, [keyword, searchCategories]);

  // CategoryPage.tsx
  const onSearch = useCallback(async (kw: string) => {
    setSelectedId(null);

    if (kw.trim()) {
      await searchCategories(kw.trim());
    } else {
      await getAllCategories();
    }
  }, [searchCategories, getAllCategories]);



  const onClear = async () => {
    setKeyword("");
    setSelectedId(null);
    await getAllCategories();
  };


  const openCreate = () => { setMode("create"); setShowForm(true); }; //Mở modal ở chế độ tạo mới
  const openEdit = () => { if (!selected) return; setMode("edit"); setShowForm(true); }; //mở modal chỉnh sửa, nếu chưa chọn thì kh mở

  const handleDelete = async () => {
    if (!selected) return; //nếu chưa chọn, kh cho xóa
    if (!window.confirm(`Xóa danh mục "${selected.name}"?`)) return;
    await deleteCategory(selected.id);
    setSelectedId(null);
    // refresh theo chế độ hiện tại
    if (keyword) await searchCategories(keyword);
    else await getAllCategories();
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="flex-grow-1 d-flex flex-column">
        <header className="px-3 py-2 border-bottom " style={{ backgroundColor: "#cfd3df" }}>
          <AdminToolbar
            canEdit={!!selected} //true nếu có selected (double ! để convert null -> false).
            onAdd={openCreate}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </header>

        <main className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3>Danh sách danh mục</h3>
            <SearchBar
              initialValue={keyword}
              placeholder="Tìm kiếm danh mục"
              onSearch={onSearch}
              onClear={onClear}
              debounceMs={500}      //auto search sau 500ms nên kh cần show button
              showButtons={false}
            />
          </div>
          <h5>Tổng số lượng danh mục: {total}</h5>

          {loading && <div className="alert alert-info py-2">Đang tải dữ liệu…</div>}
          {error && <div className="alert alert-danger py-2">{String(error)}</div>}

          <CategoryTable
            items={categories}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </main>
      </div>

      {/*chỉ render neu showform true  */}
      {showForm && (
        <CategoryFormModal
          mode={mode}
          initial={mode === "edit" ? selected ?? undefined : undefined} //Dữ liệu khởi tạo (selected nếu edit, undefined nếu create).
          onClose={() => setShowForm(false)}
          onSubmit={async (dto) => {
            if (mode === "create") await createCategory(dto);
            else if (selected) await updateCategory(selected.id, dto);
            setShowForm(false);
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminCategoryPage;
