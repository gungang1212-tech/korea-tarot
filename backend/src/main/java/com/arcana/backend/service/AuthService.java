package com.arcana.backend.service;

import com.arcana.backend.dto.auth.*;
import com.arcana.backend.entity.RefreshToken;
import com.arcana.backend.entity.User;
import com.arcana.backend.repository.RefreshTokenRepository;
import com.arcana.backend.repository.UserRepository;
import com.arcana.backend.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다.");
        }
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .build();
        return new UserResponse(userRepository.save(user));
    }

    @Transactional
    public TokenResponse login(LoginRequest request, HttpServletResponse response) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        String rawRefreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        saveRefreshToken(rawRefreshToken, user.getEmail());
        setRefreshTokenCookie(response, rawRefreshToken);

        return TokenResponse.of(accessToken, new UserResponse(user));
    }

    @Transactional
    public TokenResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        String rawToken = extractRefreshToken(request);
        if (rawToken == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh Token이 없습니다.");
        }

        if (!jwtUtil.isValid(rawToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "만료된 Refresh Token입니다.");
        }

        refreshTokenRepository.findByToken(rawToken)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "유효하지 않은 Refresh Token입니다."));

        String email = jwtUtil.extractEmail(rawToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "사용자를 찾을 수 없습니다."));

        refreshTokenRepository.deleteByToken(rawToken);

        String newAccessToken = jwtUtil.generateAccessToken(email);
        String newRefreshToken = jwtUtil.generateRefreshToken(email);
        saveRefreshToken(newRefreshToken, email);
        setRefreshTokenCookie(response, newRefreshToken);

        return TokenResponse.of(newAccessToken, new UserResponse(user));
    }

    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String rawToken = extractRefreshToken(request);
        if (rawToken != null) {
            refreshTokenRepository.deleteByToken(rawToken);
        }
        Cookie cookie = new Cookie("refresh_token", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private void saveRefreshToken(String token, String email) {
        LocalDateTime expiresAt = LocalDateTime.now()
                .plusSeconds(jwtUtil.getRefreshTokenExpiry() / 1000);
        refreshTokenRepository.save(RefreshToken.builder()
                .token(token)
                .userEmail(email)
                .expiresAt(expiresAt)
                .build());
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) (jwtUtil.getRefreshTokenExpiry() / 1000));
        response.addCookie(cookie);
    }

    private String extractRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> "refresh_token".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
