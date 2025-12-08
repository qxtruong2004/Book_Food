package com.example.ecommerce.book_food.dto.respone;

import com.example.ecommerce.book_food.entity.Category;
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
    private long foodId;
    private String foodName;
    private long quantitySold;
    private String categoryName;

}
