# Multi-stage Docker build for Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /workspace

# Copy contracts for openapi generation
COPY contracts /contracts

# Copy backend pom and sources
COPY backend/pom.xml .
COPY backend/src src

RUN mvn clean package -DskipTests

# Production image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /workspace/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
