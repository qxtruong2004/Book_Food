package com.example.ecommerce.book_food.exception;

public class FoodNotFoundException extends RuntimeException {
    public FoodNotFoundException(String s) {
        super(s);
    }
}
