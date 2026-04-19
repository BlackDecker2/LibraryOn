package com.cms.service;

import com.cms.dto.AuthDtos;
import com.cms.model.ERole;
import com.cms.model.Role;
import com.cms.model.User;
import com.cms.repository.RoleRepository;
import com.cms.repository.UserRepository;
import com.cms.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthDtos.JwtResponse login(AuthDtos.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        org.springframework.security.core.userdetails.User principal =
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
        List<String> roles = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();

        return new AuthDtos.JwtResponse(jwt, user.getId(), user.getName(), user.getEmail(), roles);
    }

    @Transactional
    public void register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new IllegalArgumentException("El email ya está en uso: " + request.getEmail());

        ERole eRole = "admin".equalsIgnoreCase(request.getRole()) ? ERole.ROLE_ADMIN : ERole.ROLE_EDITOR;
        Role role = roleRepository.findByName(eRole)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado. ¿Arrancó el DataInitializer?"));

        User user = new User(request.getName(), request.getEmail(),
                passwordEncoder.encode(request.getPassword()));
        user.setRoles(Set.of(role));
        userRepository.save(user);
    }
}
