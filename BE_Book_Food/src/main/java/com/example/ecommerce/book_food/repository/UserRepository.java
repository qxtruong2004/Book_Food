package com.example.ecommerce.book_food.repository;

import com.example.ecommerce.book_food.Enum.UserStatus;
import com.example.ecommerce.book_food.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    //tìm user theo username(login)
    Optional<User> findByUsername(String username);

    // Kiểm tra email đã tồn tại chưa
    boolean existsByEmail(String email);

    // kiểm tra sdt đã tồn tại chưa
    boolean existsByPhone(String phone);

    // Kiểm tra username đã tồn tại chưa
    boolean existsByUsername(String username);

    List<User> findByStatus(UserStatus status);
}
