package com.example.ecommerce.book_food.controller;

import com.example.ecommerce.book_food.Enum.UserStatus;
import com.example.ecommerce.book_food.dto.request.ChangeStatusUserRequest;
import com.example.ecommerce.book_food.dto.request.UpdateUserRequest;
import com.example.ecommerce.book_food.dto.respone.ApiResponse;
import com.example.ecommerce.book_food.dto.respone.UserResponse;
import com.example.ecommerce.book_food.entity.User;
import com.example.ecommerce.book_food.exception.UserNotFoundException;
import com.example.ecommerce.book_food.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class UserController {
    private final UserService userService;

    //xem thông tin cá nhân của bản thân
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/my_profile")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserResponse userResponse = userService.getMyProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }

    //xem thông tin của user theo id
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    //lấy thông tin tất cả người dùng
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    //lay ds người dùng có phân trang
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserResponse>>> searcUsers(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(required = false) UserStatus status,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        Page<UserResponse> users = userService.searchUsers(name,status, pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    //người dùng cập nhật thông tin bản thân
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/update_profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserByUser(@Valid @RequestBody UpdateUserRequest request, @AuthenticationPrincipal UserDetails userDetails){
        UserResponse userResponse = userService.updateUserByUser(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }

    //admin cập nhật người dùng
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserById(
            @PathVariable long id,
            @Valid @RequestBody UpdateUserRequest updateUserRequest){
        UserResponse userUpdate = userService.updateUserByAdmin(id, updateUserRequest);
        return ResponseEntity.ok(ApiResponse.success(userUpdate));
    }

//    //lấy danh sách user bị khóa
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/blocked")
//    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsersByBlocked() {
//        List<UserResponse> users = userService.getBlockedUsers();
//        return ResponseEntity.ok(ApiResponse.success(users));
//    }
//
//    // Lấy danh sách các user còn hoạt động
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/active")
//    public ResponseEntity<ApiResponse<List<UserResponse>>> getActiveUsers() {
//        List<UserResponse> activeUsers = userService.getActiveUsers();
//        return ResponseEntity.ok(ApiResponse.success(activeUsers));
//    }


    //thay đổi trạng thái tài khoản của user( cả active và block)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/status/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> changeUserStatus(
            @PathVariable long id,
            @Valid @RequestBody ChangeStatusUserRequest request) {
        UserResponse userResponse = userService.changeUserStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }


}
