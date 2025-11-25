# 🚀 Deployment Guide: FactoryGuard AI with supOS Integration

## Overview

FactoryGuard AI has **two parts** that need to be deployed separately:

1. **Frontend** (Next.js) → Deploy to **Vercel** ✅ (automatic on git push)
2. **Backend Services** → Deploy to **Render/Railway** ⚠️ (manual setup required)

---

## Why Two Deployments?

**Vercel** is serverless and doesn't support:
- Long-running WebSocket servers
- MQTT listeners
- Background processes (supOS sync services)

**Solution**: Deploy backend services to a platform that supports long-running Node.js processes.

---

## 🎯 Recommended Setup

```
┌─────────────────┐
│  Vercel         │  ← Frontend (Next.js UI)
│  (Frontend)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Render/Railway │  ← Backend Services
│  (Backend)      │     - WebSocket
│                 │     - MQTT Listener
│                 │     - AI Predictor
│                 │     - supOS MQTT Sync
│                 │     - supOS DB Sync
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  HiveMQ Cloud   │  ← MQTT Broker
│  (MQTT)         │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  supOS Instance │  ← NodeRED Flows
│  (Your Server)  │     - SourceFlow
│                 │     - EventFlow
└─────────────────┘
```

---

## 📋 Step-by-Step Deployment

### Part 1: Deploy Frontend to Vercel (Already Done)

When you push to GitHub, Vercel automatically deploys the frontend.

**Vercel Environment Variables** (add these in Vercel dashboard):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Backend URL (will be set after Part 2)
NEXT_PUBLIC_WS_URL=https://your-backend.onrender.com
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Part 2: Deploy Backend to Render (Recommended)

#### Option A: Render.com (Free Tier Available)

