package com.example.ecommerce.book_food.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    @NotNull
    private Long orderId;

    @NotBlank
    private String status; // ví dụ: PENDING, DELIVERED, CANCELED
}

