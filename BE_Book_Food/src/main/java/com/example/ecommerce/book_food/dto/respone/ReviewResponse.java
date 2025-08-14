package com.example.ecommerce.book_food.dto.respone;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private String username;
    private BigDecimal rating; // 1 - 5
    private String comment;
    private LocalDateTime createdAt;
}
