package com.example.ecommerce.book_food.mapper;

import com.example.ecommerce.book_food.dto.respone.CategoryResponse;
import com.example.ecommerce.book_food.entity.Category;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CategoryMapper {
    private ModelMapper modelMapper;

    public CategoryMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    //chuyển đổi category sang category respone
    public CategoryResponse toRespone(Category category) {
        return modelMapper.map(category, CategoryResponse.class);
    }

    //chuyển đổi danh sách Category sang ds category respone
    public List<CategoryResponse> toResponeList(List<Category> categories) {
        if(categories == null ) return new ArrayList<>();
        return categories.stream()
                .map(this::toRespone)
                .toList();
    }
}
