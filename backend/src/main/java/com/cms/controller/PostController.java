package com.cms.controller;

import com.cms.dto.PostDtos;
import com.cms.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Tag(name = "Posts", description = "Gestión de publicaciones")
@SecurityRequirement(name = "bearerAuth")
public class PostController {

    private final PostService postService;

    @GetMapping("/published")
    @Operation(summary = "Posts publicados — público, sin token")
    public ResponseEntity<PostDtos.PostPageResponse> getPublished(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(postService.getPublished(pageable));
    }

    @GetMapping("/published/{id}")
    @Operation(summary = "Ver post publicado por ID — público")
    public ResponseEntity<PostDtos.PostResponse> getPublishedById(@PathVariable Long id) {
        PostDtos.PostResponse post = postService.getById(id);
        if (!post.isPublished()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(post);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Operation(summary = "Crear post — EDITOR o ADMIN")
    public ResponseEntity<PostDtos.PostResponse> create(
            @Valid @RequestBody PostDtos.PostRequest request, Authentication auth) {
        return ResponseEntity.ok(postService.create(request, auth.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Operation(summary = "Actualizar post — autor o ADMIN")
    public ResponseEntity<PostDtos.PostResponse> update(
            @PathVariable Long id, @Valid @RequestBody PostDtos.PostRequest request, Authentication auth) {
        return ResponseEntity.ok(postService.update(id, request, auth.getName()));
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Operation(summary = "Publicar post — autor o ADMIN")
    public ResponseEntity<PostDtos.PostResponse> publish(
            @PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(postService.publish(id, auth.getName()));
    }

    @PatchMapping("/{id}/unpublish")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Operation(summary = "Despublicar post — autor o ADMIN")
    public ResponseEntity<PostDtos.PostResponse> unpublish(
            @PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(postService.unpublish(id, auth.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Operation(summary = "Eliminar post — autor o ADMIN")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth) {
        postService.delete(id, auth.getName());
        return ResponseEntity.ok(Map.of("message", "Post eliminado."));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Operation(summary = "Mis posts — borradores y publicados")
    public ResponseEntity<List<PostDtos.PostResponse>> myPosts(Authentication auth) {
        return ResponseEntity.ok(postService.getMyPosts(auth.getName()));
    }
}
