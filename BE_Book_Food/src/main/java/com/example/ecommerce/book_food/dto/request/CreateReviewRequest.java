package com.example.ecommerce.book_food.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateReviewRequest {
    @NotNull(message = "FoodID is not Empty")
    private Long foodId;

    @NotNull(message = "Rating trong khoảng 0 - 5")
    @DecimalMin(value = "0.0", inclusive = true, message = "Rating không nhỏ hơn 0")
    @DecimalMax(value = "5.0", inclusive = true, message = "Rating không lớn hơn 5")
    private BigDecimal rating;

    @NotNull
    private Long orderId; // thêm trường này

    @Size(max = 500)
    private String comment;
}

