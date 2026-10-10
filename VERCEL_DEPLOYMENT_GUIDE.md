# Deploying SYLVRA to Vercel (with Database & Backend)

This guide walks you through deploying **SYLVRA** to **Vercel** with a live database and fully functional backend services.

---

## 1. Why a Decoupled Architecture?

| Component | Technology | Best Platform | Why? |
|---|---|---|---|
| **Frontend** | Vite + React + Tailwind + Three.js + 1080p Video Loops | **Vercel** | Global Edge CDN, sub-second TTFB, fast static asset & video delivery, automatic SSL, CI/CD from GitHub. |
| **Backend** | Django 5 + Daphne ASGI + Channels | **Railway** or **Render** | Persistent ASGI server required for real-time WebSocket streams (`/ws/map/`). Vercel serverless functions time out and do not support persistent WebSockets. |
| **Database** | PostgreSQL | **Neon** or **Supabase** | Free serverless PostgreSQL with connection pooling, automatic backups, and high availability. |

---

## 2. Step 1: Create Free Hosted PostgreSQL (2 mins)

1. Sign up for free at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com).
2. Create a project named `green-grid`.
3. Copy your connection string (`DATABASE_URL`). It looks like:
   ```
   postgresql://greengrid_user:yourpassword@ep-green-grid-12345.us-east-2.aws.neon.tech/greengrid?sslmode=require
   ```

---

## 3. Step 2: Deploy the Backend (Railway or Render)

Because your code is already in GitHub (`https://github.com/cpn-singh/Green-Grid.git`), deployment is automatic:

### Option A: Railway (Recommended — Best WebSocket Support)
1. Go to [railway.app](https://railway.app) and click **"New Project"** → **"Deploy from GitHub repo"**.
2. Select `Green-Grid`.
3. In **Settings** → **Root Directory**, set it to: `/backend`
4. In **Variables**, add:
   - `DATABASE_URL`: *(your Neon or Supabase PostgreSQL connection string)*
   - `SECRET_KEY`: `your-secure-production-secret-key-2026`
   - `ALLOWED_HOSTS`: `*`
   - `CORS_ALLOW_ALL_ORIGINS`: `True`
5. Railway will automatically detect the [`backend/Dockerfile`](file:///C:/Users/admin/Desktop/Green%20Grid/backend/Dockerfile) or [`backend/Procfile`](file:///C:/Users/admin/Desktop/Green%20Grid/backend/Procfile) and launch Daphne ASGI on port 8000.
6. Generate a public domain under **Settings** → **Networking** (e.g., `https://greengrid-backend.up.railway.app`).

### Option B: Render
1. Go to [render.com](https://render.com) and click **"New Web Service"**.
2. Connect your GitHub repository.
3. Configure:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3` or `Docker`
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate --noinput && python manage.py collectstatic --noinput`
   - **Start Command**: `daphne -b 0.0.0.0 -p $PORT greengrid.asgi:application`
4. Add the same environment variables (`DATABASE_URL`, `SECRET_KEY`, `ALLOWED_HOSTS=*`, `CORS_ALLOW_ALL_ORIGINS=True`).

### Run Initial Seed Data:
Once the backend is deployed, run the seeder once via the Railway/Render web terminal:
```bash
python seed_all_infrastructure.py
```
*(Populates 16 renewable developers, 17 hyperscale data centers, and 10 transmission match routes).*

---

## 4. Step 3: Deploy the Frontend to Vercel

1. Log in to [vercel.com](https://vercel.com).
2. Click **"Add New..."** → **"Project"**.
3. Import your GitHub repository: `cpn-singh/Green-Grid`.
4. Configure the Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and choose `frontend`
   - **Build Command**: `npm run build` *(default)*
   - **Output Directory**: `dist` *(default)*
   - **Install Command**: `npm install` *(default)*
5. Expand **Environment Variables** and add:
   | Key | Value | Description |
   |---|---|---|
   | `VITE_API_BASE_URL` | `https://your-backend.up.railway.app/api` | Points all REST calls to your hosted backend |
   | `VITE_WS_URL` | `wss://your-backend.up.railway.app/ws/map/` | Points live map real-time tickers to your hosted ASGI backend |

6. Click **Deploy**!

---

## 5. What Was Prepared in Your Codebase

1. [`frontend/vercel.json`](file:///C:/Users/admin/Desktop/Green%20Grid/frontend/vercel.json):
   - Configured SPA rewrites (`"source": "/(.*)", "destination": "/index.html"`) so page refreshes on `/map`, `/sources`, etc. do not return 404s.
   - Configured high-performance caching and `Accept-Ranges: bytes` headers for 1080p background video loops.

2. [`frontend/src/pages/Map/LiveMapDashboard.jsx`](file:///C:/Users/admin/Desktop/Green%20Grid/frontend/src/pages/Map/LiveMapDashboard.jsx):
   - Configured dynamic WebSocket resolution using `import.meta.env.VITE_WS_URL` with fallback to `window.location.host`.

3. [`backend/requirements.txt`](file:///C:/Users/admin/Desktop/Green%20Grid/backend/requirements.txt):
   - Added `psycopg2-binary` and `dj-database-url` for instant PostgreSQL connectivity.

4. [`backend/greengrid/settings.py`](file:///C:/Users/admin/Desktop/Green%20Grid/backend/greengrid/settings.py):
   - Configured automatic `DATABASE_URL` parsing with fallback to SQLite for local development.

5. [`backend/Procfile`](file:///C:/Users/admin/Desktop/Green%20Grid/backend/Procfile):
   - Daphne ASGI startup command and automatic database migration & seed hook.
