package com.cms.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.*;
import io.swagger.v3.oas.models.security.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
            .info(new Info().title("CMS API").version("1.0.0")
                .description("Sistema de gestión de contenido — roles ADMIN y EDITOR")
                .contact(new Contact().name("CMS Team").email("admin@cms.com")))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .components(new Components().addSecuritySchemes("bearerAuth",
                new SecurityScheme().name("bearerAuth")
                    .type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")
                    .description("Ingresa el JWT obtenido en POST /api/auth/login")));
    }
}
