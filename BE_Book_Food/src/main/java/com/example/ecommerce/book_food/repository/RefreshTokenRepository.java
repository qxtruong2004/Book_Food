package com.example.ecommerce.book_food.repository;

import com.example.ecommerce.book_food.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUserId(Long userId);
    void deleteByToken(String token);
    void deleteAllByExpiryDateBefore(Date now);
}
