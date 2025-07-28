package com.example.ecommerce.book_food.repository;

import com.example.ecommerce.book_food.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Tìm user theo email (dùng cho login)
    Optional<User> findByEmail(String email);

    // Kiểm tra email đã tồn tại chưa
    boolean existsByEmail(String email);

    // Kiểm tra username đã tồn tại chưa
    boolean existsByUsername(String username);
}
