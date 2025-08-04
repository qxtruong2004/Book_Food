package com.example.ecommerce.book_food.exception;

import com.example.ecommerce.book_food.dto.respone.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Bắt tất cả Exception khác chưa được định nghĩa
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleAllExceptions(Exception ex) {
        return ResponseEntity.ok(ApiResponse.fail("Unexpected error: " + ex.getMessage()));
    }

    // Lỗi email đã tồn tại
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Object>> handleEmailExists(EmailAlreadyExistsException e) {
        return ResponseEntity.ok(ApiResponse.fail(e.getMessage()));
    }

    // Lỗi username đã tồn tại
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Object>> handleUserExists(UserAlreadyExistsException e) {
        return ResponseEntity.ok(ApiResponse.fail(e.getMessage()));
    }

    // Lỗi user không tìm thấy
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleUserNotFound(UserNotFoundException e) {
        return ResponseEntity.ok(ApiResponse.fail(e.getMessage()));
    }

    // Lỗi food không tìm thấy
    @ExceptionHandler(FoodNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleFoodNotFound(FoodNotFoundException e) {
        return ResponseEntity.ok(ApiResponse.fail(e.getMessage()));
    }

    //Lỗi food đã bán hết
    @ExceptionHandler(FoodNotAvailableException.class)
    public ResponseEntity<ApiResponse<Object>> handleFoodNotAvailable(FoodNotAvailableException e) {
        return ResponseEntity.ok(ApiResponse.fail(e.getMessage()));
    }

    // Lỗi category không tìm thấy
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleCategoryNotFound(CategoryNotFoundException e) {
        return ResponseEntity.ok(ApiResponse.fail(e.getMessage()));
    }

    // Lỗi tên category đã tồn tại
    @ExceptionHandler(CategoryAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Object>> handleCategoryAlreadyExists(CategoryAlreadyExistsException e) {
        return ResponseEntity.ok(ApiResponse.fail(e.getMessage()));
    }

    //Lỗi xóa category vẫn chứa món ăn
    @ExceptionHandler(CategoryHasFoodsException.class)
    public ResponseEntity<ApiResponse<Object>> handleCategoryHasFoods(CategoryHasFoodsException e) {
        return ResponseEntity.ok(ApiResponse.fail(e.getMessage()));
    }

    //Lỗi không tìm thấy order
    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleOrderNotFound(OrderNotFoundException e) {
        return ResponseEntity.ok(ApiResponse.fail(e.getMessage()));
    }

    //Loi không tìm thấy review
    @ExceptionHandler(ReviewNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleReviewNotFound(ReviewNotFoundException e) {
        return ResponseEntity.ok(ApiResponse.fail(e.getMessage()));
    }

    //Lỗi user không phải chủ review
    @ExceptionHandler(ReviewOwnershipException.class)
    public ResponseEntity<ApiResponse<Object>> handleReviewOwnership(ReviewOwnershipException e) {
        return ResponseEntity.ok(ApiResponse.fail(e.getMessage()));
    }

    // Lỗi validate dữ liệu @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldError().getDefaultMessage();
        return ResponseEntity.ok(ApiResponse.fail("Validation error: " + errorMessage));
    }
}