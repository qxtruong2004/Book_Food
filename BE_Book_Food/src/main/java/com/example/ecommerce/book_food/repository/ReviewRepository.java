package com.example.ecommerce.book_food.repository;

import com.example.ecommerce.book_food.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Lấy review theo food (món ăn)
    Page<Review> findByFoodIdOrderByCreatedAtDesc(Long foodId, Pageable pageable);


    // Lấy review của user(admin)
    Page<Review> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    //lấy review của bản thân
    List<Review> findByUser_Username(String username);

    // Tính trung bình rating của 1 món ăn
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.food.id = :foodId")
    Double getAverageRatingByFood(@Param("foodId") Long foodId);

    // Đếm số review của một món ăn
    long countByFoodId(Long foodId);

    //trả về review chỉ khi review thuộc user đang login.
    Optional<Review> findByIdAndUser_Username(Long reviewId, String username);

    boolean existsByUser_IdAndOrder_IdAndFood_Id(Long userId, Long orderId, Long foodId);

    //kiểm tra xem món ăn đã được đánh giá chưa
    @Query("select r.food.id from Review r where r.user.id = :userId and r.order.id = :orderId")
    List<Long> findFoodIdsReviewedByUserAndOrder(@Param("userId") Long userId,
                                                 @Param("orderId") Long orderId);


}
