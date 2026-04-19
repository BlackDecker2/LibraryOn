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

/**
 * Crea roles y usuarios demo al arrancar la app.
 * Admin:  admin@cms.com  / admin123
 * Editor: editor@cms.com / editor123
 * CAMBIAR ESTAS CREDENCIALES EN PRODUCCIÓN.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
            log.info("Rol ROLE_ADMIN creado.");
        }
        if (roleRepository.findByName(ERole.ROLE_EDITOR).isEmpty()) {
            roleRepository.save(new Role(ERole.ROLE_EDITOR));
            log.info("Rol ROLE_EDITOR creado.");
        }
        if (!userRepository.existsByEmail("admin@cms.com")) {
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN).orElseThrow();
            User admin = new User("Administrador", "admin@cms.com",
                    passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
            log.info("Admin creado: admin@cms.com / admin123");
        }
        if (!userRepository.existsByEmail("editor@cms.com")) {
            Role editorRole = roleRepository.findByName(ERole.ROLE_EDITOR).orElseThrow();
            User editor = new User("Editor Demo", "editor@cms.com",
                    passwordEncoder.encode("editor123"));
            editor.setRoles(Set.of(editorRole));
            userRepository.save(editor);
            log.info("Editor creado: editor@cms.com / editor123");
        }
    }
}
