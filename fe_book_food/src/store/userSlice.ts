import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService } from '../services/userService';
import { UserResponse, UpdateUserRequest, ChangeStatusUserRequest, UserSearchParams } from '../types/user';
import { Page } from '../types/page';

interface UserState {
    users: UserResponse[];
    blockedUsers: UserResponse[];
    activeUsers: UserResponse[];
    currentUser: UserResponse | null;     // user đang đăng nhập
    selectedUser: UserResponse | null;    // user đang được admin xem/chỉnh sửa
    loading: boolean;
    error: string | null;
    updateLoading: boolean;
    pagedUsers: Page<UserResponse> | null;
    userQuery: UserSearchParams;
}

const initialState: UserState = {
    users: [],
    blockedUsers: [],
    activeUsers: [],
    currentUser: null,
    selectedUser: null,
    loading: false,
    error: null,
    updateLoading: false,

    pagedUsers: null,
    userQuery: { page: 0, size: 10, sort: "id,asc", name: "" },
};

// --- Async Thunks ---

// Lấy profile của user đang đăng nhập
export const fetchMyProfileAsync = createAsyncThunk(
    'user/fetchMyProfile',
    async (_, { rejectWithValue }) => {
        try {
            const user = await userService.getMyProfile();
            if (!user) throw new Error("No profile found");
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch profile");
        }
    }
);

// Lấy user theo id
export const fetchUserByIdAsync = createAsyncThunk(
    'user/fetchUserById',
    async (id: number, { rejectWithValue }) => {
        try {
            const user = await userService.getUserById(id);
            if (!user) throw new Error("User not found");
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch user by id");
        }
    }
);

// Lấy tất cả users
export const fetchAllUsersAsync = createAsyncThunk(
    'user/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const users = await userService.getAllUsers();
            if (!users) throw new Error("No users found");
            return users;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch all users");
        }
    }
);

//lấy tất cả user + phân trang
export const searchUsersAsync = createAsyncThunk(
    'user/searchUsers',
    async (params: UserSearchParams, { rejectWithValue }) => {
        try {
            const page = await userService.searchUsers(params);
            return { page, params };
        }
        catch (error: any) {
            return rejectWithValue(error.message || "Failed to search users");
        }
    }
)

// Lấy user bị block
export const fetchBlockedUsersAsync = createAsyncThunk(
    'user/fetchBlockedUsers',
    async (_, { rejectWithValue }) => {
        try {
            const users = await userService.getAllUsersByBlocked();
            if (!users) throw new Error("No blocked users found");
            return users;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blocked users");
        }
    }
);

// Lấy user active
export const fetchActiveUsersAsync = createAsyncThunk(
    'user/fetchActiveUsers',
    async (_, { rejectWithValue }) => {
        try {
            const users = await userService.getActiveUsers();
            if (!users) throw new Error("No active users found");
            return users;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch active users");
        }
    }
);

// User update profile
export const updateUserByUserAsync = createAsyncThunk(
    'user/updateUserByUser',
    async (request: UpdateUserRequest, { rejectWithValue }) => {
        try {
            const user = await userService.updateUserByUser(request);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update profile");
        }
    }
);

// Admin update user
export const updateUserByIdAsync = createAsyncThunk(
    'user/updateUserById',
    async ({ id, request }: { id: number; request: UpdateUserRequest }, { rejectWithValue }) => {
        try {
            const user = await userService.updateUserById(id, request);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update user by id");
        }
    }
);

// Change status (active/block)
export const changeUserStatusAsync = createAsyncThunk(
    'user/changeUserStatus',
    async ({ id, request }: { id: number; request: ChangeStatusUserRequest }, { rejectWithValue }) => {
        try {
            const user = await userService.changeUserStatus(id, request);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to change user status");
        }
    }
);

// --- Slice ---
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
        // 👇 reducer để cập nhật query
        setUserQuery: (s, a: PayloadAction<Partial<UserSearchParams>>) => {
            s.userQuery = { ...s.userQuery, ...a.payload };
        },
    },
    extraReducers: (builder) => {
        // Fetch my profile
        builder
            .addCase(fetchMyProfileAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyProfileAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(fetchMyProfileAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch user by id
        builder.addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
            state.selectedUser = action.payload;
        });

        // Fetch all users
        builder.addCase(fetchAllUsersAsync.fulfilled, (state, action) => {
            state.users = action.payload;
        });

        //search +phân trang
        builder
            .addCase(searchUsersAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchUsersAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.pagedUsers = action.payload.page;
                // Đồng bộ query hiện hành (để UI hiển thị đúng)
                state.userQuery = { ...state.userQuery, ...action.payload.params };

                // Nếu lỡ ở trang vượt quá totalPages (vd vừa xoá nhiều bản ghi) → tự lùi lại (UI sẽ gọi lại)
                const p = action.payload.page;
                if (p.totalPages > 0 && p.number >= p.totalPages) {
                    state.userQuery.page = p.totalPages - 1;
                }
            })
            .addCase(searchUsersAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch blocked users
        builder.addCase(fetchBlockedUsersAsync.fulfilled, (state, action) => {
            state.blockedUsers = action.payload;
        });

        // Fetch active users
        builder.addCase(fetchActiveUsersAsync.fulfilled, (state, action) => {
            state.activeUsers = action.payload;
        });

        // Update by user
        builder
            .addCase(updateUserByUserAsync.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateUserByUserAsync.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.currentUser = action.payload;
            })
            .addCase(updateUserByUserAsync.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload as string;
            });

        // Update by admin
        builder.addCase(updateUserByIdAsync.fulfilled, (state, action) => {
            const idx = state.users.findIndex(u => u.id === action.payload.id);
            if (idx !== -1) state.users[idx] = action.payload;
            state.selectedUser = action.payload;
        });

        // Change user status
        builder.addCase(changeUserStatusAsync.fulfilled, (state, action) => {
            const idx = state.users.findIndex(u => u.id === action.payload.id);
            if (idx !== -1) state.users[idx] = action.payload;
            if (state.selectedUser?.id === action.payload.id) {
                state.selectedUser = action.payload;
            }
        });
    },
});

export const { clearError, clearSelectedUser, setUserQuery } = userSlice.actions;
export default userSlice.reducer;
