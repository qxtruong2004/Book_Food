package com.example.ecommerce.book_food.repository;

import com.example.ecommerce.book_food.entity.Food;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {
    //Trả về danh sách Food thuộc category chỉ định và còn hàng
    Page<Food> findByCategoryId(Long categoryId, Pageable pageable);

    //Lấy các Food còn hàng, sắp xếp theo createdAt giảm dần → tức là món mới nhất trước
    Page<Food> findByIsAvailableIsTrueOrderByCreatedAtDesc(Pageable pageable);

    //lấy các food hết hàng
    Page<Food> findByIsAvailableIsFalseOrderByCreatedAtDesc(Pageable pageable);

    //Lấy các tất cả các món ăn sắp xếp theo createdAt giảm dần → tức là món mới nhất trước
    Page<Food> findAllByOrderByCreatedAtDesc(Pageable pageable);

    //Tìm Food theo tên, không phân biệt hoa/thường
    Page<Food> findByNameContainingIgnoreCase(String name, Pageable pageable);

    //lọc theo category, khoảng giá
    @Query("SELECT f FROM Food f WHERE f.isAvailable = true AND " +
            "(:categoryId IS NULL OR f.category.id = :categoryId) AND " +
            "(:minPrice IS NULL OR f.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR f.price <= :maxPrice)")
    Page<Food> findFoodsWithFilters(@Param("categoryId") Long categoryId,
                                    @Param("minPrice") BigDecimal minPrice,
                                    @Param("maxPrice") BigDecimal maxPrice,
                                    Pageable pageable);


    @Query("SELECT f FROM Food f WHERE f.name LIKE %:keyword% AND f.isAvailable = :trangthai ORDER BY f.createdAt DESC")
    Page<Food> findByNameContainingAndAvailable(String keyword, boolean trangthai, Pageable pageable);

    @Modifying
    @Query("UPDATE  Food f set f.soldCount = f.soldCount + :delta where  f.id = :foodId")
    void incrementSoldCount(@Param("foodId") Long foodId, @Param("delta") long delta) ;

}

