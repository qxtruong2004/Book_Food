package com.example.ecommerce.book_food.controller;

import com.example.ecommerce.book_food.dto.request.CreateReviewRequest;
import com.example.ecommerce.book_food.dto.respone.ApiResponse;
import com.example.ecommerce.book_food.dto.respone.FoodRatingSummaryRespone;
import com.example.ecommerce.book_food.dto.respone.ReviewResponse;
import com.example.ecommerce.book_food.entity.Review;
import com.example.ecommerce.book_food.repository.ReviewRepository;
import com.example.ecommerce.book_food.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/foods/{foodId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsByFoodId(
            @PathVariable Long foodId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<ReviewResponse> listReviews = reviewService.getReviewsByFood(foodId, page, size);
        return ResponseEntity.ok(ApiResponse.success(listReviews));
    }

    @PostMapping("/users/{usersId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @RequestBody CreateReviewRequest createReviewRequest,
            @PathVariable Long usersId
    ){
        ReviewResponse reviewResponse = reviewService.addReview(createReviewRequest, usersId);
        return ResponseEntity.ok(ApiResponse.success(reviewResponse));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<String>> deleteReview(
            @PathVariable Long reviewId, @RequestParam Long usersId) {
        reviewService.deleteReview(reviewId, usersId);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully"));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        List<ReviewResponse> userReviews = reviewService.getReviewsByUser(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success(userReviews));
    }

    @GetMapping("/foods/{foodId}/summary")
    public ResponseEntity<ApiResponse<FoodRatingSummaryRespone>> getFoodReviewSummary(@PathVariable Long foodId) {
        FoodRatingSummaryRespone summaryRespone = reviewService.getFoodRatingSummary(foodId);
        return ResponseEntity.ok(ApiResponse.success(summaryRespone));
    }

}
