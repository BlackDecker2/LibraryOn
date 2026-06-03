package com.cms.config;

import com.cms.model.ERole;
import com.cms.model.Role;
import com.cms.model.User;
import com.cms.repository.RoleRepository;
import com.cms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_ADMIN)));

        Role editorRole = roleRepository.findByName(ERole.ROLE_EDITOR)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_EDITOR)));

        if (!userRepository.existsByEmail("admin@cms.com")) {
            User admin = new User("Administrador", "admin@cms.com",
                    passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("editor@cms.com")) {
            User editor = new User("Editor Demo", "editor@cms.com",
                    passwordEncoder.encode("editor123"));
            editor.setRoles(Set.of(editorRole));
            userRepository.save(editor);
        }

        log.info("Data inicializada correctamente");
    }
}