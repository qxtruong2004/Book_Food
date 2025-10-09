//kiểm tra route, phân quyền

import { is } from "zod/v4/locales";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

//định nghĩa vai trò người dùng
type Role = "ADMIN" | "USER";

export default function ProtectedRouter({
    roles,  //nếu truyền -> yêu cầu đúng 1 trong các role
    children,
}: {
    roles?: Role[];
    children: React.ReactNode; //nd được render nếu user được phép truy cập
}) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />

    //chỉ ktra nếu roles được truyền vào
    //roles.includes() ktra role của user có trong mảng Role kh
    if (roles && !roles.includes((user?.role as Role) ?? "USER")) {
        return <Navigate to={ROUTES.HOME} replace />
    }

    //nếu qua hết ktra, render children
    return <>{children}</>
}