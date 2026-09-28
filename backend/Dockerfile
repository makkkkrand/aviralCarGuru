# syntax=docker/dockerfile:1

# ----------------------------------------------------------------------------
# Stage 1: Build Application and Generate OpenAPI Sources
# ----------------------------------------------------------------------------
FROM maven:3.9.8-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Copy OpenAPI Contract
COPY contracts /contracts

# Copy Maven POM and download dependencies
COPY backend/pom.xml /build/
RUN mvn dependency:go-offline -B

# Copy backend source code and package JAR
COPY backend/src /build/src
RUN mvn clean package -DskipTests -B

# ----------------------------------------------------------------------------
# Stage 2: Minimal Production JRE Runtime
# ----------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine AS runtime

# Install curl for healthchecks
RUN apk --no-cache add curl && \
    addgroup -S velora && adduser -S velora -G velora

WORKDIR /app

# Copy built JAR from builder stage
COPY --from=builder /build/target/carguru-service-1.0.0-SNAPSHOT.jar /app/app.jar

# Run as non-root user
USER velora

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/app.jar"]
