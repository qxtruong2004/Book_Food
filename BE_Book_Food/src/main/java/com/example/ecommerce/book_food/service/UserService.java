package com.example.ecommerce.book_food.service;

import com.example.ecommerce.book_food.repository.FoodRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final FoodRepository foodRepository;
//    private final CategoryRepository categoryRepository;
//    private final FoodMapper foodMapper;
}
