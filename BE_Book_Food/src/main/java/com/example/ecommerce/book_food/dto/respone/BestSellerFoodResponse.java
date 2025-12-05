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
public class BestSellerFoodResponse {
    private Long foodId;
    private String foodName;
    private Long quantitySold;
    private BigDecimal price;

}
