// src/pages/LoginPage.tsx
import React from "react";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
    return (
        <div className="container d-flex justify-content-center mt-5">
            <div style={{ width: "400px" }}>
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;
