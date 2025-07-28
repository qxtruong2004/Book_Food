package com.example.ecommerce.book_food.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateFoodRequest {
    @NotBlank
    @Size(min = 2, max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @DecimalMin("0.01")
    private BigDecimal price;

    private String imageUrl;
    private Long categoryId;
    private Integer preparationTime;
}
