# Backend Startup Prompts (Express + TypeScript + Prisma)

This file contains two ready-to-use prompts:

- Prompt A: Generate a new backend startup template (industry standard, optimized).
- Prompt B: Optimize an existing backend repo to industry standard.

Both prompts keep the current stack: Express 5, TypeScript, Prisma, PostgreSQL, Zod, JWT, bcrypt, multer/sharp.

---

## Prompt A: Backend Startup Template (Detailed)

You are a senior backend architect. Build a production-ready backend startup template for an ERP system.

### Context

- Runtime: Node.js (ESM)
- Language: TypeScript
- Framework: Express 5
- ORM: Prisma
- Database: PostgreSQL
- Validation: Zod
- Auth: JWT + bcrypt
- File uploads: multer + sharp
- Style: modular, scalable, and optimized for multi-tenant ERP workloads

### Recommended Scale Technologies (Keep Core Stack)

- Cache and rate limiting store: Redis
- Background jobs and queues: BullMQ (Redis-backed)
- Observability: OpenTelemetry + Prometheus + Grafana
- Error monitoring: Sentry (or similar)
- Centralized logs: Loki or ELK stack
- Database pooling: PgBouncer
- API gateway/reverse proxy: Nginx or Traefik
- Optional streaming/event bus: Kafka or NATS for async workflows

### Requirements

1. Architecture and Structure

- Provide a clean, layered architecture with clear separation of concerns:
  - routes -> controllers -> services -> repositories -> db
  - shared middlewares, validators, utils, and error handling
- Use a feature/module layout under src/app/modules.
- Keep modules independent with their own routes, schema/validation, controller, service, repository, and DTOs.

2. Core Features

- Robust config system with env validation (dotenv-safe or zod-based env schema).
- Centralized error handling with typed AppError and consistent response format.
- Request validation middleware using Zod.
- Authentication and authorization:
  - JWT access + refresh tokens
  - role-based authorization (RBAC)
  - request user context injection
- Logging and observability:
  - structured logger (pino or winston)
  - request id middleware
  - request/response timing
  - OpenTelemetry tracing and metrics export
- Security hardening:
  - helmet
  - express-rate-limit
  - CORS configuration
  - body size limits
- Performance and scalability:
  - pagination defaults
  - Prisma query helpers
  - transaction patterns
  - caching layer (Redis) for hot reads
  - database pooling (PgBouncer) guidance
- Background jobs:
  - BullMQ or similar for async tasks (email, image processing)
- Health checks:
  - /health and /ready
- Graceful shutdown handling

3. Database

- Prisma schema with multi-tenant models and proper indexes.
- Enforce best practices: timestamps, soft delete where needed, and constraints.
- Include migration workflow and seed scripts.

4. Tooling

- ESLint + Prettier configs.
- tsx for dev, tsup or tsc for build.
- Scripts for dev, build, test, lint, format, prisma.

5. Testing

- Setup unit and integration testing with Vitest or Jest + Supertest.
- Provide example tests for one module.

6. Documentation

- README with setup, scripts, and environment variables.
- docs/ with:
  - architecture overview
  - API documentation (OpenAPI or Swagger)
  - database schema overview
  - deployment and infrastructure notes
  - security checklist
  - observability and scaling guide (metrics, tracing, logging, caching, queues)

### Output

Produce the full template with:

- Project folder structure
- All essential source files
- Prisma schema and migration guidance
- Configs and scripts
- Documentation files
- Example module (auth or products) end-to-end

Constraints:

- Keep Express + TypeScript + Prisma (no framework switch).
- Favor clarity and maintainability.
- Use ASCII only.

---

## Prompt B: Optimize Existing Backend Repo to Industry Standard

You are a senior backend engineer and auditor. I have an existing Express + TypeScript + Prisma ERP backend repo. Your task is to optimize it to industry standard without changing the core stack.

### Constraints

- Do not migrate to a new framework.
- Keep existing modules and API surface unless changes are required for correctness, security, or performance.
- Prefer minimal, well-structured diffs.

### Goals

1. Audit and classify issues by severity (security, performance, scalability, maintainability).
2. Propose a concrete, prioritized plan with quick wins and longer-term improvements.
3. Implement changes directly in code where safe and high impact.
4. Update documentation to reflect the optimized setup.

### Must-Have Improvements

- Security: helmet, rate limiting, body size limits, secure CORS, JWT expiry validation, refresh token rotation, password policy.
- Observability: structured logging, request IDs, basic metrics, OpenTelemetry traces.
- Performance: Prisma query optimizations, pagination defaults, indexing recommendations, caching where appropriate.
- Reliability: graceful shutdown, health checks, error normalization.
- Architecture: introduce service and repository layers if missing; remove code duplication in auth and validation.
- Testing: add baseline integration tests and CI-ready test scripts.

### Scale Tech Options to Add (If Not Present)

- Redis for cache and rate-limit store
- BullMQ for background jobs
- OpenTelemetry + Prometheus + Grafana for metrics and tracing
- Sentry for error monitoring
- Nginx or Traefik for API gateway and TLS termination
- PgBouncer for database connection pooling
- Kafka or NATS for event-driven workflows

### Required Output

- A brief audit summary with issue list and severity.
- A step-by-step plan (grouped: immediate, short-term, medium-term).
- The actual code changes and new files.
- Updated docs: README and docs/ for architecture, API, database, deployment.

### Notes

- Keep alignment with existing config and Prisma schema.
- Use ASCII only.
- Ask clarifying questions only if a decision blocks progress.
