import { ByRange, DashBoard } from "../types/dashboard";
import { API_BASE_URL, API_ENDPOINTS } from "../utils/constants";
import { api, ApiResponse } from "./api";

export const dashBoardService = {

    //thống kê đơn hàng trên dashboard
    async getDashboard(startDate: string, endDate: string) : Promise<DashBoard>{
        
            const response = await api.get<ApiResponse<DashBoard>>(
                API_ENDPOINTS.DASHBOARD.STATISTICS, {params: {startDate, endDate}}
            );
            return response.data.data;
        
        // catch (error) {
        //     console.error("OrderService error (getTotalRevenue):", error);
        //     return null;
        // }

    }
}