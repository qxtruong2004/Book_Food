package com.example.ecommerce.book_food.service;

import com.example.ecommerce.book_food.dto.respone.UserResponse;
import com.example.ecommerce.book_food.entity.User;
import com.example.ecommerce.book_food.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
//cung cấp thông tin người dùng cho Spring Security khi đăng nhập.
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                //Nếu tìm thấy user → Trả về một đối tượng org.springframework.security.core.userdetails.User
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password(user.getPassword())
                        .authorities("ROLE_" + user.getRole().name())
                        .build()
                )
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }
}
