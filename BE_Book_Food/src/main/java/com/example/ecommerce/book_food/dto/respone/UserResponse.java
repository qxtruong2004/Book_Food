package com.example.ecommerce.book_food.dto.respone;

import com.example.ecommerce.book_food.Enum.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String role; // ADMIN, CUSTOMER, ...
    private UserStatus status;
}

