# NetPulse — Distributed Network Monitoring & Incident Diagnosis Platform

A distributed network monitoring platform that runs scheduled DNS, TCP, TLS, and HTTP health checks across a pool of concurrent workers, classifies failures by root cause, tracks incident lifecycles automatically, and maps dependencies between services to flag downstream impact.

**Live demo:** https://network-monitoring-incident-diagnos.vercel.app


---

## What it does

Most uptime tools tell you "it's down." NetPulse tells you *why*, and *what else might break because of it*.

- **Schedule checks** on any target (domain/IP) at a custom interval, via DNS, TCP, TLS, or HTTP
- **Diagnose failures precisely** by walking the DNS → TCP → TLS → HTTP pipeline and stopping at the exact layer that failed
- **Detect incidents automatically** — 3 consecutive failures opens an incident; the next success resolves it and records downtime
- **Map dependencies** between services, so when a monitor goes down, anything that depends on it is flagged as potentially affected
- **Track metrics** — uptime %, average response time, and P95 latency per monitor

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Next.js   │─────▶│   Express    │─────▶│    PostgreSQL    │
│  (Vercel)   │ REST │  API Server  │      │  (monitors,      │
└─────────────┘      │  (Render)    │      │   results,       │
                      └──────┬───────┘      │   incidents)     │
                             │              └─────────────────┘
                             │ enqueues jobs
                             ▼
                      ┌──────────────┐
                      │    Redis     │
                      │  (BullMQ)    │
                      └──────┬───────┘
                             │ repeatable jobs
                             ▼
                      ┌──────────────┐
                      │  BullMQ      │
                      │  Worker      │───▶  DNS → TCP → TLS → HTTP
                      │ (concurrency │      diagnosis pipeline
                      │   = 10)      │
                      └──────────────┘
```

Every monitor gets a **repeatable BullMQ job** scheduled at its own interval. A worker pool (concurrency-limited, not one check at a time) picks up due jobs, runs them through the diagnosis pipeline, and writes results back to Postgres — where the API and incident/topology logic pick them up on the next read.

## The diagnosis pipeline

Rather than a single "is it up" ping, each check walks through layers in order and stops at the first failure, so the failure type tells you exactly where the problem is:

1. **DNS** — can the hostname even resolve? → `DNS_FAILURE`
2. **TCP** — can we open a socket to the host:port? → `CONNECTION_FAILURE`
3. **TLS** — does the handshake succeed, is the cert valid? → `TLS_FAILURE`
4. **HTTP** — does the request return a healthy status in reasonable time? → `HTTP_FAILURE`, `TIMEOUT`, or `LATENCY_DEGRADED` (successful but slow)

This distinction matters: a DNS failure and an HTTP 500 look identical from the outside ("site is down"), but they're completely different problems with different fixes.

## Incident lifecycle

A single failed check doesn't mean much — networks blip. NetPulse only opens an incident after **3 consecutive failures**, and automatically resolves it (with downtime duration calculated) the moment a check succeeds again. This avoids alert fatigue from transient flakiness while still catching real outages fast.

## Dependency-aware topology

Services aren't independent — a database going down can take an API and three downstream apps with it. NetPulse lets you define parent/child relationships between monitors. When a parent monitor has an ongoing incident, every dependent child is surfaced as **potentially affected**, even if its own checks are still passing (since the real-world effect often lags behind the root cause).

## Tech stack

**Backend**
- Node.js + Express
- PostgreSQL + Sequelize (ORM)
- Redis + BullMQ (job scheduling, concurrency-controlled worker pool)
- Docker (containerized deployment)

**Frontend**
- Next.js (App Router)
- Feature-based architecture (`features/<domain>/{hooks,services,components}`)
- Plain CSS, custom retro/pixel-arcade theme

**Deployment**
- Frontend → Vercel
- Backend + Worker → Render (Docker)
- Database → Render PostgreSQL
- Queue → Render Key-Value (Redis-compatible)
- Keepalive → UptimeRobot (pings `/health` every 5 min)

## Project structure

```
netpulse/
├── backend/
│   ├── src/
│   │   ├── config/        # DB + Redis connections
│   │   ├── models/        # Monitor, CheckResult, Incident, Dependency
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # Express routes
│   │   ├── services/       # DNS/TCP/TLS/HTTP checks, diagnosis, incidents, topology, metrics
│   │   ├── queues/         # BullMQ queue + worker
│   │   ├── app.js
│   │   └── server.js
│   └── Dockerfile
└── frontend/
    └── src/
        ├── app/            # Next.js routes (thin pages)
        ├── features/       # monitors, incidents, topology, dashboard
        │   └── <feature>/
        │       ├── hooks/
        │       ├── services/
        │       └── components/
        └── common/
            └── lib/        # shared axios client
```

## API reference

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/monitors` | Create a monitor (auto-schedules its recurring check) |
| `GET` | `/api/monitors` | List all monitors |
| `GET` | `/api/monitors/:id` | Get a single monitor |
| `PUT` | `/api/monitors/:id` | Update a monitor (re-schedules if interval changes) |
| `DELETE` | `/api/monitors/:id` | Delete a monitor (removes its scheduled job) |
| `GET` | `/api/incidents` | List all incidents (ongoing + resolved) |
| `GET` | `/api/metrics/:id` | Uptime %, avg response time, P95 for one monitor |
| `GET` | `/api/metrics/system` | Queue-level throughput and job counts |
| `POST` | `/api/dependencies` | Link two monitors (parent/child) |
| `GET` | `/api/dependencies` | List all dependency links |
| `DELETE` | `/api/dependencies/:id` | Remove a dependency link |
| `GET` | `/api/dependencies/topology/status` | Down monitors + their potentially affected dependents |

## Running locally

**Prerequisites:** Node.js, Docker Desktop

```bash
# clone the repo
git clone <your-repo-url>
cd netpulse

# start Postgres + Redis
docker compose up -d

# backend
cd backend
npm install
cp .env.example .env   # fill in DB/Redis values
npm run dev

# frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```

Visit `http://localhost:3000`.

## What I'd build next

- Raw check-history view per monitor (currently only aggregated metrics are shown)
- Multi-level dependency chains (currently one level deep)
- Alerting (email/Slack) when an incident opens
- WebSocket-based live updates instead of manual refresh