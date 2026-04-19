package com.cms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

public class PostDtos {

    @Data
    public static class PostRequest {
        @NotBlank(message = "El título no puede estar vacío")
        @Size(max = 200, message = "Título máximo 200 caracteres")
        private String title;

        @NotBlank(message = "El contenido no puede estar vacío")
        private String content;
    }

    @Data
    public static class PostResponse {
        private Long id;
        private String title;
        private String content;
        private boolean published;
        private String authorName;
        private Long authorId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    public static class PostPageResponse {
        private List<PostResponse> content;
        private int pageNumber;
        private int pageSize;
        private long totalElements;
        private int totalPages;
        private boolean last;
    }
}
