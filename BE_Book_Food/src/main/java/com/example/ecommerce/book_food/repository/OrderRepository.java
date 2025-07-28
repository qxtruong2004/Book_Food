package com.example.ecommerce.book_food.repository;

import com.example.ecommerce.book_food.entity.Order;
import com.example.ecommerce.book_food.Enum.OrderStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    //Lấy danh sách đơn hàng theo user
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    //Lấy danh sách đơn hàng theo trạng thái
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    //Đếm số đơn hàng của 1 user
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    //Tính tổng doanh thu theo khoảng thời gian
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED' AND " +
            "o.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal getTotalRevenueByDateRange(@Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);
}
