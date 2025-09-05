package com.example.ecommerce.book_food.controller;

import com.example.ecommerce.book_food.dto.request.RefreshTokenRequest;
import com.example.ecommerce.book_food.dto.request.UserLoginRequest;
import com.example.ecommerce.book_food.dto.request.UserRegisterRequest;
import com.example.ecommerce.book_food.dto.respone.ApiResponse;
import com.example.ecommerce.book_food.dto.respone.AuthResponse;
import com.example.ecommerce.book_food.dto.respone.UserResponse;
import com.example.ecommerce.book_food.exception.EmailAlreadyExistsException;
import com.example.ecommerce.book_food.exception.UserAlreadyExistsException;
import com.example.ecommerce.book_food.service.AuthService;
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
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody UserRegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody UserLoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }

    @PostMapping("/logout")
    //@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> logout(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        //kt header có tồn tại không
        if(authorizationHeader == null || authorizationHeader.isBlank()) {
            return ResponseEntity.ok(ApiResponse.fail("Missing Authorization header"));
        }

        //chuẩn hóa chuỗi header
        String token;
        String trimmedAuthorizationHeader = authorizationHeader.trim();
        if(trimmedAuthorizationHeader.startsWith("Bearer ")) {
            token = trimmedAuthorizationHeader.substring(7); //cắt "Bearer
        }
        else{
            return ResponseEntity.ok(ApiResponse.fail("Invalid Authorization header format"));
        }
        if(token.isEmpty()){
            return ResponseEntity.ok(ApiResponse.fail("Token is empty"));
        }

        try{
            ApiResponse<String> response = authService.logout(token);
            return ResponseEntity.ok(response);
        }catch(RuntimeException e){
            return ResponseEntity.ok(ApiResponse.fail(e.getMessage()));
        }

    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        String accessToken = authorizationHeader.replace("Bearer ", "");
        return ResponseEntity.ok(authService.getCurrentUser(accessToken));
    }
}
