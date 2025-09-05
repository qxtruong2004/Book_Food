package com.example.ecommerce.book_food.config;

import com.example.ecommerce.book_food.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-token-validity}")
    private long accessTokenValidity;

    @Value("${jwt.refresh-token-validity}")
    private long refreshTokenValidity ;
    private Key key;

    public String getJwtSecret() {
        return jwtSecret;
    }

    public void setJwtSecret(String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    public long getAccessTokenValidity() {
        return accessTokenValidity;
    }

    public void setAccessTokenValidity(long accessTokenValidity) {
        this.accessTokenValidity = accessTokenValidity;
    }

    public long getRefreshTokenValidity() {
        return refreshTokenValidity;
    }

    public void setRefreshTokenValidity(long refreshTokenValidity) {
        this.refreshTokenValidity = refreshTokenValidity;
    }

    public Key getKey() {
        return key;
    }

    public void setKey(Key key) {
        this.key = key;
    }

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setId(UUID.randomUUID().toString())                                        //nhận diện token
                .setSubject(user.getUsername())                                             //chủ token
                .claim("userId", user.getId())
                .claim("fullName", user.getFullName())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .claim("status", user.getStatus().name())
                .setIssuedAt(new Date())                                                    //thời điểm token phat hành
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenValidity)) //thời điểm token hết hạn
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();                                                                 //trả về chuỗi JWT hoàn chỉnh
    }

    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenValidity))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    //kiểm tra token có thật và còn hạn không, rồi lấy tt bên trong ra để hệ thống biết người dùng là ai, có quyền gì
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()             //Dùng để tạo một JWT parser (trình phân tích JWT).
                .setSigningKey(key)             //Xác định chìa key để xác thực chữ ký của token.
                .build()
                .parseClaimsJws(token)          //Kiểm tra tính hợp lệ của token
                .getBody();
    }

    public String getUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public String getFullName(String token) {
        return  parseClaims(token).get("fullName", String.class);
    }

    public String getStatusFromToken(String token) {
        return parseClaims(token).get("status", String.class);
    }

    public String getEmailFromToken(String token) {
        return parseClaims(token).get("email", String.class);
    }

    public Long getUserIdFromToken(String token) {
        Number n = parseClaims(token).get("userId", Number.class);
        return n == null ? null : n.longValue();
    }

    public String getRoleFromToken(String token) {
        return parseClaims(token).get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException ex) {
            // token hết hạn — xử lý riêng (ví dụ trả về thông báo cần refresh)
            return false;
        } catch (JwtException | IllegalArgumentException ex) {
            // malformed / unsupported / signature invalid...
            return false;
        }
    }

}
