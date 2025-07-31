package com.example.ecommerce.book_food.mapper;

import com.example.ecommerce.book_food.dto.respone.OrderItemResponse;
import com.example.ecommerce.book_food.entity.OrderItem;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class OrderItemMapper {
    private final ModelMapper modelMapper;

    public OrderItemMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    //chuyển đổi 1 orderitem thành orderitem response
    public OrderItemResponse toResponse(OrderItem orderItem) {
        if (orderItem == null) return null;
        OrderItemResponse response = modelMapper.map(orderItem, OrderItemResponse.class);

        //set tên món ăn vì trong order item có 1 đối tượng food
        if(orderItem.getFood() != null){
            response.setFoodName(orderItem.getFood().getName());
        }
        return response;
    }

    public List<OrderItemResponse> toResponseList(List<OrderItem> orderItems) {
        if(orderItems == null) return new ArrayList<>();
        return orderItems.stream()
                .map(this::toResponse)
                .toList();
    }
}
