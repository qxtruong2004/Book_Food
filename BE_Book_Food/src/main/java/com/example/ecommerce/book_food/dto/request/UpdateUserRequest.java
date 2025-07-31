package com.example.ecommerce.book_food.dto.request;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String name;
    private String phone;
    private String email;
    private String address;
    private String password; // optional
}
