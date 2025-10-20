import { useEffect, useMemo, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { ChangeStatusUserRequest, StatusKey, UpdateUserRequest, UserResponse, UserStatus } from "../../types/user";
import AdminToolbar from "../../components/admin/AdminToolbar";
import UserTable from "../../components/admin/admin_user/UserTable";
import AdminFormModal from "../../components/admin/admin_user/AdminFormModal";
import { useAuth } from "../../hooks/useAuth";
import { UserRegisterRequest } from "../../types/auth";

const AdminUserPage: React.FC = () => {
    const {
        // state
        pagedUsers,
        userQuery,
        loading,
        error,
        // actions
        searchUsers,
        goToPage,
        setSize,
        setSort,
        setName,
        updateUserByAdmin,
        changeUserStatus,
        statusFilter, setStatusFilter
    } = useUser();

    const { adminCreateAccount } = useAuth();

    // id của mục đang chọn
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // User được chọn
    const selected: UserResponse | null = useMemo(() => {
        const content = pagedUsers?.content ?? [];
        return content.find((u) => u.id === selectedId) || null;
    }, [pagedUsers, selectedId]);

    // form thêm/sửa
    const [showForm, setShowForm] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");


    // Gọi search mỗi khi query đổi
    useEffect(() => {
        searchUsers({ status: statusFilter });
    }, [userQuery.page, userQuery.size, userQuery.sort, userQuery.name, statusFilter]);

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

        const isActive = selected.status === UserStatus.ACTIVE;
        const nextStatus = isActive ? UserStatus.BLOCKED : UserStatus.ACTIVE;
        const confirmMsg = isActive
            ? `Vô hiệu hóa người dùng "${selected.username}" ?`
            : `Khôi phục người dùng "${selected.username}"?`;

        if (!window.confirm(confirmMsg)) return;

        const payload: ChangeStatusUserRequest = { status: nextStatus };
        await changeUserStatus(selected.id, payload);

        // reload trang hiện tại
        await searchUsers();
        setSelectedId(null);
    };


    const from =
        pagedUsers ? pagedUsers.number * pagedUsers.size + 1 : 0;
    const to =
        pagedUsers ? pagedUsers.number * pagedUsers.size + pagedUsers.content.length : 0;

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
                        <h3>Danh sách tài khoản</h3>
                    </div>

                    {/* Thanh tìm kiếm + điều khiển phân trang */}
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        <input
                            className="form-control"
                            style={{ maxWidth: 280 }}
                            placeholder="Tìm theo tên…"
                            value={userQuery.name ?? ""}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <select
                            className="form-select"
                            style={{ maxWidth: 140 }}
                            value={userQuery.size}
                            onChange={(e) => setSize(Number(e.target.value))}
                        >
                            <option value={5}>5 / trang</option>
                            <option value={10}>10 / trang</option>
                            <option value={20}>20 / trang</option>
                            <option value={50}>50 / trang</option>
                        </select>
                        <label style={{ display: 'flex', alignItems: 'center' }}>Lọc theo:</label>
                        <select
                            className="form-select"
                            style={{ maxWidth: 220 }}
                            value={userQuery.sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="createdAt,desc">Mới nhất</option>
                            <option value="createdAt,asc">Cũ nhất</option>
                        </select>

                        {/* lọc theo trạng thái */}
                        <label style={{ display: 'flex', alignItems: 'center' }}>Status:</label>
                        <select
                            className="form-select"
                            style={{ maxWidth: 220 }}
                            value={statusFilter}
                            onChange={e => {setStatusFilter(e.target.value as StatusKey) ; goToPage(0); }}
                        >
                            <option value="ALL">Tất cả</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="BLOCKED">BLOCKED</option>
                        </select>


                    </div>

                    {loading && <div className="alert alert-info py-2">Đang tải dữ liệu…</div>}
                    {error && <div className="alert alert-danger py-2">{String(error)}</div>}

                    <div className="card">
                        <div className="card-body p-2">
                            <UserTable
                                data={pagedUsers?.content ?? []} // 👈 dùng dữ liệu trang hiện tại
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                            />

                            {/* Footer phân trang */}
                            <div className="d-flex justify-content-between align-items-center px-2 py-2">
                                <small className="text-muted">
                                    {pagedUsers?.totalElements
                                        ? `Hiển thị ${from}–${to} trên ${pagedUsers.totalElements}`
                                        : "Không có dữ liệu"}
                                </small>

                                <nav aria-label="pagination">
                                    <ul className="pagination mb-0">
                                        <li className={`page-item ${!pagedUsers || (userQuery.page ?? 0) === 0 ? "disabled" : ""}`}>
                                            <button className="page-link" onClick={() => goToPage((userQuery.page ?? 0) - 1)}>
                                                «
                                            </button>
                                        </li>

                                        {/* Hiển thị vài trang quanh trang hiện tại */}
                                        {Array.from({ length: pagedUsers?.totalPages ?? 0 }).map((_, i) => {
                                            const cur = pagedUsers?.number ?? 0;
                                            const near = Math.abs(i - cur) <= 1 || i < 2 || i >= (pagedUsers!.totalPages - 2);
                                            if (!near) return null;
                                            return (
                                                <li key={i} className={`page-item ${i === cur ? "active" : ""}`}>
                                                    <button className="page-link" onClick={() => goToPage(i)}>
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            );
                                        })}

                                        <li
                                            className={`page-item ${!pagedUsers || (userQuery.page ?? 0) >= (pagedUsers.totalPages - 1) ? "disabled" : ""
                                                }`}
                                        >
                                            <button className="page-link" onClick={() => goToPage((userQuery.page ?? 0) + 1)}>
                                                »
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal tạo/sửa */}
            {showForm && (
                <AdminFormModal
                    mode={mode}
                    initial={mode === "edit" ? selected ?? undefined : undefined}
                    onClose={() => setShowForm(false)}
                    onSubmit={async (dto, ctx) => {
                        if (ctx.mode === "create") {
                            const createDto = dto as UserRegisterRequest;
                            await adminCreateAccount(createDto);
                        } else if (selected) {
                            const updateDto = dto as UpdateUserRequest;
                            await updateUserByAdmin(selected.id, updateDto);
                        }
                        // reload trang hiện tại
                        await searchUsers();
                        setShowForm(false);
                        setSelectedId(null);
                    }}
                />
            )}
        </div>
    );
};

export default AdminUserPage;
