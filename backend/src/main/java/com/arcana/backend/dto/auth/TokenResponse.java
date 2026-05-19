package com.arcana.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class TokenResponse {
    private String accessToken;
    private String tokenType;
    private UserResponse user;

    public static TokenResponse of(String accessToken, UserResponse user) {
        return new TokenResponse(accessToken, "Bearer", user);
    }
}
