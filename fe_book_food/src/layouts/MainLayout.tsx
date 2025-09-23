// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Outlet /> {/* Render các trang con */}
      </main>
      <Footer />
    </div>
  );
}