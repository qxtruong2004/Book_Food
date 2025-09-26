// src/pages/LoginPage.tsx
import React, { useEffect } from "react";
import LoginForm from "../components/auth/LoginForm";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { ROUTES } from "../utils/constants";

type LocationState = { redirectTo?: string; msg?: string };

const LoginPage: React.FC = () => {
    const location = useLocation();
    const state = (location.state || {}) as LocationState;

    // Nếu từ nút “Thêm vào đơn” chuyển qua, hiện thông báo nhắc đăng nhập
    useEffect(() => {
        if (state.msg) toast.info(state.msg);
    }, [state.msg]);

    const redirectTo = state.redirectTo || ROUTES.HOME; // mặc định về trang chủ sau login

    return (
        <div className="container d-flex justify-content-center mt-5">
            <div style={{ width: "400px" }}>
                {/* Truyền redirectTo xuống form */}
                <LoginForm redirectTo={redirectTo} />
            </div>
        </div>
    );
};


export default LoginPage;
