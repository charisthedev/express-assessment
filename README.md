# Backend Boilerplate (Service-Oriented Foundation)

Production-ready backend foundation using Node.js, TypeScript, Express, PostgreSQL, TypeORM, Joi, Swagger (OpenAPI 3), dotenv, and pino.

## Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL
- TypeORM
- Joi validation
- Swagger (`swagger-jsdoc` + `swagger-ui-express`)
- dotenv
- pino + pino-http
- CORS
- UUID support

## Project Structure

```text
src/
├── app/
│   ├── app.ts
│   ├── application.bootstrap.ts
│   ├── http.server.ts
│   ├── router/
│   │   ├── AppRouter.ts
│   │   └── index.ts
│   └── health/
│       ├── entities/
│       │   └── HealthStatusEntity.ts
│       ├── health.controller.ts
│       ├── health.service.ts
│       └── health.repository.ts
├── common/
│   ├── errors/
│   │   └── AppError.ts
│   ├── logger/
│   │   ├── ILogger.ts
│   │   └── logger.ts
│   ├── middleware/
│   │   ├── error.middleware.ts
│   │   ├── request-id.middleware.ts
│   │   └── validate.middleware.ts
│   ├── swagger/
│   │   └── swagger.ts
│   └── types/
│       └── express.d.ts
├── database/
│   ├── data-source.ts
│   ├── seed.ts
│   ├── migrations/
│   └── seed/
├── config/
│   └── env.ts
└── index.ts
```

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your PostgreSQL credentials.

4. Run development server:

```bash
pnpm dev
```

## Build and Run

Build:

```bash
pnpm build
```

Run compiled app:

```bash
pnpm start
```

## Migration Commands

Create empty migration:

```bash
pnpm migration:create
```

Generate migration from entity changes:

```bash
pnpm migration:generate
```

Run migrations:

```bash
pnpm migration:run
```

Revert last migration:

```bash
pnpm migration:revert
```

## Seed Command

Place SQL seed files in `src/database/seed` (for example: `001-initial.sql`, `002-demo-data.sql`).
Files are executed in filename order inside a single transaction.

Run seeds:

```bash
pnpm seed
```

## Swagger

- Swagger UI URL: `http://localhost:3000/api-docs`
- Health endpoint: `GET /health`

## Architecture Notes

This boilerplate follows an OOP-oriented service architecture with clear separation:

- `app/*`: application layer (controllers, services, repositories, router composition, bootstrap).
- `common/*`: cross-cutting concerns (middleware, logger abstraction, errors, swagger, request typing).
- `database/*`: data source, migrations, and seed runner.
- `config/*`: environment loading and validation.

The current setup intentionally includes only a system health module, with no business domain CRUD modules yet.

## Logging Notes

- Uses `pino` for structured logging.
- Uses `pino-http` for request lifecycle logs.
- In development (`NODE_ENV=development`): pretty logs via `pino-pretty`.
- In production: raw JSON logs suitable for log pipelines.
- `requestId` is attached to every request and included in error responses and request logs.
