package com.example.ecommerce.book_food.repository;

import com.example.ecommerce.book_food.dto.respone.BestSellerFoodResponse;
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


    //Lấy danh sách đơn hàng của cá nhân
    @EntityGraph(attributePaths = {"orderItems", "orderItems.food", "user"})
    Page<Order> findByUser_Username(String userName, Pageable pageable);

    // Lấy danh sách đơn hàng theo trạng thái với eager loading
    @EntityGraph(attributePaths = {"orderItems", "orderItems.food", "user"})
    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    

    // Lấy order by ID với eager loading
    @EntityGraph(attributePaths = {"orderItems", "orderItems.food", "user"})
    Optional<Order> findById(Long id);

    // Đếm số đơn hàng của 1 user
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    // Tính tổng doanh thu ĐÃ NHAN theo khoảng thời gian ( chi tính đơn đã hoàn thành)
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o" +
            " WHERE o.status = com.example.ecommerce.book_food.Enum.OrderStatus.SUCCEEDED " +
            " AND o.createdAt >= :startDateTime AND o.createdAt <= :endDateTime")
    long getTotalRevenue_Successed_ByDateRange(@Param("startDateTime") LocalDateTime startDateTime,
                                          @Param("endDateTime") LocalDateTime endDateTime);

    //tính tổng doanh thu theo khoảng time
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o" +
            " WHERE o.createdAt >= :startDateTime AND o.createdAt <= :endDateTime")
    Long getTotalRevenueByDateRange(@Param("startDateTime") LocalDateTime startDateTime,
                                                     @Param("endDateTime") LocalDateTime endDateTime);
    //lấy ds đơn hàng trong 1 khoảng thời gian
    @Query("select o FROM Order o  WHERE o.createdAt  >= :startOfDay AND   o.createdAt <= :endOfDay AND (:status IS NULL OR o.status = :status) order by o.createdAt desc ")
    Page<Order> getOrdersOnDay( @Param("status") OrderStatus status,
            @Param("startOfDay") LocalDateTime createDateTime,
                               @Param("endOfDay") LocalDateTime endOfDay, Pageable pageable);


    //lọc tổng đơn hàng trong 1 ngày ( dashboard)
    long countByCreatedAtBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);

    //lọc số lượng đơn hàng (theo trang thái trong ngày)
    Long countByStatusAndCreatedAtBetween(OrderStatus status, LocalDateTime startDateTime, LocalDateTime endDateTime);

    //lấy số đơn hàng của 1 user
    long countByUser_Username(String username);

    //tính tổng số món đã bán (số lượng)
    @Query("SELECT  COALESCE(sum(oi.quantity), 0) from OrderItem oi " +
            "join oi.order o " +
            " where  o.createdAt >= :startDateTime AND   o.createdAt < :endDateTime")
    long getTotalFoodsSoldOutByDateRange(@Param("startDateTime") LocalDateTime startDateTime,
                                               @Param("endDateTime") LocalDateTime endDateTime);

    //lấy tổng số lượng của từng món bán ra từ NHIỀU đơn
    @Query("select new com.example.ecommerce.book_food.dto.respone.BestSellerFoodResponse(" +
            "oi.food.id, oi.food.name, sum(oi.quantity), oi.food.category.name)" +
            "from  OrderItem oi " +
            "join oi.order o " +
            "where o.createdAt >= :startDateTime AND   o.createdAt < :endDateTime " +
            "group by oi.food.id, oi.food.name, oi.food.category.name ORDER BY SUM(oi.quantity) DESC")
    List<BestSellerFoodResponse> findBestSellerFoods(LocalDateTime startDateTime, LocalDateTime endDateTime);

}
