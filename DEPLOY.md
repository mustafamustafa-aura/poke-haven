# Poke Haven — Production deployment

## Architecture

| Component | Host | Package |
|-----------|------|---------|
| Frontend (static SPA) | Netlify / Vercel | `@workspace/poke-haven` |
| API + orders DB | Railway / Render / Fly.io / VPS | `@workspace/api-server` |
| Database | Managed PostgreSQL | `DATABASE_URL` |

## 1. Database

Create a PostgreSQL database and set `DATABASE_URL`.

Push schema (once per environment):

```bash
DATABASE_URL="postgresql://..." pnpm --filter @workspace/db run push
```

## 2. API server

Deploy `artifacts/api-server` with:

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No (default `8080`) | Listen port |
| `DATABASE_URL` | Yes | Postgres connection string |
| `ADMIN_API_KEY` | Yes in production | Secret for `/admin` dashboard |
| `CORS_ORIGIN` | Recommended | e.g. `https://your-site.netlify.app` |
| `NODE_ENV` | Recommended | `production` |

Health check: `GET /api/healthz` (includes DB ping).

## 3. Frontend (Netlify)

1. Connect repo, build command from `netlify.toml`.
2. Set **Environment variables**:
   - `API_URL` = `https://your-api-host.com` (no trailing slash) — proxies `/api/*` to backend.
3. Open `/admin` and enter the same value as `ADMIN_API_KEY`.

Alternative: set `VITE_API_URL` at build time to call the API directly (skip Netlify API proxy).

## 4. Frontend (Vercel)

1. Set `outputDirectory` / build from `vercel.json`.
2. Replace `YOUR_API_HOST` in `vercel.json` rewrites with your API hostname, **or** use `VITE_API_URL`.
3. Configure `ADMIN_API_KEY` on the API host.

## 5. Local development

```bash
pnpm install
# Terminal 1 — API (requires DATABASE_URL)
pnpm run dev:api

# Terminal 2 — Frontend (proxies /api → http://127.0.0.1:8080)
pnpm run dev
```

Copy `.env.example` and fill in values as needed.
