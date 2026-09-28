# VELORA / CarGuru - Luxury Auto Financing & Customer Enquiry Platform

A production-ready automotive platform featuring a single-source-of-truth **OpenAPI 3.1 contract**, a **Java 21 Spring Boot 3 microservice** backed by **MongoDB**, and a responsive **React (Vite + TypeScript)** web application styled with the high-performance **Velora** aesthetic.

---

## 🏛 Architecture Overview

```
aviralCarGuru/
├── contracts/
│   └── carguru-api-spec.yaml        # Single Source of Truth OpenAPI 3.1 Contract
├── backend/                          # Java 21 + Spring Boot 3.3.4 + MongoDB Microservice
│   ├── pom.xml                       # openapi-generator-maven-plugin for Spring Controllers & DTOs
│   ├── src/main/java/                # Services, Repositories, and Controller implementations
│   └── Dockerfile                    # Multi-stage Maven -> Eclipse Temurin JRE 21 Alpine
├── frontend/                         # React 18 + TypeScript + Vite UI
│   ├── package.json                  # "api:generate" script using openapi-typescript
│   ├── src/api/generated/            # Auto-generated TypeScript types & schemas
│   ├── src/components/               # Financing Calculator, Application Wizard, Enquiry Form, Tracker
│   ├── nginx.conf                    # Nginx Alpine reverse proxy for SPA and /api routes
│   └── Dockerfile                    # Multi-stage Node 22 -> Nginx Alpine
└── docker-compose.yml                # Orchestrates MongoDB 7.0, Spring Boot backend, and React UI
```

---

## ⚡ Contract-First Synchronization Workflow

Whenever the API contract changes in `contracts/carguru-api-spec.yaml`:

1. **Update Java Backend Interfaces & DTOs**:
   ```bash
   cd backend
   mvn compile
   ```
   *Generated Java sources will be produced in `backend/target/generated-sources/openapi/`.*

2. **Update React Frontend Types & API Client**:
   ```bash
   cd frontend
   npm run api:generate
   ```
   *Generated TypeScript types will be refreshed in `frontend/src/api/generated/schema.ts`.*

---

## 🚀 Running with Docker Compose

To launch all three services (**MongoDB**, **Java Backend**, and **React Frontend**) in a unified Docker network:

```bash
docker compose up --build
```

- **Frontend Website**: [http://localhost:3001](http://localhost:3001) (configurable via `FRONTEND_PORT`)
- **Backend Microservice**: [http://localhost:8080](http://localhost:8080)
- **Interactive Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Health Check**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)
- **MongoDB**: `localhost:27017`

---

## 💻 Running Locally (Development Mode)

### Prerequisites:
- Java 21+ & Maven 3.9+
- Node.js 20+ & npm
- Local MongoDB running on port 27017 (or `docker run -d -p 27017:27017 --name mongo mongo:7.0`)

### 1. Start the Java Spring Boot Backend:
```bash
cd backend
mvn spring-boot:run
```

### 2. Start the React Frontend:
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 API Milestone Matrix

### Car Financing (`/api/v1/financing`)
- `POST /api/v1/financing/calculator`: Calculates monthly EMI, capitalized cost, total interest, and annual amortization schedule.
- `GET /api/v1/financing/options`: Retrieves tenure options (24-84 months) and APR credit rating tiers.
- `POST /api/v1/financing/pre-qualification`: Instant soft credit-pull eligibility assessment.
- `POST /api/v1/financing/applications`: Commits full multi-step loan application to MongoDB (`VEL-APP-2026-XXXX`).
- `GET /api/v1/financing/applications/{id}`: Retrieves application underwriting status and timeline.
- `POST /api/v1/financing/applications/{id}/documents`: Attaches applicant verification documents.

### Customer Enquiry (`/api/v1/enquiries`)
- `POST /api/v1/enquiries`: Captures general inquiries, lease advice, and price quotes (`VEL-ENQ-XXXX`).
- `GET /api/v1/enquiries/{id}`: Lookup enquiry status and advisor resolution notes.
- `GET /api/v1/enquiries/categories`: Retrieves categories and contact time windows.
- `POST /api/v1/enquiries/test-drive`: Schedules dealership VIP test-drive reservations (`VEL-DRIVE-XXXX`).
- `PATCH /api/v1/enquiries/{id}/cancel`: Customer cancellation or withdrawal.

### Vehicle Catalog (`/api/v1/catalog`)
- `GET /api/v1/catalog/vehicles/lookup`: Auto-completes luxury fleet vehicles and MSRP.
- `GET /api/v1/catalog/vehicles/{id}/finance-profile`: Retrieves finance incentives and lease estimates.
