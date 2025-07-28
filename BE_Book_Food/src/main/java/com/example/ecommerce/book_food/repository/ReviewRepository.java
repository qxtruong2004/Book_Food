package com.example.ecommerce.book_food.repository;

import com.example.ecommerce.book_food.entity.Review;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Lấy review theo food (món ăn)
    List<Review> findByFoodIdOrderByCreatedAtDesc(Long foodId, Pageable pageable);

    // Lấy review của user
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    // Tính trung bình rating của 1 món ăn
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.food.id = :foodId")
    Double getAverageRatingByFood(@Param("foodId") Long foodId);

    // Đếm số review của một món ăn
    long countByFoodId(Long foodId);
}
