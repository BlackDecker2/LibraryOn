# ── ETAPA 1: Build con Maven ──────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar pom.xml primero para aprovechar la caché de capas de Docker
COPY pom.xml .
RUN mvn dependency:go-offline --no-transfer-progress

# Copiar fuentes y construir
COPY src ./src
RUN mvn clean package -DskipTests --no-transfer-progress

# ── ETAPA 2: Imagen de ejecución (más liviana) ────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Usuario no-root por seguridad
RUN addgroup -S cms && adduser -S cms -G cms
USER cms

# Copiar el JAR generado en la etapa 1
COPY --from=builder /app/target/*.jar app.jar

# Puerto expuesto
EXPOSE 8080

# Variables de entorno con valores por defecto (sobrescribibles)
ENV SPRING_PROFILES_ACTIVE=prod
ENV SERVER_PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:8080/api-docs || exit 1

# Punto de entrada
ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}", \
  "-jar", "app.jar"]
