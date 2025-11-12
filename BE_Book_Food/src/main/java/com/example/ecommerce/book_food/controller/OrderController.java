package com.example.ecommerce.book_food.controller;

import com.example.ecommerce.book_food.Enum.OrderStatus;
import com.example.ecommerce.book_food.dto.request.CreateOrderRequest;
import com.example.ecommerce.book_food.dto.respone.ApiResponse;
import com.example.ecommerce.book_food.dto.respone.OrderResponse;
import com.example.ecommerce.book_food.dto.respone.UserOrderResponse;
import com.example.ecommerce.book_food.entity.User;
import com.example.ecommerce.book_food.exception.UserNotFoundException;
import com.example.ecommerce.book_food.repository.UserRepository;
import com.example.ecommerce.book_food.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
    private final UserRepository userRepository;

    //lấy tất cả order ( có thể lọc trạng thái)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getOrders(
            @RequestParam(required = false) OrderStatus orderStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<OrderResponse> orders = orderService.getAllOrders(orderStatus, page, size);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    //lấy danh sách order của user
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<UserOrderResponse>> getOrderByUser(
            @PathVariable long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue ="10") int size) {
        UserOrderResponse userOrderResponse = orderService.getUserOrders(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success(userOrderResponse));
    }


    //tạo order
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest createOrderRequest,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Long userId)// chỉ admin mới dùng userId
    {
        OrderResponse orderResponse;
       if(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) && userId != null){
           orderResponse = orderService.createOrder(createOrderRequest, userId);
       }
       else {
           //user chỉ được tao cho chính mình
           User user = userRepository.findByUsername(userDetails.getUsername())
                   .orElseThrow(() -> new UserNotFoundException("User not found with username: " + userDetails.getUsername()));
           orderResponse = orderService.createOrder(createOrderRequest, user.getId());
       }
       return ResponseEntity.ok(ApiResponse.success(orderResponse));
    }

    //hủy đơn hàng ( chỉ hủy được khi đơn hàng ở trạng thái pending
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/{orderId}")
    public ResponseEntity<ApiResponse<String>> cancelOrder(@PathVariable Long orderId, @AuthenticationPrincipal UserDetails userDetails){
        //sẽ duyệt qua từng quyền và trả về true nếu có ít nhất 1 quyền thỏa điều kiện.
        boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        orderService.cancelOrder(orderId, userDetails.getUsername(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("cancelled"));
    }

    //tính tổng doanh thu
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/totalRevenue")
    public ResponseEntity<ApiResponse<BigDecimal>> getTotalRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        BigDecimal total = orderService.getTotalRevenueByDateRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(total));
    }

    //cập nhật trạng thái đơn hàng
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus( @PathVariable Long orderId, @RequestParam("status") OrderStatus newStatus){
        OrderResponse updateStatusOrder = orderService.updateOrderStatus(orderId, newStatus);
        return ResponseEntity.ok(ApiResponse.success(updateStatusOrder));
    }

    //xem chi tiết 1 order (admin)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long orderId) {
        OrderResponse orderResponse = orderService.getOrderDetailByAdmin(orderId);
        return ResponseEntity.ok(ApiResponse.success(orderResponse));
    }

    //lấy ds order của ban thân
    @PreAuthorize("hasRole('USER')")
    @GetMapping("my_orders")
    public ResponseEntity<ApiResponse<UserOrderResponse>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue ="10") int size
    ){
        UserOrderResponse userOrderResponse = orderService.getMyOrders(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.success(userOrderResponse));
    }

    //xem chi tiết đơn hàng (user)
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/my_orders/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getMyOrder(@PathVariable Long orderId, @AuthenticationPrincipal UserDetails userDetails) {
        OrderResponse orderResponse = orderService.getOrderDetailByUser(orderId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(orderResponse));
    }

    //lay số lượng đơn hàng theo ngày
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/by_day")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getOrdersByDay
    ( @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue ="10") int size)
    {
        Page<OrderResponse> orders = orderService.getOrdersByDay(startDate, endDate, page, size);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }


}
