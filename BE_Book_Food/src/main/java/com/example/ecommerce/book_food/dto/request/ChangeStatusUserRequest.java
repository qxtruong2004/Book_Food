package com.example.ecommerce.book_food.dto.request;

import com.example.ecommerce.book_food.Enum.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangeStatusUserRequest {
    @NotNull(message = "Cần Status cho User")
    private UserStatus status;
}
