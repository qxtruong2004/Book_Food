package com.example.ecommerce.book_food.service;

import com.example.ecommerce.book_food.dto.request.CreateFoodRequest;
import com.example.ecommerce.book_food.dto.request.UpdateFoodRequest;
import com.example.ecommerce.book_food.dto.respone.FoodResponse;
import com.example.ecommerce.book_food.entity.Category;
import com.example.ecommerce.book_food.entity.Food;
import com.example.ecommerce.book_food.exception.CategoryNotFoundException;
import com.example.ecommerce.book_food.exception.FoodNotFoundException;
import com.example.ecommerce.book_food.mapper.FoodMapper;
import com.example.ecommerce.book_food.repository.CategoryRepository;
import com.example.ecommerce.book_food.repository.FoodRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
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
    public Page<FoodResponse> getAllFoods(int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        Page<Food> foods = foodRepository.findAllByOrderByCreatedAtDesc(pageable);
        return foods.map(foodMapper::toResponse);
    }

    //lấy đồ ăn theo id
    public FoodResponse getFoodById(long id) throws FoodNotFoundException {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new FoodNotFoundException("Food not found with id: " +  id));
        return foodMapper.toResponse(food);
    }

    //lay danh sach mon an theo category
    public Page<FoodResponse> getFoodsByCategory(Long categoryId, int page, int size) {
        // Kiểm tra category có tồn tại không
        boolean exists = categoryRepository.existsById(categoryId);
        if (!exists) {
            throw new CategoryNotFoundException("Category not found with id: " + categoryId);
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Food> foods = foodRepository.findByCategoryId(categoryId, pageable);
        return foods.map(foodMapper::toResponse);
    }

    //tạo món ăn mới
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

    //tìm kiếm món ăn
    public Page<FoodResponse> searchFoods(String keyword, Long categoryId,
                                          BigDecimal minPrice, BigDecimal maxPrice, Boolean trangthai,
                                          int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        //nếu dùng keyword tìm kiếm
        if (keyword != null && !keyword.trim().isEmpty()) {
            Page<Food> foods;
            if (trangthai != null) {  // Kết hợp keyword + trạng thái
                foods = foodRepository.findByNameContainingAndAvailable(keyword, trangthai, pageable);
            } else {
                foods = foodRepository.findByNameContainingIgnoreCase(keyword, pageable);
            }
            if (foods.isEmpty()) {
                throw new FoodNotFoundException("Food not found with name: " + keyword);
            }
            return foods.map(foodMapper::toResponse);
        }

        //lọc theo trạng thái
        // Nếu có trạng thái (không keyword)
        if (trangthai != null) {
            if (trangthai) {
                return foodRepository.findByIsAvailableIsTrueOrderByCreatedAtDesc(pageable)
                        .map(foodMapper::toResponse);
            } else {
                return foodRepository.findByIsAvailableIsFalseOrderByCreatedAtDesc(pageable)
                        .map(foodMapper::toResponse);
            }
        }

        //nếu không có kw thì lọc theo category và khoảng giá
        Page<Food> foods = foodRepository.findFoodsWithFilters(categoryId, minPrice, maxPrice, pageable);
        return foods.map(foodMapper::toResponse);
    }

    // update món ăn
    public FoodResponse updateFood(UpdateFoodRequest request, Long id) throws FoodNotFoundException {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new FoodNotFoundException("Food not found with id: " + id));
        if(request.getName() != null) food.setName(request.getName());
        if(request.getDescription() != null) food.setDescription(request.getDescription());
        if(request.getPrice() != null) food.setPrice(request.getPrice());
        if(request.getImageUrl() != null) food.setImageUrl(request.getImageUrl());
        if(request.getPreparationTime() != null) food.setPreparationTime(request.getPreparationTime());
        if(request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + request.getCategoryId()));
            food.setCategory(category);
        }
        if(request.getIsAvailable() != null) food.setIsAvailable(request.getIsAvailable());
        return foodMapper.toResponse(foodRepository.save(food));

    }

    //xóa món ăn
    public void deleteFood(Long id) throws FoodNotFoundException {
        if(!foodRepository.existsById(id)) {
            throw new FoodNotFoundException("Food not found with id: " + id);
        }
        foodRepository.deleteById(id);
    }

}
