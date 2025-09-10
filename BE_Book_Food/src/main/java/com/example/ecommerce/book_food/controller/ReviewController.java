package com.example.ecommerce.book_food.controller;

import com.example.ecommerce.book_food.dto.request.CreateReviewRequest;
import com.example.ecommerce.book_food.dto.request.UpdateReviewRequest;
import com.example.ecommerce.book_food.dto.respone.ApiResponse;
import com.example.ecommerce.book_food.dto.respone.FoodRatingSummaryRespone;
import com.example.ecommerce.book_food.dto.respone.ReviewResponse;
import com.example.ecommerce.book_food.entity.Review;
import com.example.ecommerce.book_food.repository.ReviewRepository;
import com.example.ecommerce.book_food.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    //xem review theo món ăn
    @GetMapping("/foods/{foodId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsByFoodId(
            @PathVariable Long foodId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<ReviewResponse> listReviews = reviewService.getReviewsByFood(foodId, page, size);
        return ResponseEntity.ok(ApiResponse.success(listReviews));
    }

    //tạo review
    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @Valid @RequestBody CreateReviewRequest createReviewRequest,
            @AuthenticationPrincipal UserDetails userDetails
            ){
        ReviewResponse reviewResponse = reviewService.addReview(createReviewRequest, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(reviewResponse));
    }

    //xóa review
    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<String>> deleteReview(
            @PathVariable Long reviewId, @AuthenticationPrincipal UserDetails userDetails) {
        reviewService.deleteReview(reviewId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully"));
    }

    //lấy review theo id
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        List<ReviewResponse> userReviews = reviewService.getReviewsByUser(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success(userReviews));
    }

    // Lấy reviews của bản than
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/my_reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews(@AuthenticationPrincipal UserDetails userDetails){
        List<ReviewResponse> myReviews = reviewService.getMyReviews(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(myReviews));
    }


    //tổng số lượng review
    @GetMapping("/foods/{foodId}/summary")
    public ResponseEntity<ApiResponse<FoodRatingSummaryRespone>> getFoodReviewSummary(@PathVariable Long foodId) {
        FoodRatingSummaryRespone summaryRespone = reviewService.getFoodRatingSummary(foodId);
        return ResponseEntity.ok(ApiResponse.success(summaryRespone));
    }

    //cập nhật review
    @PutMapping("/{reviewId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody UpdateReviewRequest updateReviewRequest,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ReviewResponse updateReview = reviewService.updateReview(userDetails.getUsername(), reviewId, updateReviewRequest);
        return ResponseEntity.ok(ApiResponse.success(updateReview));
    }

}
