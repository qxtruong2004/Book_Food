import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";  // Thêm PayloadAction nếu cần type chặt hơn
import { DashBoard } from "../types/dashboard";  // Giả sử type DashBoard đã định nghĩa
import { dashBoardService } from "../services/dashBoardService";

interface DashBoardState {
    dashboard: DashBoard | null;  // Fix: lowercase 'dashboard'
    loading: boolean;
    error: string | null;
}

const initialState: DashBoardState = {
    dashboard: null,
    loading: false,
    error: null
};

// Thống kê dashboard (fix: lowercase consistent)
export const fetchDashboardAsync = createAsyncThunk(  // Fix: fetchDashboard (lowercase)
    "dashboard/fetchDashboard",  // Fix: consistent name
    async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
        try {
            const result = await dashBoardService.getDashboard(startDate, endDate);  // Giả sử service đã update để nhận params
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch dashboard");
        }
    }
);

const dashBoardSlice = createSlice({
    name: "dashboard",  // Consistent
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearDashboard: (state) => {  // Thêm: Reset data
            state.dashboard = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardAsync.pending, (state) => {
                state.loading = true;
                state.error = null;  // Optional: Clear error khi pending
            })
            .addCase(fetchDashboardAsync.fulfilled, (state, action: PayloadAction<DashBoard>) => {  // Type chặt hơn
                state.loading = false;
                state.dashboard = action.payload;
                state.error = null;  // Clear error on success
            })
            .addCase(fetchDashboardAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.dashboard = null;  // Optional: Reset data on error
            });
    }
});

export const { clearError, clearDashboard } = dashBoardSlice.actions;  // Export thêm
export default dashBoardSlice.reducer;