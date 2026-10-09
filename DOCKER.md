# Green Grid — Docker Deployment Guide

The Green Grid platform is fully containerized using **Docker** and **Docker Compose**. It runs a production-grade multi-stage architecture with Daphne (ASGI Django) for the backend and Nginx for the frontend.

---

## Architecture Overview

```
[ Browser / Client ]
        │
        ▼ (Port 80)
┌────────────────────────────────────────────────────────┐
│               greengrid-frontend (Nginx)               │
│  - Serves compiled Vite SPA (HTML, CSS, JS, Three.js)  │
│  - Optimized byte-range streaming for 1080p MP4 videos │
│  - Proxies /api/ and /admin/ to http://backend:8000    │
│  - Proxies /ws/ WebSocket connections for live map     │
└───────────────────────┬────────────────────────────────┘
                        │ internal Docker network
                        ▼
┌────────────────────────────────────────────────────────┐
│               greengrid-backend (Daphne)               │
│  - Django 5 + Channels ASGI application                │
│  - Auto-runs migrations on startup                     │
│  - Auto-seeds clean databases with 16+ renewable IPPs  │
│  - Persists SQLite data in docker volume `backend_data`│
└────────────────────────────────────────────────────────┘
```

---

## Quick Start Commands

### 1. Start all services in the background:
```bash
docker compose up -d
```

### 2. View running containers and health status:
```bash
docker compose ps
```

### 3. View live logs:
```bash
# Follow logs for all containers
docker compose logs -f

# Follow logs for specific container
docker compose logs -f backend
docker compose logs -f frontend
```

### 4. Rebuild images after code changes:
```bash
docker compose up --build -d
```

### 5. Stop all services:
```bash
docker compose down
```

---

## Service URLs

| Service | Host URL | Description |
|---|---|---|
| **Web Application** | [http://localhost/](http://localhost/) | Main Landing, 3D Logo, Earth Descent, Video Loops, DC Builder |
| **API Endpoints** | [http://localhost/api/](http://localhost/api/) | Reverse-proxied through Nginx |
| **Direct Backend** | [http://localhost:8000/api/](http://localhost:8000/api/) | Direct Daphne ASGI port |
| **Live Stats API** | [http://localhost/api/map/stats/](http://localhost/api/map/stats/) | Real-time map & grid statistics |
| **Django Admin** | [http://localhost/admin/](http://localhost/admin/) | Admin management portal |
