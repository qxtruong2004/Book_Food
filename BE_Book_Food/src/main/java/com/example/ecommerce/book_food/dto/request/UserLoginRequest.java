package com.example.ecommerce.book_food.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginRequest {
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}

