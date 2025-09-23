// src/components/auth/LoginForm.tsx
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Loading from "../common/Loading";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "../../App.css"
const LoginForm: React.FC = () => {
    const { login, loading } = useAuth(); // lấy login từ useAuth
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // reset error trước khi login
        try {
            // Gọi login từ useAuth
            await login({ username, password }, "/");
            toast.success("🎉 Đăng nhập thành công!", {
                position: "top-center",
                autoClose: 2000, // tự tắt sau 2 giây
            });
        } catch (err: any) {
            toast.error(
                err.response?.data?.message ||
                "❌ Sai tài khoản hoặc mật khẩu!",
                {
                    position: "top-center",
                    autoClose: 2000, // tự tắt sau 2 giây
                }
            );
        }

    };

    return (
        <form className="p-4 border rounded bg-light" onSubmit={handleSubmit}>
            <h2 className="mb-3 text-center">Đăng nhập</h2>

            <div className="mb-3">
                <label className="form-label">Tên tài khoản</label>
                <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập email..."
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Mật khẩu</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-100">
                {loading && (
                    <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                    ></span>
                )}
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <div className="text-center" style={{paddingTop: "10px"}}>
                <Link to="/register">Bạn chưa có tài khoản? Đăng kí tại đây.</Link>
            </div>
        </form>
    );
};

export default LoginForm;
