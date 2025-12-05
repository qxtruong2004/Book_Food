package com.example.ecommerce.book_food.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardRevenueStatsResponse {
    // thong ke doanh thu
    private BigDecimal totalRevenue;
    private BigDecimal revenueSucceeded;
    private BigDecimal revenueWaiting;

}
