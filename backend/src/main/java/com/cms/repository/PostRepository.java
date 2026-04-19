package com.cms.repository;

import com.cms.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByPublishedTrue(Pageable pageable);
    List<Post> findByAuthorId(Long authorId);
}
