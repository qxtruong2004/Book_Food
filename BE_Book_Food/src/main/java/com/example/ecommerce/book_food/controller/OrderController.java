package com.example.ecommerce.book_food.controller;

import com.example.ecommerce.book_food.Enum.OrderStatus;
import com.example.ecommerce.book_food.dto.request.CreateOrderRequest;
import com.example.ecommerce.book_food.dto.respone.ApiResponse;
import com.example.ecommerce.book_food.dto.respone.OrderResponse;
import com.example.ecommerce.book_food.dto.respone.UserOrderResponse;
import com.example.ecommerce.book_food.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class OrderController {
    private final OrderService orderService;

    //lấy tất cả order
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders(
            @RequestParam(required = false) OrderStatus orderStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    //lấy danh sách order của user
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<UserOrderResponse>> getOrderByUser(
            @PathVariable long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue ="10") int size) {
        UserOrderResponse userOrderResponse = orderService.getUserOrders(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success(userOrderResponse));
    }

    //tạo order
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest createOrderRequest, @RequestParam Long userId)
    {
        OrderResponse orderResponse = orderService.createOrder(createOrderRequest, userId);
        return ResponseEntity.ok(ApiResponse.success(orderResponse));
    }

    //tính tổng doanh thu
    @GetMapping("/totalRevenue")
    public ResponseEntity<ApiResponse<BigDecimal>> getTotalRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        BigDecimal total = orderService.getTotalRevenueByDateRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(total));
    }

    //cập nhật trạng thái đơn hàng
    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus( @PathVariable Long orderId, @RequestParam("status") OrderStatus newStatus){
        OrderResponse updateStatusOrder = orderService.updateOrderStatus(orderId, newStatus);
        return ResponseEntity.ok(ApiResponse.success(updateStatusOrder));
    }
}
