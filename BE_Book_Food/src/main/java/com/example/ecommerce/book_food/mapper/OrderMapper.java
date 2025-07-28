package com.example.ecommerce.book_food.mapper;

import com.example.ecommerce.book_food.dto.respone.FoodResponse;
import com.example.ecommerce.book_food.dto.respone.OrderResponse;
import com.example.ecommerce.book_food.entity.Food;
import com.example.ecommerce.book_food.entity.Order;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class OrderMapper {
    private final ModelMapper modelMapper;

    public OrderMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    // map 1 Order sang OrderResponse
    public OrderResponse toResponse(Order order) {
        if (order == null) return null;
        return modelMapper.map(order, OrderResponse.class);
    }

    // map list Order sang list OrderResponse
    public List<OrderResponse> toResponseList(List<Order> orders) {
        if (orders == null) return new ArrayList<>();
        return orders.stream()
                .map(this::toResponse)
                .toList();
    }
}
