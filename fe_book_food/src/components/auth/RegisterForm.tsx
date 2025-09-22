// src/components/auth/RegisterForm.tsx
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { isEmailValid } from "../../utils/helpers";

const RegisterForm: React.FC = () => {
    const { register, loading } = useAuth();
    const [fullName, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState({
        username: "",
        email: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!isEmailValid(email)) {
            toast.error("Email không hợp lệ", {
                position: "top-center",
                autoClose: 1000,
            });
            return;
        }

        //nếu ok thì gọi đến api
        try {
            //gọi register từ useAuth
            await register({ fullName, username, email, password }); //ở đây kh cần truyền đường dẫn nữa vì xét bên useAuh r
            toast.success("🎉 Đăng kí thành công!", {
                position: "top-center",
                autoClose: 1500, // tự tắt sau 1,5 giây
            });
        }
        catch (err: any) {
            const message = err;

            //resert error cũ
            setFieldErrors({ username: "", email: "" });

            if (message.toLowerCase().includes("username")) {
                setFieldErrors(prev => ({ ...prev, username: message }));
            }
            else if (message.toLowerCase().includes("email")) {
                setFieldErrors(prev => ({ ...prev, email: message }));
            }

        }
        console.log("Register clicked:", { fullName, username, email, password });
    };

    return (
        <form className="p-4 border rounded bg-light" onSubmit={handleSubmit}>
            <h2 className="mb-3 text-center">Đăng ký</h2>

            {/* tên người dùng */}
            <div className="mb-3">
                <label className="form-label">Tên người dùng</label>
                <input
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Nhập tên người dùng..."
                />
            </div>

            {/* username */}
            <div className="mb-3">
                <label className="form-label">Tên tài khoản</label>
                <input
                    type="text"
                    className={`form-control ${fieldErrors.username ? "is-invalid" : ""}`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên tài khoản..."
                />
                {fieldErrors.username && (<div className="invalid-feedback"> {fieldErrors.username}</div>)}
            </div>

            {/* email */}
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email..."
                />
                {fieldErrors.email && (<div className="invalid-feedback"> {fieldErrors.email}</div>)}
            </div>

            {/* mật khẩu */}
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

            <button type="submit" className="btn btn-success w-100">
                Đăng ký
            </button>
        </form>
    );
};

export default RegisterForm;
