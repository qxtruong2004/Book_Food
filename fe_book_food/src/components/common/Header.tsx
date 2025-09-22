// src/components/common/Header.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

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
};

export default Header;
