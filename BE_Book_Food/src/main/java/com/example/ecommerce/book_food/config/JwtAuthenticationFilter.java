package com.example.ecommerce.book_food.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
//kiểm tra token trong header cho các endpoint bảo mậ
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, UserDetailsService userDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //Lấy JWT từ header Authorization
        String token = getJwtFromRequest(request);
        if(token != null && jwtTokenProvider.validateToken(token)) {
            String username = jwtTokenProvider.getUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username); //tải thông tin user từ db

            //Tạo một Authentication object cho Spring Security (ai đó, = null vì đã xt token, quyền của user)
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            //Đặt Authentication vào SecurityContext -> Sau bước này, trong suốt vòng đời request,
            // SecurityContextHolder.getContext().getAuthentication() trả về user đã xác thực và sẽ dựa vao đây để phân quyền
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        //Tiếp tục chuỗi filter để request được xử lý tiếp (các filter tiếp theo, controller, v.v.).
        //Quan trọng: luôn phải gọi doFilter dù có xác thực được hay không, để request không bị dừng giữa chừng.
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        // Lấy giá trị của header "Authorization" từ request
        String bearerToken = request.getHeader("Authorization");

        // Kiểm tra nếu header không rỗng và bắt đầu bằng "Bearer "
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            // Cắt chuỗi, bỏ phần "Bearer " (7 ký tự) để lấy ra token thực sự
            return bearerToken.substring(7);
        }
        return null;
    }
}
