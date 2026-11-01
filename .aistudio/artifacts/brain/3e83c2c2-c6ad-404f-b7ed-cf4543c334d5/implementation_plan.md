# Local Backend Integration & Configurable API Gateway

Connect the CarGuru web application to the user's local Spring Boot 3 + MongoDB backend running on port 8080, while providing a configurable API base URL manager inside the Admin & Underwriting Portal for seamless transitions to future cloud-deployed environments.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed based on your requirements:
> - **Direct Browser Connectivity**: Because the web application preview runs in a cloud container while your Spring Boot service runs locally on your machine, the browser client will call `http://localhost:8080` directly. This succeeds immediately because your Spring Boot `CorsConfig` allows credentials and all origins.
> - **Port 8080 Standard**: Default local endpoint is pre-configured to `http://localhost:8080`.
> - **Admin & Underwriting Portal Placement**: The Backend Gateway manager, status indicators, and live URL switcher are housed exclusively inside the internal Admin & Underwriting Portal, leaving the customer-facing loan portal clean and distraction-free.
> - **Production Extensibility**: The API base URL is persisted in `localStorage` with cascading fallback to `import.meta.env.VITE_API_URL` or relative `/api/v1`, allowing one-click switching to production domains (e.g., `https://api.carguru.in`) once deployed.

---

## 1. Overview & Core Concept

- **What It Does**: Enables end-to-end communication between the frontend interface and your local Spring Boot service (`http://localhost:8080`) for all application actions—loan calculations, CIBIL pre-qualification, loan application submissions, underwriter approval flows, document verification, lead CRM triage, and test drive scheduling.
- **Target Audience / Persona**: 
  - **Local Developers & Underwriters**: Test live database operations against local MongoDB and inspect live Spring Boot endpoints.
  - **System Administrators**: Seamlessly update the backend API endpoint from `http://localhost:8080` to staging or production microservice domains without rebuilding the codebase.
- **Key Value**: Direct live MongoDB persistence with zero proxy latency, accompanied by a dynamic configuration manager for future cloud deployments.

---

## 2. User Experience & Visual Design (Admin & Underwriting Portal)

- **Dedicated API Gateway & Connection Manager**:
  - Located at the top of the Admin & Underwriting portal (`AdminPortal.tsx`).
  - **Live Connection Badge**: Real-time ping indicator displaying connection health (e.g., `Connected to http://localhost:8080 · 18ms latency` or `Service Standby / Fallback`).
  - **Configure API URL Modal**:
    - Clean input field pre-filled with the active API base URL.
    - Quick-preset buttons:
      - `Local Spring Boot (http://localhost:8080)`
      - `Cloud / Container Proxy (/api/v1)`
      - `Custom Production URL`
    - "Test & Save Connection" action that validates `/actuator/health` or `/api/v1/catalog/vehicles/lookup` before persisting to `localStorage`.
- **Feedback & Visual Polish**:
  - Visual status pill with animated pulse when connected.
  - Informative toast/banner if local Spring Boot is not detected with a copyable terminal run command (`cd backend && ./mvnw spring-boot:run`).
  - Public customer pages (Catalog, Calculator, Application Tracker) automatically inherit the configured base URL seamlessly in the background.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Browser Fetch vs Cloud Container Proxy**
  - *Chosen Approach*: Configure the frontend `apiClient` to direct its requests straight from the user's browser to `http://localhost:8080` (or the configured endpoint).
  - *Why*: The preview container runs in Google Cloud Run and cannot access `127.0.0.1:8080` on the user's personal laptop without private networking tunnels. However, the user's browser runs directly on their laptop and has full, instant access to `localhost:8080`.
  - *Alternatives Considered*: Tunneling through ngrok or Cloudflare tunnels (added complexity, requires external third-party software). Direct browser calls are instant and require zero extra tools.
- **Decision 2: Persistent URL Configuration Hierarchy**
  - *Chosen Approach*: `localStorage.getItem('carguru_backend_api_url')` $\to$ `import.meta.env.VITE_API_URL` $\to$ `http://localhost:8080`.
  - *Why*: Allows instant in-browser updates that persist across page reloads without touching environment variables or rebuilding Docker containers.
- **Decision 3: Scope of Connection UI**
  - *Chosen Approach*: Confined strictly to the Admin & Underwriting Portal as requested.
  - *Why*: Preserves consumer-facing brand trust and visual elegance for retail car buyers.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       User's Browser                        │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │        Public Portal (Customer Loan Journey)        │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │                              │
│   ┌──────────────────────────▼──────────────────────────┐   │
│   │     Admin & Underwriting Portal (Staff Desk)        │   │
│   │     - Live Health Ping & Latency Display            │   │
│   │     - Base URL Configurator (Presets + Custom URL)  │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │                              │
│                              ▼                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │       ApiClient Singleton (frontend/src/api)        │   │
│   │       Base URL: localStorage || VITE_API_URL || 8080 │   │
│   └──────────────────────────┬──────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────┘
                               │ HTTP / CORS (allowedOriginPatterns: *)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│           Local Machine (User's Laptop / Workstation)       │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Spring Boot 3.3.4 (Java 21) Microservice on :8080  │   │
│   │  - CatalogApiController (/api/v1/catalog)           │   │
│   │  - FinancingApiController (/api/v1/financing)       │   │
│   │  - EnquiriesApiController (/api/v1/enquiries)       │   │
│   │  - Actuator (/actuator/health)                      │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │ Spring Data MongoDB Driver   │
│                              ▼                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  MongoDB Database (carguru_db on :27017)            │   │
│   │  - Collections: financing_applications, enquiries... │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component & File Mapping

1. **`frontend/src/api/client.ts`**:
   - Update `baseUrl` initialization to read from `localStorage.getItem('carguru_backend_api_url')` before falling back to `VITE_API_URL` or default `http://localhost:8080`.
   - Add `setBaseUrl(url: string)` method that normalizes the URL and persists it to `localStorage`.
   - Update `checkBackendStatus(url?: string)` to test `/actuator/health` and `/api/v1/catalog/vehicles/lookup` directly via browser fetch, reporting latency and status.
2. **`frontend/src/components/AdminPortal.tsx`**:
   - Add the Backend Connection Configuration modal with quick presets (`http://localhost:8080`, `/api/v1`, Custom).
   - Add a connection test button with live response ping.
   - Display active endpoint and engine metadata.
3. **Verification**:
   - Verify that calls to `/catalog/vehicles/lookup`, `/financing/calculator`, and `/financing/applications` successfully route to `http://localhost:8080` when reachable, with seamless fallback if offline.
