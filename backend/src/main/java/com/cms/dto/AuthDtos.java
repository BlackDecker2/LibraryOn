package com.cms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

public class AuthDtos {

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 6, max = 40)
        private String password;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank @Size(max = 80)
        private String name;
        @NotBlank @Email @Size(max = 120)
        private String email;
        @NotBlank @Size(min = 6, max = 40)
        private String password;
        private String role; // "editor" | "admin"
    }

    @Data
    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String name;
        private String email;
        private List<String> roles;

        public JwtResponse(String token, Long id, String name, String email, List<String> roles) {
            this.token = token;
            this.id    = id;
            this.name  = name;
            this.email = email;
            this.roles = roles;
        }
    }
}
