package com.example.ecommerce.book_food.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateFoodRequest {
    @NotBlank(message = "Food name is required")
    @Size(min = 2, max = 100, message = "Food name must be between 2 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Invalid price format")
    private BigDecimal price;

    private String imageUrl;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @Min(value = 1, message = "Preparation time must be at least 1 minute")
    @Max(value = 180, message = "Preparation time cannot exceed 180 minutes")
    private Integer preparationTime = 15;
}
