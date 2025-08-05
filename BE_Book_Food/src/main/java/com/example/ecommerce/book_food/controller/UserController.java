package com.example.ecommerce.book_food.controller;

import com.example.ecommerce.book_food.dto.request.UpdateUserRequest;
import com.example.ecommerce.book_food.dto.respone.ApiResponse;
import com.example.ecommerce.book_food.dto.respone.UserResponse;
import com.example.ecommerce.book_food.entity.User;
import com.example.ecommerce.book_food.exception.UserNotFoundException;
import com.example.ecommerce.book_food.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserById(
            @PathVariable long id,
            @RequestBody UpdateUserRequest updateUserRequest){
        UserResponse userUpdate = userService.updateUser(id, updateUserRequest);
        return ResponseEntity.ok(ApiResponse.success(userUpdate));
    }

    //lấy danh sách user bị khóa
    @GetMapping("/blocked")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsersByBlocked() {
        List<UserResponse> users = userService.getBlockedUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    // Lấy danh sách các user còn hoạt động
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getActiveUsers() {
        List<UserResponse> activeUsers = userService.getActiveUsers();
        return ResponseEntity.ok(ApiResponse.success(activeUsers));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> deleteUserById(@PathVariable long id) {
        UserResponse  userResponse = userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }


}
