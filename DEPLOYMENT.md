# 🚀 DocFin AI — Production Deployment & Operations Guide

This guide outlines how to deploy and scale DocFin AI across leading cloud platforms (**Vercel**, **Docker / Cloud Run / AWS ECS**, **Railway**, **Render**, or **Self-Hosted Kubernetes**).

---

## 📋 Table of Contents
1. [One-Click Vercel Deployment](#1-one-click-vercel-deployment)
2. [Docker & Containerized Deployment](#2-docker--containerized-deployment)
3. [Cloud Run / AWS ECS / Railway / Render](#3-cloud-run--aws-ecs--railway--render)
4. [Production Environment Variables Checklist](#4-production-environment-variables-checklist)
5. [Database & Storage Setup (Supabase)](#5-database--storage-setup-supabase)
6. [Observability & Health Checks](#6-observability--health-checks)
7. [Security & Hardening Checklist](#7-security--hardening-checklist)

---

## 1. One-Click Vercel Deployment

DocFin AI is fully optimized for Next.js App Router on Vercel:

1. **Import Git Repository**:
   - Push your codebase to GitHub, GitLab, or Bitbucket.
   - Go to [vercel.com/new](https://vercel.com/new) and select your repository.

2. **Configure Environment Variables**:
   In the Vercel Project Settings $\rightarrow$ Environment Variables, configure:
   ```env
   GEMINI_API_KEY=AIzaSy...
   NEXT_PUBLIC_SUPABASE_URL=https://your-app.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AXi3...
   ```

3. **Deploy**:
   - Framework Preset: **Next.js**
   - Node.js Version: **20.x**
   - Click **Deploy**. Vercel will automatically build and deploy the application globally on Edge/Serverless infrastructure.

---

## 2. Docker & Containerized Deployment

DocFin AI comes with a multi-stage `Dockerfile` and `output: 'standalone'` configuration.

### Local Container Build & Run:
```bash
# Build the Docker image
docker build -t docfin-ai:latest .

# Run container on port 3000
docker run -p 3000:3000 --env-file .env.local docfin-ai:latest
```

### Docker Compose Orchestration:
```bash
docker compose up -d
```

---

## 3. Cloud Run / AWS ECS / Railway / Render

### Google Cloud Run:
```bash
# Authenticate & build image with Google Cloud Build
gcloud builds submit --tag gcr.io/[PROJECT_ID]/docfin-ai

# Deploy to Cloud Run with 1GB RAM & 1 vCPU
gcloud run deploy docfin-ai \
  --image gcr.io/[PROJECT_ID]/docfin-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars GEMINI_API_KEY=AIzaSy...,NEXT_PUBLIC_SUPABASE_URL=...
```

### Railway / Render:
1. Connect your GitHub repository.
2. Select **Dockerfile** as the build mechanism (or Next.js native runner).
3. Set environment variables in the dashboard.
4. Set health check path to `/api/health`.

---

## 4. Production Environment Variables Checklist

| Variable | Description | Required | Source |
| :--- | :--- | :---: | :--- |
| `GEMINI_API_KEY` | Google Gemini 2.0 / 2.5 API Key | **Yes** | [Google AI Studio](https://aistudio.google.com/) |
| `GEMINI_MCP_SERVER_URL` | Standalone MCP Server URL (in-process fallback if empty) | Optional | Local / Container |
| `GRAPH_RAG_ENABLED` | Set `'true'` for Neo4j GraphRAG (memory fallback if `'false'`) | Optional | Self-Hosted / Neo4j Aura |
| `NEO4J_URI` | Neo4j Connection URI (e.g. `neo4j+s://...`) | Optional | [Neo4j Aura Console](https://console.neo4j.io/) |
| `NEO4J_USERNAME` | Neo4j Username (default: `neo4j`) | Optional | Neo4j Console |
| `NEO4J_PASSWORD` | Neo4j Password | Optional | Neo4j Console |
| `QDRANT_URL` | Qdrant Vector Cloud Cluster URL | Optional | [Qdrant Cloud](https://cloud.qdrant.io/) |
| `QDRANT_API_KEY` | Qdrant Cluster API Key | Optional | Qdrant Cloud |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Optional | [Supabase Console](https://supabase.com/dashboard) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Optional | Supabase Project Settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Admin Service Key | Optional | Supabase Project Settings |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | Optional | [Upstash Console](https://console.upstash.com/) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST Token | Optional | Upstash Console |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Optional | [Google Cloud Console](https://console.cloud.google.com/) |

---

## 5. Database & Storage Setup (Supabase)

DocFin AI uses Supabase PostgreSQL for authentication, document history, and vector embeddings.

Execute this SQL schema in your Supabase SQL Editor:

```sql
-- 1. Create Audits Table
CREATE TABLE IF NOT EXISTS public.document_audits (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  detected_domain TEXT NOT NULL,
  summary JSONB NOT NULL,
  metrics JSONB NOT NULL,
  tracked_numbers JSONB,
  tracked_dates JSONB,
  tracked_risks JSONB,
  extracted_tables JSONB,
  extracted_entities JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.document_audits ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Users can view their own audits
CREATE POLICY "Users can manage own document audits"
  ON public.document_audits
  FOR ALL
  USING (auth.uid() = user_id);
```

---

## 6. Observability & Health Checks

- **Health Endpoint**: `GET /api/health`
  - Returns `200 OK` when all critical services are operational.
  - Returns memory consumption (`rssMb`, `heapUsedMb`), uptime, and latency breakdown for Gemini, Supabase, Redis, and Qdrant.
- **Synthetics & Uptime Monitoring**:
  - Configure Datadog, BetterUptime, Pingdom, or AWS CloudWatch to poll `https://your-domain.com/api/health` every 60 seconds.

---

## 7. Security & Hardening Checklist

- [x] **Next.js Standalone Build**: Enabled in `next.config.ts`.
- [x] **Security Headers**: HSTS, CSP, X-Frame-Options (`SAMEORIGIN`), X-Content-Type-Options (`nosniff`), Referrer-Policy configured.
- [x] **Unprivileged Docker User**: Container runs as user `nextjs` (UID 1001), not root.
- [x] **Hydration & Error Boundaries**: Implemented `not-found.tsx`, `error.tsx`, and `global-error.tsx`.
- [x] **Automated CI/CD**: GitHub Actions workflow (`deploy.yml`) tests TypeScript compilation, ESLint, universal pipeline tests, and Next.js production build.
