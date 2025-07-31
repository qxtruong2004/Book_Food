package com.example.ecommerce.book_food.mapper;

import com.example.ecommerce.book_food.dto.respone.FoodResponse;
import com.example.ecommerce.book_food.entity.Food;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class FoodMapper {
    private final ModelMapper modelMapper;

    public FoodMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    //chuyển đổi 1 food sang food response
    public FoodResponse toResponse(Food food) {
        return modelMapper.map(food, FoodResponse.class);
    }

    //chuyển đổi danh sách food sang ds food respone
    public List<FoodResponse> toResponseList(List<Food> foods) {
        if (foods == null) return new ArrayList<>();
        return foods.stream()
                .map(this::toResponse)
                .toList();
    }
}
