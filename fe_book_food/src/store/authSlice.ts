//quản lý toàn bộ trạng thái liên quan tới xác thực trong ứng dụng(token, thông tin user, trạng thái loading/error).

import { fa } from "zod/v4/locales";
import { UserResponse } from "../types/user";
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from "../utils/constants";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse, UserLoginRequest, UserRegisterRequest } from "../types/auth";
import { authService } from "../services/authService";

//Cách này giúp web nhớ trạng thái đăng nhập
interface AuthState {
    user: UserResponse | null,
    token: string | null,
    refreshToken: string | null,
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

//initialState chính là trạng thái mặc định khi web vừa khởi động
const initialState: AuthState = {
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    isAuthenticated: !!localStorage.getItem(TOKEN_KEY), //Nếu có token trong localStorage → true (coi như user đang login).
    loading: false,
    error: null
};

/**
    Async thunk dùng để gọi API hoặc làm việc async trong Redux.Nó sẽ tự động sinh ra 3 action tương ứng:
    auth/login/pending → khi API đang chạy.
    auth/login/fulfilled → khi API thành công.
    auth/login/rejected → khi API thất bại.

    Component gọi dispatch(loginAsync(credentials)).
    Redux chạy loginAsync → bắn action pending.
    Nếu success → bắn fulfilled (update user, token, isAuthenticated).
    Nếu fail → bắn rejected (set error message).
 */
export const loginAsync = createAsyncThunk('auth/login',
    async (credentials: UserLoginRequest, { rejectWithValue, dispatch }) => {
        try {
            const response = await authService.login(credentials);
            localStorage.setItem(TOKEN_KEY, response.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);

            // Gọi API lấy user sau khi login thành công
            await dispatch(getCurrentUserAsync());

            return response;
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
)

export const registerAsync = createAsyncThunk('auth/register',
    async (credentials: UserRegisterRequest, { rejectWithValue }) => {
        try {
            const response = await authService.register(credentials);
            // Nếu backend báo lỗi
            if (!response.success || !response.data) {
                return rejectWithValue(response.message);
            }
            localStorage.setItem(TOKEN_KEY, response.data.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Registration failed"
            );
        }
    }
);

export const adminCreateUserAsync = createAsyncThunk(
  "admin/users/create",
  async (dto: UserRegisterRequest, { rejectWithValue }) => {
    try {
      const res = await authService.adminCreateUser(dto);
      if (!res?.success) return rejectWithValue(res?.message || "Create failed");
      return res.data; // user vừa tạo
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const getCurrentUserAsync = createAsyncThunk(
    'auth/me',
    async (_, { rejectWithValue }) => { //Tham số đầu tiên _ nghĩa là không cần truyền gì từ component (vì chỉ lấy user từ token).
        try {
            const user = await authService.me();
            return user;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get user info');
        }
    }
);

export const refreshTokenAsync = createAsyncThunk('auth/refresh',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.refresh();
            if (!response) {
                throw new Error('No refresh token available');
            }
            localStorage.setItem(TOKEN_KEY, response.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
            return response;
        }
        catch (error: any) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
        }
    }
)

export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        } catch (error: any) {
            // Even if logout fails on server, clear local storage
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

/*Redux slice để quản lý toàn bộ logic đăng nhập/đăng ký/logout */
const authSlice = createSlice({
    name: 'auth',
    initialState,
    //reducers: Khi bạn muốn thao tác đồng bộ, ví dụ: cập nhật state trực tiếp khi click nút, xóa dữ liệu, đổi màu giao diện…
    reducers: { //các reducer đồng bộ (synchronous reducer).
        //xoá lỗi (ví dụ khi người dùng bấm nút login lại).
        clearError: (state) => {
            state.error = null;
        },
        //set thủ công token + user (thường dùng sau login thành công hoặc refresh).
        setCredentials: (state, action: PayloadAction<AuthResponse>) => {
            state.user = {
                id: action.payload.userId,
                username: action.payload.username,
                fullName: "",   // backend chưa trả, có thể để trống
                email: "",      // backend chưa trả
                role: action.payload.role,
                status: null as any // hoặc bỏ qua, vì sẽ có sau khi gọi getCurrentUserAsync
            }
            state.token = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },
        //xóa thông tin đăng nhập của người dùng trong store, tức là “logout” người dùng khỏi ứng dụng.
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },

        //cập nhật thông tin người dùng trong Redux store mà kh làm mất các thông tin khác đã lưu trước đó
        updateUser: (state, action: PayloadAction<Partial<UserResponse>>) => {
            if (state.user) {
                //... giúp sao chép và kết hợp các thuộc tính của object/array mà không làm thay đổi bản gốc.
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
    /*
    extraReducers là cách Redux Toolkit xử lý các async actions, giúp bạn cập nhật store tự động theo trạng thái pending/fulfilled/rejected
    , thay vì phải viết logic xử lý async thủ công trong component.
    */
    extraReducers: (builder) => {
        //login
        builder
            .addCase(loginAsync.pending, (state) => {
                /*pending xảy ra khi loginAsync bắt đầu thực hiện (ví dụ: gọi API đăng nhập). */
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                /*
                    fulfilled xảy ra khi login thành công.
                    user, token, refreshToken được lưu vào store.
                */
                state.loading = false;
                authSlice.caseReducers.setCredentials(state, action);
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        //register
        builder
            .addCase(registerAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerAsync.fulfilled, (state, action) => {
                state.loading = false;
                authSlice.caseReducers.setCredentials(state, action);
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string; //message báo lỗi backend
            });

        //get current user
        builder
            .addCase(getCurrentUserAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
                state.loading = false;
                authSlice.caseReducers.setCredentials(state, {
                    payload: {
                        userId: action.payload.id,
                        username: action.payload.username,
                        role: action.payload.role,
                        accessToken: state.token,       // giữ token hiện tại
                        refreshToken: state.refreshToken
                    }
                } as any);
                state.error = null;
            })
            .addCase(getCurrentUserAsync.rejected, (state, action) => {
                authSlice.caseReducers.clearCredentials(state);
            });

        // Refresh token
        builder
            .addCase(refreshTokenAsync.fulfilled, (state, action) => {
                state.token = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;
            })
            .addCase(refreshTokenAsync.rejected, (state) => {
                authSlice.caseReducers.clearCredentials(state);
            });

        // Logout
        builder
            .addCase(logoutAsync.fulfilled, (state) => {
                authSlice.caseReducers.clearCredentials(state);
            })
            .addCase(logoutAsync.rejected, (state) => {
                authSlice.caseReducers.clearCredentials(state);
            });
    },
});

export const { clearError, setCredentials, clearCredentials, updateUser } = authSlice.actions;
export default authSlice.reducer;