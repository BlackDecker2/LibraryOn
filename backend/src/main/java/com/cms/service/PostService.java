package com.cms.service;

import com.cms.dto.PostDtos;
import com.cms.model.ERole;
import com.cms.model.Post;
import com.cms.model.User;
import com.cms.repository.PostRepository;
import com.cms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public PostDtos.PostResponse create(PostDtos.PostRequest req, String email) {
        User author = findUser(email);
        Post post = new Post();
        post.setTitle(req.getTitle());
        post.setContent(req.getContent());
        post.setAuthor(author);
        post.setPublished(false);
        return toDto(postRepository.save(post));
    }

    @Transactional
    public PostDtos.PostResponse update(Long id, PostDtos.PostRequest req, String email) {
        Post post = findPost(id);
        assertOwnerOrAdmin(post, email);
        post.setTitle(req.getTitle());
        post.setContent(req.getContent());
        return toDto(postRepository.save(post));
    }

    @Transactional
    public PostDtos.PostResponse publish(Long id, String email) {
        Post post = findPost(id);
        assertOwnerOrAdmin(post, email);
        post.setPublished(true);
        return toDto(postRepository.save(post));
    }

    @Transactional
    public PostDtos.PostResponse unpublish(Long id, String email) {
        Post post = findPost(id);
        assertOwnerOrAdmin(post, email);
        post.setPublished(false);
        return toDto(postRepository.save(post));
    }

    @Transactional
    public void delete(Long id, String email) {
        Post post = findPost(id);
        assertOwnerOrAdmin(post, email);
        postRepository.delete(post);
    }

    public List<PostDtos.PostResponse> getMyPosts(String email) {
        User user = findUser(email);
        return postRepository.findByAuthorId(user.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public PostDtos.PostPageResponse getPublished(Pageable pageable) {
        Page<Post> page = postRepository.findByPublishedTrue(pageable);
        PostDtos.PostPageResponse r = new PostDtos.PostPageResponse();
        r.setContent(page.getContent().stream().map(this::toDto).collect(Collectors.toList()));
        r.setPageNumber(page.getNumber());
        r.setPageSize(page.getSize());
        r.setTotalElements(page.getTotalElements());
        r.setTotalPages(page.getTotalPages());
        r.setLast(page.isLast());
        return r;
    }

    public List<PostDtos.PostResponse> getAll() {
        return postRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public PostDtos.PostResponse getById(Long id) {
        return toDto(findPost(id));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + email));
    }

    private Post findPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post no encontrado: " + id));
    }

    private void assertOwnerOrAdmin(Post post, String email) {
        User user = findUser(email);
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == ERole.ROLE_ADMIN);
        if (!isAdmin && !post.getAuthor().getEmail().equals(email))
            throw new AccessDeniedException("No tienes permiso para modificar este post.");
    }

    private PostDtos.PostResponse toDto(Post p) {
        PostDtos.PostResponse dto = new PostDtos.PostResponse();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setContent(p.getContent());
        dto.setPublished(p.isPublished());
        dto.setAuthorName(p.getAuthor().getName());
        dto.setAuthorId(p.getAuthor().getId());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUpdatedAt(p.getUpdatedAt());
        return dto;
    }
}
