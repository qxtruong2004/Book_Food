package com.example.ecommerce.book_food.service;

import com.example.ecommerce.book_food.Enum.OrderStatus;
import com.example.ecommerce.book_food.dto.respone.*;
import com.example.ecommerce.book_food.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class DashBoardService {
    private final OrderRepository orderRepository;

    //thống kê đơn hàng
    private DashboardOrderStatsResponse buildOrderStats(LocalDate startDate, LocalDate endDate){

        // Kiểm tra đầu vào
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date cannot be null");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        //khi truy vấn khoảng thời gian, muốn tính từ đầu ngày  Ví dụ: 2025-09-01 → 2025-09-01T00:00:00
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        long totalOrders = orderRepository.countByCreatedAtBetween(startDateTime, endDateTime);
        long totalSucceededOrders = orderRepository.countByStatusAndCreatedAtBetween(OrderStatus.SUCCEEDED, startDateTime, endDateTime);
        long totalPending = orderRepository.countByStatusAndCreatedAtBetween(OrderStatus.PENDING, startDateTime, endDateTime);
        long totalFailed = orderRepository.countByStatusAndCreatedAtBetween(OrderStatus.FAILED, startDateTime, endDateTime);
        long totalPreparing = orderRepository.countByStatusAndCreatedAtBetween(OrderStatus.PREPARING, startDateTime, endDateTime);

        return new DashboardOrderStatsResponse(totalOrders, totalSucceededOrders, totalPending, totalFailed, totalPreparing);
    }

    // thống kê doanh thu
    private DashboardRevenueStatsResponse buildRevenueStats(LocalDate startDate, LocalDate endDate){
        // Kiểm tra đầu vào
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date cannot be null");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        //khi truy vấn khoảng thời gian, muốn tính từ đầu ngày  Ví dụ: 2025-09-01 → 2025-09-01T00:00:00
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        long totalRevenue = orderRepository.getTotalRevenueByDateRange(startDateTime, endDateTime);
        long revenueSucceeded = orderRepository.getTotalRevenue_Successed_ByDateRange(startDateTime, endDateTime);
        long revenueWaiting = totalRevenue - revenueSucceeded;

        return new DashboardRevenueStatsResponse(totalRevenue, revenueSucceeded, revenueWaiting);
    }

    //thống kê món ăn
    private DashboardFoodStatsResponse buildFoodStats(LocalDate startDate, LocalDate endDate){
        // Kiểm tra đầu vào
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date cannot be null");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        //khi truy vấn khoảng thời gian, muốn tính từ đầu ngày  Ví dụ: 2025-09-01 → 2025-09-01T00:00:00
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        long totalFoodsSold = orderRepository.getTotalFoodsSoldOutByDateRange(startDateTime, endDateTime);

        List<BestSellerFoodResponse> bestSeller = orderRepository.findBestSellerFoods(startDateTime, endDateTime);

        return new DashboardFoodStatsResponse(totalFoodsSold, bestSeller);


    }

    //gom thành hàm dashboard chính
    public DashboardResponse getDashboard(LocalDate startDate, LocalDate endDate) {

        return DashboardResponse.builder()
                .orderStats(buildOrderStats(startDate, endDate))
                .revenueStats(buildRevenueStats(startDate, endDate))
                .foodStats(buildFoodStats(startDate, endDate))
                .build();
    }
}
