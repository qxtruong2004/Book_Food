package com.example.ecommerce.book_food.mapper;

import com.example.ecommerce.book_food.dto.respone.UserResponse;
import com.example.ecommerce.book_food.entity.User;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    private final ModelMapper modelMapper;

    public UserMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public UserResponse toResponse(User user) {
        if (user == null) return null;
        return modelMapper.map(user, UserResponse.class);
    }
}
