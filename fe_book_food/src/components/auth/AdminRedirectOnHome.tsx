import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const normalizeRole = (r?: string) => (r ? r.toUpperCase().replace(/^ROLE_/, "") : "USER");

export default function AdminRedirectOnHome({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const loc = useLocation();

  const role = normalizeRole(user?.role);
  const isAdmin = ["ADMIN", "MANAGER", "STAFF"].includes(role);

  // Nếu đã đăng nhập & đang ở "/" & là admin => tự động chuyển sang /admin
  if (isAuthenticated && loc.pathname === "/" && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
