package com.example.ecommerce.book_food.controller;

import com.example.ecommerce.book_food.dto.request.CreateCategoryRequest;
import com.example.ecommerce.book_food.dto.request.UpdateCategoryRequest;
import com.example.ecommerce.book_food.dto.respone.ApiResponse;
import com.example.ecommerce.book_food.dto.respone.CategoryResponse;
import com.example.ecommerce.book_food.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class CategoryController {
    private final CategoryService categoryService;

    //lấy tất cả danh mục
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CategoryResponse>>> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<CategoryResponse> categoryResponseList = categoryService.getAllCategories(page, size);
        // nếu muốn trả về gọn hơn
//        Map<String, Object> response = new HashMap<>();
//        response.put("items", categoryPage.getContent());
//        response.put("currentPage", categoryPage.getNumber());
//        response.put("totalItems", categoryPage.getTotalElements());
//        response.put("totalPages", categoryPage.getTotalPages());

        return ResponseEntity.ok(ApiResponse.success(categoryResponseList));
    }

    //lấy danh mục theo id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        CategoryResponse categoryResponse = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success(categoryResponse));
    }

    // tạo danh mục mới
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CreateCategoryRequest createCategoryRequest
    ){
        CategoryResponse categoryResponse = categoryService.createCategory(createCategoryRequest);
        return ResponseEntity.ok(ApiResponse.success(categoryResponse));
    }

    //cập nhật danh mục mới
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequest updateCategoryRequest
        ){
        CategoryResponse categoryResponse = categoryService.updateCategory(id, updateCategoryRequest);
        return ResponseEntity.ok(ApiResponse.success(categoryResponse));
    }

    //xóa danh mục nếu danh mục đó chưa có món ăn
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted"));
    }

    //lấy tổng số luong categories
    @GetMapping("/total-categories")
    public ResponseEntity<ApiResponse<Long>> getAllCategories(){
        Long total = categoryService.countCategories();
        return ResponseEntity.ok(ApiResponse.success(total));
    }

    //tìm kiếm category theo tên
    @GetMapping("search")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategoriesBySearch(@RequestParam String keywords){
        List<CategoryResponse> categoryResponseList = categoryService.searchCategory(keywords);
        return ResponseEntity.ok(ApiResponse.success(categoryResponseList));
    }

}
