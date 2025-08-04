package com.example.ecommerce.book_food.controller;

import com.example.ecommerce.book_food.dto.request.UserLoginRequest;
import com.example.ecommerce.book_food.dto.request.UserRegisterRequest;
import com.example.ecommerce.book_food.dto.respone.ApiResponse;
import com.example.ecommerce.book_food.dto.respone.UserResponse;
import com.example.ecommerce.book_food.service.UserService;
//import jakarta.validation.Valid;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody UserRegisterRequest request) {
        UserResponse response = userService.register(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(
            @Valid @RequestBody UserLoginRequest request) {
        UserResponse response = userService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
//
//    @PostMapping("/refresh")
//    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
//            @Valid @RequestBody RefreshTokenRequest request) {
//        AuthResponse response = authUseCase.refreshToken(request.getRefreshToken());
//        return ResponseEntity.ok(ApiResponse.success(response));
//    }
//
//    @PostMapping("/logout")
//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse<String>> logout(
//            Authentication authentication) {
//        authUseCase.logout(getCurrentUserId(authentication));
//        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
//    }
//
//    private Long getCurrentUserId(Authentication authentication) {
//        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
//        return userPrincipal.getId();
//    }
}
