package com.example.ecommerce.book_food.repository;

import com.example.ecommerce.book_food.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    //tìm category gần đúng
    List<Category> findByNameContainingIgnoreCase(String name);

    // Kiểm tra Category có tồn tại không
    boolean existsByNameIgnoreCase(String name);

    // Đếm tổng số Category
    @Query("SELECT COUNT(c) FROM Category c")
    long countCategories();
}
