package com.example.ecommerce.book_food;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;

@SpringBootApplication
@EnableScheduling
@EnableTransactionManagement
public class BookFoodApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookFoodApplication.class, args);
    }
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }



}
