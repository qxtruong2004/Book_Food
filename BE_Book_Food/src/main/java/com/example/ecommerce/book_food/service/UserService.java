package com.example.ecommerce.book_food.service;

import com.example.ecommerce.book_food.Enum.UserRole;
import com.example.ecommerce.book_food.Enum.UserStatus;
import com.example.ecommerce.book_food.dto.request.ChangeStatusUserRequest;
import com.example.ecommerce.book_food.dto.request.UpdateUserRequest;
import com.example.ecommerce.book_food.dto.request.UserLoginRequest;
import com.example.ecommerce.book_food.dto.request.UserRegisterRequest;
import com.example.ecommerce.book_food.dto.respone.UserResponse;
import com.example.ecommerce.book_food.entity.User;
import com.example.ecommerce.book_food.exception.EmailAlreadyExistsException;
import com.example.ecommerce.book_food.exception.UserAlreadyExistsException;
import com.example.ecommerce.book_food.exception.UserNotFoundException;
import com.example.ecommerce.book_food.mapper.UserMapper;
import com.example.ecommerce.book_food.repository.FoodRepository;
import com.example.ecommerce.book_food.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    private final PasswordEncoder passwordEncoder; // nếu bạn có Spring Security

    //Lấy thông tin User theo ID
    public UserResponse getUserById(Long id) throws UserNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with: " + id));
        return userMapper.toResponse(user);
    }

    //Cập nhật thông tin User.(admin)
    public UserResponse updateUserByAdmin(Long id, UpdateUserRequest request) throws UserNotFoundException{
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        user.setFullName(request.getName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());
        //nếu không null hoặc không phải chuỗi rỗng
        if(request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    //Cập nhật thông tin User (user)
    public UserResponse updateUserByUser(String username, UpdateUserRequest request) throws UserNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with: " + username));


        user.setFullName(request.getName());
        user.setPhone(request.getPhone());
        if (!request.getEmail().equals(user.getEmail())) {
            boolean exists = userRepository.existsByEmail(request.getEmail());
            if (exists) {
                throw new EmailAlreadyExistsException("Email đã tồn tại");
            }
            user.setEmail(request.getEmail());
        }
        user.setAddress(request.getAddress());
        //nếu không null hoặc không phải chuỗi rỗng
        if(request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    //Lấy danh sách tất cả user
    public List<UserResponse>getAllUsers(){
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    //Lấy danh sách các user bị khóa
    public List<UserResponse> getBlockedUsers(){
        return userRepository.findByStatus(UserStatus.BLOCKED).stream()
                .map(userMapper::toResponse)
                .toList();
    }

    //Lấy danh sách các user còn hoạt động
    public List<UserResponse> getActiveUsers(){
        return userRepository.findByStatus(UserStatus.ACTIVE).stream()
                .map(userMapper::toResponse)
                .toList();
    }

    //đổi mật khẩu

    //lấy thông tin của bản thân\
    public UserResponse getMyProfile(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username" + username));
        return userMapper.toResponse(user);
    }


    //thay đổi trạng thái tài khoản của user
    public UserResponse changeUserStatus(Long userId, ChangeStatusUserRequest request) throws UserNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        user.setStatus(request.getStatus());
        userRepository.save(user);
        return userMapper.toResponse(user);
    }


}
