# How FactoryGuard Works with supOS After Deployment

## Quick Answer

When you push to GitHub → Vercel deploys the **frontend only**.

The **backend services** (including supOS sync) need to be deployed separately to **Render** or **Railway**.

---

## The Flow

### 1. You Push to GitHub
```bash
git push origin main
```

### 2. Vercel Auto-Deploys Frontend
- ✅ Next.js UI
- ✅ Dashboard pages
- ❌ Backend services (NOT deployed)

### 3. You Deploy Backend to Render
- ✅ WebSocket server
- ✅ MQTT listener
- ✅ AI predictor
- ✅ **supOS MQTT sync** (publishes data every 10 seconds)
- ✅ **supOS DB sync** (writes to databases every 15 seconds)

### 4. Data Flows to supOS
```
Render Backend (your services)
    ↓ MQTT Publish
HiveMQ Cloud Broker
    ↓ MQTT Subscribe
supOS NodeRED SourceFlow
    ↓ Process & Store
PostgreSQL + TimescaleDB
```

### 5. Alerts Flow Back
```
supOS EventFlow (threshold check)
    ↓ MQTT Publish
HiveMQ Cloud
    ↓ MQTT Subscribe
Render Backend
    ↓ WebSocket
Vercel Frontend (user sees alerts)
```

---

## What You Need to Do

### Step 1: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Set start command: `npm run server:prod`
5. Add environment variables (MQTT, Supabase, etc.)
6. Deploy

### Step 2: Update Vercel

1. Go to Vercel dashboard
2. Add environment variable:
   ```
   NEXT_PUBLIC_WS_URL=https://your-backend.onrender.com
   ```
3. Redeploy

### Step 3: Verify

1. Check Render logs → should see "Connected to MQTT"
2. Check supOS debug panel → should see messages every 10 seconds
3. Done! ✅

---

## Why This Works

**Vercel** = Serverless (can't run background processes)  
**Render** = Always-on server (can run MQTT sync 24/7)

The backend on Render continuously publishes to MQTT, and supOS NodeRED subscribes to those topics.

---

## See Full Guide

Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete step-by-step instructions.

---

## TL;DR

1. Push to GitHub → Vercel deploys frontend ✅
2. Deploy backend to Render manually (one-time setup)
3. Backend publishes to MQTT → supOS receives data ✅
4. Everything works together! 🎉
