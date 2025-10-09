import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Giả sử có hook này để lấy user info

export default function AdminDashboard() {
    const { user, logout } = useAuth(); // Giả sử useAuth trả về user và logout function
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState("2025-10-08"); // Ngày hiện tại theo định dạng YYYY-MM-DD

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    return (
        <div
            className="d-flex"
            style={{ minHeight: "100vh", backgroundColor: "#f1f8e9" }}
        >
            {/* Sidebar */}
            <aside
                className="bg-success border-end sidebar" // Giữ class "sidebar"
                style={{ width: 260, backgroundColor: "#e8f5e8" }}
            >
                <div
                    className="p-3 border-bottom"
                    style={{ backgroundColor: "#4caf50" }}
                >
                    <div className="fw-bold text-white mb-1">
                        🍔 Q. Truong's Store Admin
                    </div>
                </div>
                <nav className="nav flex-column p-2">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `nav-link d-flex align-items-center px-3 py-2 rounded mb-1 ${isActive ? "bg-success active" : "text-dark"}`
                        }
                        style={{ transition: "background-color 0.2s ease" }}
                    >
                        <span className="me-2">🏠</span>
                        Tổng quan
                    </NavLink>
                    <NavLink
                        to="/admin/categories"
                        end
                        className={({ isActive }) =>
                            `nav-link d-flex align-items-center px-3 py-2 rounded mb-1 ${isActive ? "bg-success active" : "text-dark"}`
                        }
                        style={{ transition: "background-color 0.2s ease" }}
                    >
                        <span className="me-2">📂</span>
                        Quản lý danh mục
                    </NavLink>
                    <NavLink
                        to="/admin/foods"
                        end
                        className={({ isActive }) =>
                            `nav-link d-flex align-items-center px-3 py-2 rounded mb-1 ${isActive ? "bg-success active" : "text-dark"}`
                        }
                        style={{ transition: "background-color 0.2s ease" }}
                    >
                        <span className="me-2">🍔</span>
                        Quản lý món ăn
                    </NavLink>
                    <NavLink
                        to="/admin/orders"
                        end
                        className={({ isActive }) =>
                            `nav-link d-flex align-items-center px-3 py-2 rounded mb-1 ${isActive ? "bg-success active" : "text-dark"}`
                        }
                        style={{ transition: "background-color 0.2s ease" }}
                    >
                        <span className="me-2">🛒</span>
                        Quản lý đơn hàng
                    </NavLink>
                    <NavLink
                        to="/admin/revenue"
                        end
                        className={({ isActive }) =>
                            `nav-link d-flex align-items-center px-3 py-2 rounded mb-1 ${isActive ? "bg-success active" : "text-dark"}`
                        }
                        style={{ transition: "background-color 0.2s ease" }}
                    >
                        <span className="me-2">📊</span>
                        Quản lý tài khoản
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-grow-1 d-flex flex-column">
                {/* Header */}
                <header
                    className="bg-white shadow-sm border-bottom px-3 py-2 d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: "#e8f5e8" }}
                >
                    <div className="fw-semibold text-dark">Bảng điều khiển</div>
                    <div className="d-flex align-items-center gap-3">
                        <div>Xin chào, {user?.username || "username"}</div>
                        <button
                            className="btn btn-sm btn-outline-success"
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </button>
                    </div>
                </header>

                <div className="px-4 pb-4">
                    <Outlet />
                </div>
            </div>

            {/* Custom CSS - Chỉ đổi nền, giữ chữ đen */}
            <style>{`
                .nav-link {
                    color: #212529 !important; /* Chữ đen mặc định cho tất cả */
                }
                .nav-link:hover {
                    background-color: #c8e6c9 !important; /* Hover: nền nhẹ */
                    color: #212529 !important; /* Chữ vẫn đen */
                }
                
                .card {
                    border-radius: 12px;
                }
                .table th {
                    border-top: none;
                    color: #4caf50;
                }
                input[type="date"]::-webkit-calendar-picker-indicator {
                    color: #4caf50;
                }
                /* sidebar.css - Cập nhật tương tự */
                .sidebar .nav-link { 
                    transition: background-color .2s; 
                }
                .sidebar .nav-link.active {
                    background: #5a75aaff !important; /* Nền xanh đậm */
                    color: #ebf3f7ff !important; /* Chữ đen */
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
}