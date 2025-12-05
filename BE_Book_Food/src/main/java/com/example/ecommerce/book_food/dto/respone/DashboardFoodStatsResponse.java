package com.example.ecommerce.book_food.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardFoodStatsResponse {
    //thống kê món ăn
    private long totalFoodsSold;
    private List<BestSellerFoodResponse> topFoods;
}
