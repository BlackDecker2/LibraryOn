@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // 🔒 Evita doble inicialización
        if (roleRepository.count() > 0) {
            log.info("BD ya inicializada, se omite seed");
            return;
        }

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

        log.info("Inicialización completada correctamente");
    }
}