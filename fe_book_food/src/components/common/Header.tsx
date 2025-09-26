// src/components/common/Header.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Header.css";
import { ROUTES } from "../../utils/constants";
import { useOrderDraft } from "../../context/OrderDraftContext"; // ✅

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchParams] = useSearchParams(); //đọc query hiện tại (ví dụ /home?keyword=pho)
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const draft = useOrderDraft();

  // Khi URL đổi (người dùng bấm back/forward, hoặc bạn navigate), effect này chạy.
  useEffect(() => {
    setKeyword(searchParams.get("keyword") ?? "");
  }, [searchParams]);

  //Xử lý submit form tìm kiếm
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault(); //Chặn reload mặc định của form
    const q = keyword.trim(); //Lấy keyword, trim() bỏ khoảng trắng đầu/cuối.
    if (q) navigate(`${ROUTES.HOME}?keyword=${encodeURIComponent(q)}`);
    else navigate(ROUTES.HOME);
  };

  //Tính tổng số lượng món trong giỏ (badge trên icon giỏ hàng)
  const cartQty = useMemo(
    () => draft.items.length,
    [draft.items] //useMemo chỉ tính lại khi draft.items
  );

  return (
    <header className="header-nav py-3">
      <div className="logo-container">
        <span role="img" aria-label="logo" className="logo">🍔</span>
        <Link to={ROUTES.HOME} className="brand">Q.Trường Store</Link>
      </div>

      <div className="nav-links">
        <Link to={ROUTES.HOME} className="nav-link">Trang chủ</Link>
        <Link to={ROUTES.CATEGORY} className="nav-link">Danh mục món ăn</Link>
        <Link to="/about-us" className="nav-link">About Us</Link>
        <Link to="/services" className="nav-link">Services</Link>
        <Link to="/contact" className="nav-link">Contact</Link>

        {/* ✅ Đưa “Đơn hàng” vào menu: có món -> /checkout (chốt), không có -> /orders */}
        {isAuthenticated && (
          <Link className="nav-link" to={ROUTES.ORDERS}>Đơn hàng của tôi</Link>
        )}
      </div>

      <div className="nav-icons">
        {/* Ô tìm kiếm */}
        <div className="search-inline">
          <form className="search-inline" onSubmit={handleSubmit}>
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm món ăn…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)} //set giá trị người dùng nhập từ ô input vào cho keyword
            />
          </form>
        </div>

        {/* icon giỏ hàng: nơi hiển thị những đơn hàng người dùng chưa đặt hàng */}
        <Link to={ROUTES.CHECKOUT} className="position-relative nav-link" aria-label="Giỏ hàng">
          <i className="ti-shopping-cart" />
          {/* nếu số lượng món > 0 thì hiện biểu tượng */}
          {cartQty > 0 && (
            <span
              className="position-absolute translate-middle badge rounded-pill bg-danger"
              style={{ top: 0, right: -8 }}
            >
              {cartQty}
            </span>
          )}
        </Link>

        {isAuthenticated ? (
          <div className="d-flex align-items-center">
            <span className="text-white me-2">Xin chào, {user?.username} 👋</span>
            <button className="btn btn-sm btn-danger" onClick={logout}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link className="nav-link" to="/login" role="img" aria-label="profile">
            <i className="ti-user"></i>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
