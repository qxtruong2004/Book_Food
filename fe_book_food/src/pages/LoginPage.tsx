// src/pages/LoginPage.tsx
import React from "react";
import LoginForm from "../components/auth/LoginForm";

const LoginPage: React.FC = () => {
    return (
        <div className="container d-flex justify-content-center mt-5">
            <div style={{ width: "400px" }}>
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
