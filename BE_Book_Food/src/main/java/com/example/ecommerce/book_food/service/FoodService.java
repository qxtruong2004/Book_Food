package com.example.ecommerce.book_food.service;

import com.example.ecommerce.book_food.dto.request.CreateFoodRequest;
import com.example.ecommerce.book_food.dto.respone.FoodResponse;
import com.example.ecommerce.book_food.entity.Category;
import com.example.ecommerce.book_food.entity.Food;
import com.example.ecommerce.book_food.exception.CategoryNotFoundException;
import com.example.ecommerce.book_food.mapper.FoodMapper;
import com.example.ecommerce.book_food.repository.CategoryRepository;
import com.example.ecommerce.book_food.repository.FoodRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FoodService {
    private final FoodRepository foodRepository;
    private final CategoryRepository categoryRepository;
    private final FoodMapper foodMapper;

    // lay het do an
    public List<FoodResponse> getAllFoods(int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        List<Food> foods = foodRepository.findByIsAvailableTrueOrderByCreatedAtDesc(pageable);
        return foodMapper.toResponseList(foods);
    }
    public List<FoodResponse> getFoodsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Food> foods = foodRepository.findByCategoryIdAndIsAvailableTrue(categoryId, pageable);
        return foodMapper.toResponseList(foods);
    }

    public FoodResponse createFood(CreateFoodRequest request) throws CategoryNotFoundException {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + request.getCategoryId()));

        Food food = Food.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .category(category)
                .preparationTime(request.getPreparationTime())
                .isAvailable(true)
                .rating(BigDecimal.ZERO)
                .build();

        Food savedFood = foodRepository.save(food);
        return foodMapper.toResponse(savedFood);
    }

    public List<FoodResponse> searchFoods(String keyword, Long categoryId,
                                          BigDecimal minPrice, BigDecimal maxPrice,
                                          int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (keyword != null && !keyword.trim().isEmpty()) {
            List<Food> foods = foodRepository.findByNameContainingIgnoreCaseAndIsAvailableTrue(keyword, pageable);
            return foodMapper.toResponseList(foods);
        }

        List<Food> foods = foodRepository.findFoodsWithFilters(categoryId, minPrice, maxPrice, pageable);
        return foodMapper.toResponseList(foods);
    }
}
