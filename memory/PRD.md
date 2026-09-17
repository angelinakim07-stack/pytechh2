# PyTech Digital — PRD & Deployment Notes

## Problem statement
User provided a "Hardened Deployment Plan" and the actual `pytech-website-main.zip` bundle with the
instruction "deploy here". Goal: get the bundle running and verified in the Emergent preview
environment, applying the plan's hardening (env-based config, no hardcoded localhost, explicit CORS,
health checks, SPA/deep-link fallback, fail-loud on missing env).

## What the bundle actually is
- **Next.js 15 (App Router)** unified full-stack app — NOT the CRA+FastAPI scaffold.
- MongoDB via `mongodb` driver. AI triage chatbot ("Ada") via `emergentintegrations` npm (Gemini).
- Marketing site for "PyTech Digital" (Gurugram IT/growth agency): Build/Brand/Market/Automate.
- Heavy programmatic SEO: services, service×location, locations, case-studies, resources, sitemap,
  robots, opengraph, JSON-LD schema. 3D WebGL hero (three / @react-three/fiber).
- API is a single catch-all route `app/api/[[...path]]/route.js`: `/api/`, `/api/services`,
  `/api/leads` (GET admin / POST public), `/api/chat` (POST triage + lead scoring, GET history),
  `/api/chat/sessions` (admin), `/api/admin/login`.

## Environment adaptation (IMPORTANT)
This pod is a **fastapi_react_mongo** base image, but the app is Next.js. Ingress routes `/api/*` to
:8001 and everything else to :3000; supervisor is read-only (`frontend`=`yarn start` in
`/app/frontend`, `backend`=`uvicorn server:app` on :8001).
- Next.js app placed in `/app/frontend`; its `start` script set to run `next dev` on :3000.
- `/app/backend/server.py` rewritten as a **reverse proxy** forwarding `/api/*` → `http://127.0.0.1:3000/api/*`
  (long timeout for Gemini). This bridges the ingress /api routing to the Next API handlers.
- Server env in `/app/frontend/.env.local` (gitignored). Backend needs `httpx` (added to requirements.txt).

## Hardening applied (from the plan)
- No hardcoded localhost in app code — all client fetches are relative `/api/*`.
- Secrets only in env (`.env.local`), not committed. ADMIN_PASSWORD + EMERGENT_LLM_KEY injected.
- Deep-link/unknown routes return Next's 404 (no broken SPA refresh).
- CORS handled in the API route via `CORS_ORIGINS` env.
- AI route fails loud (`500 AI is not configured`) if `EMERGENT_LLM_KEY` missing.

## Verified (2026-06 preview)
- Home + all key routes 200 (services, service/[slug], case-studies, locations, ai-automation,
  resources, support, admin, sitemap.xml, robots.txt); unknown route → 404.
- API: `/api/` live, `/api/services` OK, `/api/leads` POST writes to Mongo, `/api/admin/login`
  (correct=200 / wrong=401), `/api/chat` returns a Gemini response and scores the lead.
- Hero renders (headline, CTAs, stats, WebGL globe, ticker, chat FABs) on localhost AND external URL.

## Backlog / next
- P1: Run full E2E (lead form multi-step, chatbot UI, admin dashboard tiers).
- P2: For production Emergent deploy, prefer a native Next.js target (build+`next start`) rather than
  the preview proxy; set real `CORS_ORIGINS`, strong `ADMIN_PASSWORD`, GA/GSC env if desired.
- P2: Point `COMPANY.url` / metadataBase to the real production domain before go-live.
