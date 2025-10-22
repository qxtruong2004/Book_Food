package com.example.ecommerce.book_food.controller;

import com.example.ecommerce.book_food.dto.request.CreateFoodRequest;
import com.example.ecommerce.book_food.dto.request.UpdateFoodRequest;
import com.example.ecommerce.book_food.dto.respone.ApiResponse;
import com.example.ecommerce.book_food.dto.respone.FoodResponse;
import com.example.ecommerce.book_food.entity.Food;
import com.example.ecommerce.book_food.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class FoodController {
    private final FoodService foodService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<FoodResponse>>> getAllFoods(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<FoodResponse> foods = foodService.getAllFoods(page, size);
        return ResponseEntity.ok(ApiResponse.success(foods));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<FoodResponse>>> getFoodsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        List<FoodResponse> listFoods = foodService.getFoodsByCategory(categoryId, page, size);
        return ResponseEntity.ok(ApiResponse.success(listFoods));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodResponse>> getFoodById(@PathVariable Long id) {
        FoodResponse foodResponse = foodService.getFoodById(id);
        return ResponseEntity.ok(ApiResponse.success(foodResponse));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<FoodResponse>>> searchFoods(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        List<FoodResponse> listFoods = foodService.searchFoods(keyword, categoryId, minPrice, maxPrice, page, size);
        return ResponseEntity.ok(ApiResponse.success(listFoods));
    }


    //thêm món ăn (ok)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FoodResponse>> createFood(
            @Valid @RequestBody CreateFoodRequest request
            ){
        return ResponseEntity.ok(ApiResponse.success(foodService.createFood(request)));
    }


    //cap nhat món ăn
    @PutMapping("/{id}")
    @PreAuthorize(("hasRole('ADMIN')"))
    public ResponseEntity<ApiResponse<FoodResponse>> updateFood(@Valid @RequestBody UpdateFoodRequest request, @PathVariable Long id) {
        FoodResponse foodResponse = foodService.updateFood(request, id);
        return ResponseEntity.ok(ApiResponse.success(foodResponse));
    }

    //xóa món ăn
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa thành công"));
    }

}
