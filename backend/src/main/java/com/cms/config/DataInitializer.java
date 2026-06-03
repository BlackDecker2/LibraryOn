package com.cms.config;

import com.cms.model.ERole;
import com.cms.model.Role;
import com.cms.model.User;
import com.cms.repository.RoleRepository;
import com.cms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@Profile("prod") // o "dev" si quieres probar local primero
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // ================= ROLES =================
        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_ADMIN)));

        Role editorRole = roleRepository.findByName(ERole.ROLE_EDITOR)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_EDITOR)));

        // ================= ADMIN =================
        if (!userRepository.existsByEmail("admin@cms.com")) {
            User admin = new User(
                    "Administrador",
                    "admin@cms.com",
                    passwordEncoder.encode("admin123")
            );
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
        }

        // ================= EDITOR =================
        if (!userRepository.existsByEmail("editor@cms.com")) {
            User editor = new User(
                    "Editor Demo",
                    "editor@cms.com",
                    passwordEncoder.encode("editor123")
            );
            editor.setRoles(Set.of(editorRole));
            userRepository.save(editor);
        }

        System.out.println("DataInitializer ejecutado correctamente");
    }
}