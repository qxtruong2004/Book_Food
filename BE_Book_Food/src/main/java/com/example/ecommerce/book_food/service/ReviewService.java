package com.example.ecommerce.book_food.service;

import com.example.ecommerce.book_food.dto.request.CreateReviewRequest;
import com.example.ecommerce.book_food.dto.respone.FoodRatingSummaryRespone;
import com.example.ecommerce.book_food.dto.respone.ReviewResponse;
import com.example.ecommerce.book_food.entity.Food;
import com.example.ecommerce.book_food.entity.Order;
import com.example.ecommerce.book_food.entity.Review;
import com.example.ecommerce.book_food.entity.User;
import com.example.ecommerce.book_food.exception.*;
import com.example.ecommerce.book_food.mapper.ReviewMapper;
import com.example.ecommerce.book_food.repository.FoodRepository;
import com.example.ecommerce.book_food.repository.OrderRepository;
import com.example.ecommerce.book_food.repository.ReviewRepository;
import com.example.ecommerce.book_food.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;
    private final OrderRepository orderRepository;

    //thêm review mới
    public ReviewResponse addReview(CreateReviewRequest request, Long userId) throws UserNotFoundException, FoodNotFoundException, OrderNotFoundException {
        //kiểm tra người dùng, food xem có ton tại không
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        Food food = foodRepository.findById(request.getFoodId())
                .orElseThrow(() -> new FoodNotFoundException("Food not found with id: " + request.getFoodId()));
        // Kiểm tra order
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + request.getOrderId()));

        // Đảm bảo order có món ăn này
        boolean hasFood = order.getOrderItems().stream()
                .anyMatch(item -> item.getFood().getId().equals(request.getFoodId()));
        if (!hasFood) {
            throw new IllegalArgumentException("This order does not contain the food you want to review");
        }

        Review review = Review.builder()
                .food(food)
                .user(user)
                .order(order)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        Review savedReview = reviewRepository.save(review);
        return reviewMapper.toRespone(savedReview);
    }

    //lấy review theo món ăn
    public List<ReviewResponse> getReviewsByFood(Long foodId, int page, int size) {
        //kiểm tra món ăn có tồn tại không
        boolean exists = foodRepository.existsById(foodId);
        if(!exists){
            throw new FoodNotFoundException("Food not found with id: " + foodId);
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviewPage = reviewRepository.findByFoodIdOrderByCreatedAtDesc(foodId, pageable);
        return reviewMapper.toResponeList(reviewPage.getContent());
    }

    //xóa review
    public void deleteReview(Long reviewId, Long userId) throws UserNotFoundException, ReviewNotFoundException, ReviewOwnershipException {
        //kiểm tra người dùng có tồn tại không
        if(!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + reviewId));

        //kiểm tra xem người dùng có là chủ của review không
        if (!review.getUser().getId().equals(userId)) {
            throw new ReviewOwnershipException("You are not allowed to delete this review");
        }
        reviewRepository.deleteById(reviewId);
    }

    //lấy review theo user
    public List<ReviewResponse> getReviewsByUser(Long userId, int page, int size) {
        //kiểm tra người dùng
        boolean exists = userRepository.existsById(userId);
        if(!exists){
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviewPage = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return reviewMapper.toResponeList(reviewPage.getContent());
    }

//    //tính trung bình rating theo món ăn
//    public Double averageRating(Long foodId) throws FoodNotFoundException {
//        boolean exists = foodRepository.existsById(foodId);
//        if(!exists){
//            throw new FoodNotFoundException("Food not found with id: " + foodId);
//        }
//        Double averageRating = reviewRepository.getAverageRatingByFood(foodId);
//        return averageRating != null ? averageRating : 0.0;
//    }

    public FoodRatingSummaryRespone getFoodRatingSummary(Long foodId) throws FoodNotFoundException {
        boolean exists = foodRepository.existsById(foodId);
        if(!exists){
            throw new FoodNotFoundException("Food not found with id: " + foodId);
        }
        Double average = reviewRepository.getAverageRatingByFood(foodId);
        Long count = reviewRepository.countByFoodId(foodId);

        return new FoodRatingSummaryRespone(average, count);
    }

}
