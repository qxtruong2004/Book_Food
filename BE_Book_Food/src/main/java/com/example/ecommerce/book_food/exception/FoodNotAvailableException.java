package com.example.ecommerce.book_food.exception;

public class FoodNotAvailableException extends RuntimeException {
    public FoodNotAvailableException(String message) {
        super(message);
    }
}
