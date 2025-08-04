package com.example.ecommerce.book_food.service;

import com.example.ecommerce.book_food.Enum.UserRole;
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

    //Đăng kis
    public UserResponse register(UserRegisterRequest userRegisterRequest) throws EmailAlreadyExistsException, UserAlreadyExistsException {
        if(userRepository.existsByEmail(userRegisterRequest.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists: " + userRegisterRequest.getEmail());
        }
        if(userRepository.existsByUsername(userRegisterRequest.getUsername())) {
            throw  new UserAlreadyExistsException("Username already exists: " + userRegisterRequest.getUsername());
        }

        User user = User.builder()
                .fullName(userRegisterRequest.getFullName())
                .username(userRegisterRequest.getUsername())
                .email(userRegisterRequest.getEmail())
                //.password(userRegisterRequest.getPassword())
                .password(passwordEncoder.encode(userRegisterRequest.getPassword()))
                .build();

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    //Đăng nhập
    public UserResponse login(UserLoginRequest userLoginRequest) throws UserNotFoundException {
        User user = userRepository.findByUsername(userLoginRequest.getUsername())
                .orElseThrow(() -> new UserNotFoundException("Username not found: " + userLoginRequest.getUsername()));
        if(!passwordEncoder.matches(userLoginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        return userMapper.toResponse(user);

    }

    //đăng nhập có sử dụng spring security
//    public AuthResponse login(LoginRequest request) {
//        authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
//        );
//
//        User user = userRepository.findByEmail(request.getEmail())
//                .orElseThrow(() -> new UserNotFoundException("User not found"));
//
//        String token = jwtService.generateToken(user);
//        return new AuthResponse(token, userMapper.toResponse(user));
//    }

    //Lấy thông tin User theo ID
    public UserResponse getUserById(Long id) throws UserNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User Not Found: " + id));
        return userMapper.toResponse(user);
    }

    //Cập nhật thông tin User.
    public UserResponse updateUser(Long id, UpdateUserRequest request) throws UserNotFoundException{
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User Not Found: " + id));
        user.setFullName(request.getName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());
        //nếu không null hoặc không phải chuỗi rỗng
        if(request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(request.getPassword());
        }
        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    //Xóa User hoặc vô hiệu hóa User.
    public void deleteUser(Long id) throws UserNotFoundException{
        if(!userRepository.existsById(id)){
            throw new UserNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    //Lấy danh sách tất cả user
    public List<UserResponse>getAllUsers(){
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }

}
