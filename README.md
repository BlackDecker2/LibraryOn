# 📚 LibraryOn — CMS con Roles

Sistema de gestión de contenido con autenticación JWT y control de acceso por roles **ADMIN / EDITOR**, construido con Spring Boot, React y MySQL, documentado con Swagger.

---

## 🏗️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Spring Boot 3.2 · Spring Security · JWT (JJWT) |
| Frontend | React 18 · React Router v6 · Axios |
| Base de datos | MySQL 8 · Spring Data JPA / Hibernate |
| Documentación API | Swagger UI · SpringDoc OpenAPI 2 |

---

## 🚀 Inicio rápido

### Requisitos
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8

### 1. Base de datos
```sql
CREATE DATABASE cms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configurar backend
```bash
# Crear el archivo de configuración (no está en el repo por seguridad)
cp backend/src/main/resources/application.properties.example \
   backend/src/main/resources/application.properties

# Editar application.properties:
#   spring.datasource.password = tu contraseña de MySQL
#   app.jwt.secret             = clave secreta de al menos 32 caracteres
```

### 3. Arrancar backend
```bash
cd backend
mvn spring-boot:run
```
- API REST → `http://localhost:8080`
- Swagger UI → `http://localhost:8080/swagger-ui.html`

### 4. Arrancar frontend
```bash
cd frontend
npm install
npm start
```
- App → `http://localhost:3000`

---

## 🔐 Cuentas demo

Al arrancar el backend por primera vez se crean automáticamente:

| Email | Contraseña | Rol |
|---|---|---|
| admin@cms.com | admin123 | ADMIN |
| editor@cms.com | editor123 | EDITOR |

> ⚠️ **Cambiar estas credenciales antes de cualquier despliegue en producción.**

---

## 📋 Endpoints de la API

### Autenticación (público)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Login — retorna token JWT |
| POST | `/api/auth/register` | Registro (rol EDITOR por defecto) |

### Posts públicos (sin token)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/posts/published` | Listar posts publicados (paginado) |
| GET | `/api/posts/published/{id}` | Ver post publicado por ID |

### Posts protegidos (EDITOR o ADMIN)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/posts/my` | Mis posts (borradores + publicados) |
| POST | `/api/posts` | Crear post |
| PUT | `/api/posts/{id}` | Editar post (solo autor o ADMIN) |
| PATCH | `/api/posts/{id}/publish` | Publicar post |
| PATCH | `/api/posts/{id}/unpublish` | Despublicar post |
| DELETE | `/api/posts/{id}` | Eliminar post |

### Admin (solo ADMIN)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/admin/users` | Listar todos los usuarios |
| GET | `/api/admin/users/{id}` | Ver usuario por ID |
| PATCH | `/api/admin/users/{id}/toggle-active` | Activar / desactivar usuario |
| DELETE | `/api/admin/users/{id}` | Eliminar usuario |
| GET | `/api/admin/posts` | Ver todos los posts |

---

## 🔑 Usar Swagger con JWT

1. Abrir `http://localhost:8080/swagger-ui.html`
2. Ejecutar `POST /api/auth/login` con las credenciales demo
3. Copiar el campo `token` de la respuesta
4. Clic en **Authorize** 🔒 (esquina superior derecha)
5. Escribir: `Bearer <token_copiado>`
6. Todos los endpoints protegidos quedan disponibles

---

## 👥 Tabla de permisos

| Acción | EDITOR | ADMIN |
|---|---|---|
| Ver feed público | ✅ | ✅ |
| Crear posts | ✅ | ✅ |
| Editar / eliminar sus propios posts | ✅ | ✅ |
| Publicar / despublicar sus posts | ✅ | ✅ |
| Editar posts de otros editores | ❌ | ✅ |
| Ver todos los usuarios | ❌ | ✅ |
| Activar / desactivar usuarios | ❌ | ✅ |
| Eliminar usuarios | ❌ | ✅ |
| Ver todos los posts (panel admin) | ❌ | ✅ |

---

## 🗂️ Estructura del proyecto

```
LibraryOn/
├── .gitignore
├── README.md
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/cms/
│       │   ├── CmsApplication.java
│       │   ├── config/
│       │   │   ├── DataInitializer.java       ← Crea roles y usuarios demo
│       │   │   ├── GlobalExceptionHandler.java
│       │   │   ├── SecurityConfig.java
│       │   │   └── SwaggerConfig.java
│       │   ├── controller/
│       │   │   ├── AdminController.java
│       │   │   ├── AuthController.java
│       │   │   └── PostController.java
│       │   ├── dto/
│       │   │   ├── AuthDtos.java
│       │   │   ├── PostDtos.java
│       │   │   └── UserDto.java
│       │   ├── model/
│       │   │   ├── ERole.java
│       │   │   ├── Post.java
│       │   │   ├── Role.java
│       │   │   └── User.java
│       │   ├── repository/
│       │   │   ├── PostRepository.java
│       │   │   ├── RoleRepository.java
│       │   │   └── UserRepository.java
│       │   ├── security/
│       │   │   ├── JwtAuthFilter.java
│       │   │   ├── JwtUtils.java
│       │   │   └── UserDetailsServiceImpl.java
│       │   └── service/
│       │       ├── AuthService.java
│       │       ├── PostService.java
│       │       └── UserService.java
│       └── resources/
│           └── application.properties         ← NO se sube al repo
└── frontend/
    ├── package.json
    └── src/
        ├── index.js
        ├── index.css
        ├── App.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── services/
        │   └── api.js
        ├── components/
        │   ├── layout/Navbar.jsx
        │   └── posts/PostForm.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── PublicFeed.jsx
            ├── EditorDashboard.jsx
            └── AdminDashboard.jsx
```
