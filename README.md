# Notes Task API

Express.js based API for notes management.

## Tech Stack

- Node.js + TypeScript
- Express 4
- PostgreSQL
- TypeORM
- Joi
- Swagger (OpenAPI)
- pino / pino-http
- Jest + Supertest

## API Base URL

- `http://localhost:3000/api`

## API Documentation

- Swagger UI: `http://localhost:3000/api-docs`

### Endpoints

1. `POST /api/notes`
- Request:
```json
{
  "title": "Meeting notes",
  "content": "Discuss roadmap and milestones"
}
```
- Success `201`:
```json
{
  "id": "11111111-1111-4111-8111-111111111111",
  "title": "Meeting notes",
  "content": "Discuss roadmap and milestones",
  "createdAt": "2026-03-05T00:00:00.000Z",
  "updatedAt": "2026-03-05T00:00:00.000Z"
}
```

2. `GET /api/notes`
- Success `200`:
```json
{
  "data": [
    {
      "id": "11111111-1111-4111-8111-111111111111",
      "title": "Meeting notes",
      "content": "Discuss roadmap and milestones",
      "createdAt": "2026-03-05T00:00:00.000Z",
      "updatedAt": "2026-03-05T00:00:00.000Z"
    }
  ],
  "meta": {
    "hasNextPage": false,
    "nextCursor": null
  }
}
```

3. `GET /api/notes/:id`
- Success `200`: returns note object
- Not found `404`:
```json
{
  "status": "error",
  "message": "Note not found",
  "requestId": "..."
}
```

4. `PUT /api/notes/:id`
- Request:
```json
{
  "title": "Updated title"
}
```
- Success `200`: returns updated note

5. `DELETE /api/notes/:id`
- Success `204` (empty body)
- Not found `404`: same error shape as above

## Error Response Format

```json
{
  "status": "error",
  "message": "Validation error",
  "details": ["\"title\" is required"],
  "requestId": "..."
}
```

## Project Structure

```text
src/
├── app/
│   ├── health/
│   ├── note/
│   ├── app.ts
│   └── router/
├── common/
│   ├── errors/
│   ├── middleware/
│   ├── logger/
│   └── services/
├── config/
├── database/
│   ├── migrations/
│   ├── seed/
│   └── data-source.ts
└── index.ts
```

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create env file:
```bash
cp .env.example .env
```

3. Configure `.env`:
```env
NODE_ENV=development
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=notes_task_app
DB_SSL=false
DB_LOGGING=false
```

4. Run migrations:
```bash
pnpm migration:run
```

5. Run app:
```bash
pnpm dev
```

## Scripts

- `pnpm dev` - run in dev mode
- `pnpm build` - compile TypeScript
- `pnpm start` - run compiled build
- `pnpm test` - run unit + integration tests
- `pnpm test:watch` - test watch mode
- `pnpm seed` - run TypeORM seeders

## Design Decisions and Assumptions

- API is namespaced under `/api`.
- `GET /api/notes` uses cursor pagination (`data` + `meta`) for scalability.
- `PUT /api/notes/:id` supports partial updates in current implementation.
- Request validation is handled at the route boundary with Joi.
- Service layer is responsible for business errors (`404` on missing note).

## Testing Summary

- Unit tests:
  - `src/app/note/__tests__/note.service.spec.ts`
  - `src/app/note/__tests__/note.controller.spec.ts`
- Integration tests:
  - `tests/notes.spec.ts`
