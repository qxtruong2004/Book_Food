package com.example.ecommerce.book_food.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long foodId;
    private String foodName;
    private Integer quantity;
    private BigDecimal price; // đơn giá
    private BigDecimal totalPrice; // quantity * price
    private String specialInstructions;
}

