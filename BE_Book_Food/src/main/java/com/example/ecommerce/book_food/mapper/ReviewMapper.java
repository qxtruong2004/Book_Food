package com.example.ecommerce.book_food.mapper;

import com.example.ecommerce.book_food.dto.respone.ReviewResponse;
import com.example.ecommerce.book_food.entity.Review;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ReviewMapper {
    private final ModelMapper modelMapper;

    public ReviewMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }
    //chuyển đổi review sang review respone
    public ReviewResponse toRespone(Review review) {
        return modelMapper.map(review, ReviewResponse.class);
    }

    //chuyen đổi 1 list review sang list review respone
    public List<ReviewResponse> toResponeList(List<Review> reviews) {
        if (reviews == null ) return new ArrayList<>();
        return reviews.stream()
                .map(this::toRespone)
                .toList();
    }
}
