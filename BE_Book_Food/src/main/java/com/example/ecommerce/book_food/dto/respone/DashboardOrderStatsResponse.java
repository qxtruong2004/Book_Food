package com.example.ecommerce.book_food.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardOrderStatsResponse {
    //thống kê đơn
    private long totalOrders;
    private long totalSucceededOrders;
    private long totalPending;
    private long totalFailed;
    private long totalPreparing;
}
