package com.example.ecommerce.book_food.service;

import com.example.ecommerce.book_food.Enum.UserRole;
import com.example.ecommerce.book_food.Enum.UserStatus;
import com.example.ecommerce.book_food.config.JwtTokenProvider;
import com.example.ecommerce.book_food.dto.request.UserLoginRequest;
import com.example.ecommerce.book_food.dto.request.UserRegisterRequest;
import com.example.ecommerce.book_food.dto.respone.ApiResponse;
import com.example.ecommerce.book_food.dto.respone.AuthResponse;
import com.example.ecommerce.book_food.dto.respone.AuthResponse;
import com.example.ecommerce.book_food.dto.respone.UserResponse;
import com.example.ecommerce.book_food.entity.RefreshToken;
import com.example.ecommerce.book_food.entity.User;
import com.example.ecommerce.book_food.exception.EmailAlreadyExistsException;
import com.example.ecommerce.book_food.exception.UserAlreadyExistsException;
import com.example.ecommerce.book_food.exception.UserNotFoundException;
import com.example.ecommerce.book_food.repository.RefreshTokenRepository;
import com.example.ecommerce.book_food.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;


@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, RefreshTokenRepository refreshTokenRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public ApiResponse<AuthResponse> login(UserLoginRequest request) {
        try{
            //tìm user theo username
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new UserNotFoundException("User not found with username" + request.getUsername()) );

            //xác thực user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            //tạo token
            String accessToken = jwtTokenProvider.generateAccessToken(user);
            String refreshToken = jwtTokenProvider.generateRefreshToken(user);

            //lưu refreshToken vào database
            RefreshToken refreshTokenEntity = new RefreshToken();
            refreshTokenEntity.setToken(refreshToken);
            refreshTokenEntity.setUserId(user.getId());
            refreshTokenEntity.setExpiryDate(new Date(System.currentTimeMillis() + jwtTokenProvider.getRefreshTokenValidity()));
            refreshTokenRepository.save(refreshTokenEntity);

            //tạo reponse
            AuthResponse authReponse = new AuthResponse(
                    accessToken,
                    refreshToken,
                    user.getId(),
                    user.getUsername(),
                    user.getRole() != null ? user.getRole().name() : "USER"
            );
            return ApiResponse.success(authReponse);
        }catch (Exception e) {
            throw new RuntimeException("Invalid username or password");
        }
    }

    public ApiResponse<AuthResponse> register(UserRegisterRequest request) throws EmailAlreadyExistsException, UserAlreadyExistsException {
        //kt email or sdt đã ton tại chưa
        if(userRepository.existsByUsername(request.getUsername())){
            throw new UserAlreadyExistsException("Username already exists: " + request.getUsername());
        }
        if(userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistsException("Email already exists: " + request.getEmail());
        }

        //tạo user moi
        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .status(UserStatus.ACTIVE)
                .role(UserRole.USER)
                .build();

        //lưu user
        User savedUser = userRepository.save(user);

        //tạo token
        String accessToken = jwtTokenProvider.generateAccessToken(savedUser);
        String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser);

        // Tạo response
        AuthResponse authResponse = new AuthResponse(
                accessToken,
                refreshToken,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getRole().name()
        );
        return ApiResponse.success(authResponse);
    }

    public ApiResponse<AuthResponse> refreshToken(String refreshToken) {
        //kiểm tra tính hợp lệ của refreshToken (chữ kí JWT)
        if(!jwtTokenProvider.validateToken(refreshToken)){
            throw  new RuntimeException("Invalid refresh token");
        }


        //Tìm bản ghi RefreshToken trong DB theo chuỗi token
        RefreshToken tokenEntity  = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        //neu token quá hạn, xóa bản ghi token khỏi database
        if(tokenEntity.getExpiryDate().before(new Date())){
            refreshTokenRepository.delete(tokenEntity);
            throw new RuntimeException("Refresh token expired");
        }

        User user = userRepository.findById(tokenEntity.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + tokenEntity.getId()));

        //Sinh access token và refresh token mới cho user.
        String newAccessToken = jwtTokenProvider.generateAccessToken(user);

        //không cập nhật refresh Token
//        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user);
//
//        //Thay token cũ bằng token mới và cập nhật expiry (theo giá trị từ jwtTokenProvider), rồi lưu lên DB.
//        tokenEntity.setToken(newRefreshToken);
//        tokenEntity.setExpiryDate(new Date(System.currentTimeMillis() + jwtTokenProvider.getRefreshTokenValidity()));
//        refreshTokenRepository.save(tokenEntity);

        AuthResponse authResponse = new AuthResponse(
                newAccessToken, refreshToken, user.getId(), user.getUsername(), user.getRole().name()
        );
        return ApiResponse.success(authResponse);
    }

    @Transactional
    public ApiResponse<String> logout(String refreshToken) {

        //kiểm tra hạn của chữ kí + refresh Token, nếu hết hạn thì tbao Invalid refresh token
        if(!jwtTokenProvider.validateToken(refreshToken)){
            throw  new RuntimeException("Invalid refresh token");
        }

        RefreshToken tokenEntity = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        refreshTokenRepository.deleteByToken(refreshToken);
        return ApiResponse.success("Logout successful");
    }

    public ApiResponse<UserResponse> getCurrentUser (String accessToken) {
        try{
            // xác thực access tokem
            if(!jwtTokenProvider.validateToken(accessToken)){
                throw  new RuntimeException("Invalid access token");
            }

            String statusString = jwtTokenProvider.getStatusFromToken(accessToken);
            UserStatus status = UserStatus.valueOf(statusString);

            //tạo user response
            UserResponse userResponse = new UserResponse(
                    jwtTokenProvider.getUserIdFromToken(accessToken),
                    jwtTokenProvider.getUsername(accessToken),
                    jwtTokenProvider.getFullName(accessToken),
                    jwtTokenProvider.getEmailFromToken(accessToken),
                    jwtTokenProvider.getRoleFromToken(accessToken),
                    status
            );
            return ApiResponse.success(userResponse);
        }
        catch (Exception e){
            throw new RuntimeException("Failed to get current user: " + e.getMessage());
        }
    }
}
