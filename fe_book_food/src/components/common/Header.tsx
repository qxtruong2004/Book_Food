// src/components/common/Header.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import './Header.css';
import { ROUTES } from "../../utils/constants";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  // Lấy keyword từ URL để hiện sẵn trong input
  useEffect(() => {
    setKeyword(searchParams.get("keyword") ?? "");
  }, [searchParams]);




  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    if (q) navigate(`${ROUTES.HOME}?keyword=${encodeURIComponent(q)}`);
    else navigate(ROUTES.HOME);
  };



  return (
    <header className="header-nav py-3 " >
      <div className="logo-container">
        <span role="img" aria-label="logo" className="logo">🍔</span>
        <Link to="/" className="brand">Q.Trường Store</Link>
      </div>
      <div className="nav-links">
        <Link to={ROUTES.HOME} className="nav-link">Trang chủ</Link>
        <Link to={ROUTES.CATEGORY} className="nav-link">Danh mục món ăn</Link>
        <Link to="/about-us" className="nav-link">About Us</Link>
        <Link to="/services" className="nav-link">Services</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </div>
      <div className="nav-icons">

        {/* Ô tìm kiếm luôn hiển thị */}
        <div className="search-inline">
          <form className="search-inline" onSubmit={handleSubmit}>
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm món ăn…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {/* Không bắt buộc có nút, nhưng nếu thêm thì để type="submit" */}
            {/* <button type="submit" className="btn btn-light btn-sm">Tìm</button> */}
          </form>
        </div>
        <span role="img" aria-label="cart"><i className="ti-shopping-cart"></i></span>
        {isAuthenticated ? (
          <div className="d-flex align-items-center">
            <span className="text-white me-2">
              Xin chào, {user?.username} 👋
            </span>
            <button className="btn btn-sm btn-danger" onClick={logout}>
              Đăng xuất
            </button>
          </div>

        ) : (
          <>
            <Link className="nav-link" to="/login" role="img" aria-label="profile"><i className="ti-user"></i></Link>
          </>
        )}
      </div>
    </header>
  );
};

/**
  return (
    <nav className="navbar navbar-expand-lg px-3" style={{ backgroundColor: "#ff5722" }}>
      <Link className="navbar-brand fw-bold text-white" to="/">🍔 FoodApp</Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/menu">Menu</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/cart">Giỏ hàng</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/orders">Đơn hàng</Link>
          </li>

          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <span className="nav-link text-white">
                  Xin chào, {user?.username} 👋
                </span>
              </li>
              <li className="nav-item">
                <button className="btn btn-sm btn-light ms-2" onClick={logout}>
                  Đăng xuất
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/login">Đăng nhập</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/register">Đăng ký</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
 */

export default Header;
