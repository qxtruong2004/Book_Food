package com.example.ecommerce.book_food.service;

import com.example.ecommerce.book_food.dto.request.CreateCategoryRequest;
import com.example.ecommerce.book_food.dto.request.UpdateCategoryRequest;
import com.example.ecommerce.book_food.dto.respone.CategoryResponse;
import com.example.ecommerce.book_food.entity.Category;
import com.example.ecommerce.book_food.exception.CategoryAlreadyExistsException;
import com.example.ecommerce.book_food.exception.CategoryNotFoundException;
import com.example.ecommerce.book_food.mapper.CategoryMapper;
import com.example.ecommerce.book_food.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    //Tạo danh mục mới.
    public CategoryResponse createCategory(CreateCategoryRequest request) throws CategoryAlreadyExistsException {
        if(categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new CategoryAlreadyExistsException("Category name is already: " + request.getName());
        }
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toRespone(savedCategory);
    }

    //Cập nhật danh mục.
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) throws CategoryNotFoundException, CategoryAlreadyExistsException {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        if (categoryRepository.existsByNameIgnoreCase(request.getName())
                && !category.getName().equalsIgnoreCase(request.getName())) {
            throw new CategoryAlreadyExistsException("Category name already exists: " + request.getName());
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        Category updateCategory = categoryRepository.save(category);
        return categoryMapper.toRespone(updateCategory);
    }

    //Lấy danh sách tất cả danh mục.
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toRespone)
                .toList();
    }

    //Xóa danh mục (nếu không chứa món ăn).
    public void deleteCategory(Long id) throws CategoryNotFoundException {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));

        //kiểm tra xem category này có chứa món ăn không
        if(category.getFoods() != null && !category.getFoods().isEmpty()) {
            throw new RuntimeException("Cannot delete category because it contains foods");
        }
        categoryRepository.delete(category);

    }

}