1. **Create Account**: Go to [render.com](https://render.com)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `factoryguard-ai` repo

3. **Configure Service**:
   ```
   Name: factoryguard-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Build Command: npm install
   Start Command: npm run server:prod
   ```

4. **Add Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=3000
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Hugging Face
   HUGGINGFACE_API_KEY=your_huggingface_key
   
   # supOS
   SUPOS_BASE_URL=https://supos-ce-instance2.supos.app:8443
   SUPOS_API_KEY=4174348a-9222-4e81-b33e-5d72d2fd7f1e
   
   # MQTT (HiveMQ Cloud)
   MQTT_BROKER_URL=1f3c070f03034f3890cb2c984bc76294.s1.eu.hivemq.cloud
   MQTT_BROKER_PORT=8883
   MQTT_USERNAME=factoryguard_client
   MQTT_PASSWORD=Dogbytec@r1
   MQTT_USE_TLS=true
   
   # supOS Databases
   SUPOS_POSTGRES_URL=postgres://postgres:postgres@supos-ce-instance2.supos.app:5432/postgres
   SUPOS_TSDB_URL=postgres://postgres:postgres@supos-ce-instance2.supos.app:2345/postgres
   ```

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy the URL (e.g., `https://factoryguard-backend.onrender.com`)

6. **Update Vercel**:
   - Go to Vercel dashboard
   - Add environment variables:
     ```env
     NEXT_PUBLIC_WS_URL=https://factoryguard-backend.onrender.com
     NEXT_PUBLIC_API_URL=https://factoryguard-backend.onrender.com
     ```
   - Redeploy frontend

#### Option B: Railway.app (Alternative)

1. **Create Account**: Go to [railway.app](https://railway.app)

2. **New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `factoryguard-ai`

3. **Configure**:
   ```
   Start Command: npm run server:prod
   ```

4. **Add Environment Variables** (same as Render above)

5. **Deploy** and copy the URL

#### Option C: Your Own Server (VPS)

If you have a VPS (DigitalOcean, AWS, etc.):

```bash
# SSH into your server
ssh user@your-server.com

# Clone repo
git clone https://github.com/henrysammarfo/factoryguard-ai.git
cd factoryguard-ai

# Install dependencies
npm install

# Create .env.local with all variables
nano .env.local
# (paste all environment variables)

# Install PM2 for process management
npm install -g pm2

# Start services
pm2 start npm --name "factoryguard-backend" -- run server:prod

# Save PM2 configuration
pm2 save
pm2 startup

# Check status
pm2 status
pm2 logs factoryguard-backend
```

---

## 🔍 Verify Deployment

### Check Backend Services

Visit your backend URL:
```
https://your-backend.onrender.com
```

You should see the Next.js app running.

### Check Logs

**Render**: Dashboard → Logs tab

Look for:
```
[FactoryGuard] Production server running on http://localhost:3000
[FactoryGuard] WebSocket server running on ws://localhost:3000
[FactoryGuard] Starting backend services...
[FactoryGuard] ✅ Connected to MQTT broker for supOS synchronization
[FactoryGuard] ✅ Connected to supOS PostgreSQL
[FactoryGuard] ✅ Connected to supOS TimescaleDB
[FactoryGuard] All services started successfully
```

### Check supOS Integration

1. Go to supOS: https://supos-ce-instance2.supos.app:8443
2. Navigate to UNS → Source Flow → factoryguard-ai
3. Open debug panel
4. You should see messages appearing every 10 seconds!

---

## 🎯 How Data Flows (Production)

```
User Browser
    ↓
Vercel (Frontend)
    ↓ (WebSocket)
Render (Backend Services)
    ↓ (MQTT Publish)
HiveMQ Cloud
    ↓ (MQTT Subscribe)
supOS NodeRED SourceFlow
    ↓ (Database Write)
PostgreSQL + TimescaleDB
```

**Bidirectional**:
```
supOS EventFlow
    ↓ (Threshold Check)
MQTT Publish (alerts)
    ↓
HiveMQ Cloud
    ↓
Render Backend (MQTT Subscribe)
    ↓
Vercel Frontend (Display Alerts)
```

---

## 🔧 Troubleshooting

### Backend Not Starting

**Check logs** for errors:
- Missing environment variables
- Database connection issues
- MQTT connection failures

**Solution**: Verify all environment variables are set correctly.

### supOS Not Receiving Data

**Check**:
1. Backend logs show MQTT publishing
2. HiveMQ Cloud dashboard shows connections
3. supOS NodeRED flows are deployed
4. MQTT broker credentials are correct

**Solution**: Restart backend service or check MQTT credentials.

### Frontend Can't Connect to Backend

**Check**:
1. `NEXT_PUBLIC_WS_URL` is set in Vercel
2. Backend URL is correct
3. Backend is running (check Render dashboard)

**Solution**: Update Vercel environment variables and redeploy.

---

## 📊 Monitoring

### Render Dashboard
- View logs in real-time
- Monitor CPU/memory usage
- Check service health

### supOS Debug Panel
- See live data transmission
- Verify message frequency
- Check data format

### HiveMQ Cloud Dashboard
- Monitor connection status
- View message throughput
- Check client connections

---

## 💰 Cost Estimate

**Free Tier**:
- Vercel: Free (hobby plan)
- Render: Free (750 hours/month)
- HiveMQ Cloud: Free (already configured)
- supOS: Your server

**Total**: $0/month for development/demo

**Production** (if needed):
- Render Pro: $7/month
- Vercel Pro: $20/month (if needed)

---

## ✅ Deployment Checklist

- [ ] Push code to GitHub
- [ ] Vercel auto-deploys frontend
- [ ] Create Render account
- [ ] Deploy backend to Render
- [ ] Add all environment variables to Render
- [ ] Wait for Render deployment
- [ ] Copy Render URL
- [ ] Add `NEXT_PUBLIC_WS_URL` to Vercel
- [ ] Redeploy Vercel frontend
- [ ] Check Render logs for successful startup
- [ ] Verify supOS receives data
- [ ] Test frontend → backend connection
- [ ] Monitor for 10-15 minutes

---

## 🎉 Success Criteria

When everything is working:

✅ Vercel frontend loads  
✅ Render backend shows "All services started"  
✅ Render logs show MQTT publishing  
✅ supOS debug panel shows live messages  
✅ Messages appear every 10 seconds  
✅ Timestamps are current  
✅ No errors in logs  

---

**Need help?** Check the logs first, then verify environment variables!
