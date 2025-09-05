package com.example.ecommerce.book_food.service;

import com.example.ecommerce.book_food.repository.RefreshTokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class RefreshTokenCleanupService {

    private final RefreshTokenRepository refreshTokenRepository;
    public RefreshTokenCleanupService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    //chạy mỗi 3 ngày
    @Scheduled(fixedRate = 259200000)
    @Transactional
    public void cleanExpiredTokens() {
        Date now = new Date();
        refreshTokenRepository.deleteAllByExpiryDateBefore(now);
        System.out.println("Cleanup expired tokens at: " + now);
    }
}
