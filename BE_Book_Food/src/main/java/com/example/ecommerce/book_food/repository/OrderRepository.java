package com.example.ecommerce.book_food.repository;

import com.example.ecommerce.book_food.entity.Order;
import com.example.ecommerce.book_food.Enum.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Lấy danh sách đơn hàng theo user với eager loading
    @EntityGraph(attributePaths = {"orderItems", "orderItems.food", "user"})
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    // Lấy danh sách đơn hàng theo trạng thái với eager loading
    @EntityGraph(attributePaths = {"orderItems", "orderItems.food", "user"})
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    // Lấy tất cả orders với eager loading
    @EntityGraph(attributePaths = {"orderItems", "orderItems.food", "user"})
    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findAllWithDetails();

    // Lấy order by ID với eager loading
    @EntityGraph(attributePaths = {"orderItems", "orderItems.food", "user"})
    Optional<Order> findById(Long id);

    // Đếm số đơn hàng của 1 user
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    // Tính tổng doanh thu theo khoảng thời gian ( chi tính đơn đã hoàn thành)
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED' AND " +
            "DATE(o.createdAt) BETWEEN :startDate AND :endDate")
    BigDecimal getTotalRevenueByDateRange(@Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);
}
