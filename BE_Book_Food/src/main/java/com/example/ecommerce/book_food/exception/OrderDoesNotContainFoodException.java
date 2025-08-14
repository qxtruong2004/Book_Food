package com.example.ecommerce.book_food.exception;

public class OrderDoesNotContainFoodException extends RuntimeException {
    public OrderDoesNotContainFoodException(String message) {
        super(message);
    }
}
