package com.example.ecommerce.book_food.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateFoodRequest {
    @NotBlank(message = "Tên món ăn không được để trống !")
    @Size(min = 2, max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @DecimalMin(value = "0", message = "Giá không hợp lệ")
    private BigDecimal price;

    private String imageUrl;
    private Long categoryId;

    @Min(value = 1, message = "Thời gian chuẩn bị tối thiểu 1 phút")
    private Integer preparationTime;
    private Boolean isAvailable;
}
