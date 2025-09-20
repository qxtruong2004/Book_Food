import { useDispatch, useSelector } from "react-redux"
import { toast } from 'react-hot-toast';
import { AppDispatch, RootState } from "../store"
import { useNavigate } from "react-router-dom"
import { useCallback } from "react"
import { UserLoginRequest, UserRegisterRequest } from "../types/auth"
import { clearCredentials, clearError, getCurrentUserAsync, loginAsync, logoutAsync, refreshTokenAsync, registerAsync } from "../store/authSlice"

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    //Lấy hàm điều hướng của react-router-dom (vào trang khác bằng navigate('/path')).
    const navigate = useNavigate();
    /*
        Lấy trạng thái liên quan auth từ Redux store (state.auth).
        RootState là kiểu toàn cục của store.
        Bạn sẽ có các biến (user, token, ...) để dùng trong UI hoặc logic của hook.
     */
    const { user, token, refreshToken, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

    //login
    /*
        gọi loginAsync (thunk) để đăng nhập,
        nhận kết quả (hoặc lỗi) bằng .unwrap(),
        hiện thông báo (toast) và điều hướng (navigate) khi đăng nhập thành công,
        ném lỗi lên component khi thất bại để component có thể xử lý tiếp.
    */
    const login = useCallback(
        async (credentials: UserLoginRequest, redirectPath = "/") => {
            try {
                //trả về một thunk action (promise).
                /*
                    .unwrap() là tiện ích của Redux Toolkit:
                    nếu thunk fulfilled → trả payload (giá trị trả về từ loginAsync),
                    nếu thunk rejected → .unwrap() ném (throw) lỗi (thường là value đã rejectWithValue(...) hoặc error).
                    Nhờ .unwrap() bạn xử lý success/fail bằng try/catch thay vì phải check match(result).
                */
                const result = await dispatch(loginAsync(credentials)).unwrap();
                toast.success("Login successful");
                //Điều hướng người dùng sang trang mong muốn sau khi login thành công
                navigate(redirectPath);
                return result;
            }
            catch (err: any) {
                toast.error(err || "Login failed");
                throw err;
            }
        },
        [dispatch, navigate]
    );

    //register
    const register = useCallback(
        async (userData: UserRegisterRequest, redirectPath = "/") => {
            try {
                const result = await dispatch(registerAsync(userData)).unwrap();
                toast.success("Registration successful!");
                navigate(redirectPath);
                return result;
            } catch (err: any) {
                const msg = typeof err === "string" ? err : err?.message || "Registration failed";
                toast.error(msg);
                throw err;
            }
        },
        [dispatch, navigate]
    );

    // Logout function
    const logout = useCallback(async () => {
        try {
            // unwrap() sẽ throw nếu logoutAsync bị rejected
            await dispatch(logoutAsync()).unwrap();
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (err: any) {
            console.error("Logout error:", err);
            // đảm bảo xóa credential & giỏ hàng dù server logout có lỗi
            dispatch(clearCredentials());
            navigate("/login");
            // không rethrow (thường UI không cần xử lý thêm khi logout thất bại)
        }
    }, [dispatch, navigate]);

    // Get current user function
    const getCurrentUser = useCallback(async () => {
        try {
            const user = await dispatch(getCurrentUserAsync()).unwrap();
            return user;
        } catch (err: any) {
            console.error("Get current user error:", err);
            throw err;
        }
    }, [dispatch]);

    // Refresh token function
    const refreshAccessToken = useCallback(async () => {
        try {
            const result = await dispatch(refreshTokenAsync()).unwrap();
            return result;
        } catch (err: any) {
            console.error("Token refresh error:", err);
            // Nếu refresh thất bại thì clear credentials và bắt người dùng login lại
            dispatch(clearCredentials());
            navigate("/login");
            throw err;
        }
    }, [dispatch, navigate]);

    // Clear error function
    const clearAuthError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Check if user has role
    const hasRole = useCallback((role: string): boolean => {
        return user?.role === role;
    }, [user]);

    // Check if user is admin
    const isAdmin = useCallback((): boolean => hasRole("ADMIN"), [hasRole]);

    // Check if user is customer
    const isCustomer = useCallback((): boolean => hasRole("USER"), [hasRole]);

    // Check if token is expired (client-side check)
    const isTokenExpired = useCallback((): boolean => {
        if (!token) return true;
        try {
            const parts = token.split(".");
            if (parts.length < 2) return true;
            const payload = JSON.parse(atob(parts[1]));
            const currentTime = Date.now() / 1000;
            return typeof payload.exp === "number" ? payload.exp < currentTime : true;
        } catch (error) {
            return true;
        }
    }, [token]);

    // Auto refresh token if needed
    const checkTokenAndRefresh = useCallback(async () => {
        if (isAuthenticated && token && isTokenExpired()) {
            try {
                await refreshAccessToken();
            } catch (error) {
                console.error("Auto refresh failed:", error);
                // refreshAccessToken đã xử lý clearCredentials & navigate
            }
        }
    }, [isAuthenticated, token, isTokenExpired, refreshAccessToken]);

    return {
        // State
        user,
        token,
        refreshToken,
        isAuthenticated,
        loading,
        error,

        // Actions
        login,
        register,
        logout,
        getCurrentUser,
        refreshAccessToken,
        clearAuthError,
        checkTokenAndRefresh,

        // Utilities
        hasRole,
        isAdmin,
        isCustomer,
        isTokenExpired,
    };
}