package com.cms.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private boolean active;
    private List<String> roles;
    private LocalDateTime createdAt;
}
