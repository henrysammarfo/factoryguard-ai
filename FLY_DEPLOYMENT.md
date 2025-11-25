# 🚀 Fly.io Deployment Guide - FactoryGuard AI

## Quick Start

Deploy your FactoryGuard AI backend (with supOS integration) to Fly.io in 5 minutes!

---

## Prerequisites

1. **Fly.io Account**: Sign up at [fly.io](https://fly.io)
2. **flyctl CLI**: Install the Fly.io command-line tool

### Install flyctl

**Windows (PowerShell)**:
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Mac/Linux**:
```bash
curl -L https://fly.io/install.sh | sh
```

### Login to Fly.io

```bash
flyctl auth login
```

---

## 🎯 Deployment Steps

### Step 1: Initialize Fly App

```bash
cd c:\Users\jessi\Desktop\factoryguard-ai

# Launch Fly app (this creates fly.toml)
flyctl launch

# Answer the prompts:
# App name: factoryguard-ai (or your choice)
# Region: Choose closest to you (e.g., iad for US East)
# PostgreSQL: No (we're using Supabase)
# Redis: No
# Deploy now: No (we need to set secrets first)
```

### Step 2: Set Environment Variables (Secrets)

```bash
# Supabase
flyctl secrets set NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
flyctl secrets set NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
flyctl secrets set SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Hugging Face
flyctl secrets set HUGGINGFACE_API_KEY="your_huggingface_key"

# supOS
flyctl secrets set SUPOS_BASE_URL="https://supos-ce-instance2.supos.app:8443"
flyctl secrets set SUPOS_API_KEY="4174348a-9222-4e81-b33e-5d72d2fd7f1e"

# MQTT (HiveMQ Cloud)
flyctl secrets set MQTT_BROKER_URL="1f3c070f03034f3890cb2c984bc76294.s1.eu.hivemq.cloud"
flyctl secrets set MQTT_BROKER_PORT="8883"
flyctl secrets set MQTT_USERNAME="factoryguard_client"
flyctl secrets set MQTT_PASSWORD="Dogbytec@r1"
flyctl secrets set MQTT_USE_TLS="true"

# supOS Databases
flyctl secrets set SUPOS_POSTGRES_URL="postgres://postgres:postgres@supos-ce-instance2.supos.app:5432/postgres"
flyctl secrets set SUPOS_TSDB_URL="postgres://postgres:postgres@supos-ce-instance2.supos.app:2345/postgres"
```

### Step 3: Update next.config.mjs

Add this to enable standalone output:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
```

### Step 4: Deploy!

```bash
flyctl deploy
```

This will:
- Build your Docker image
- Push to Fly.io registry
- Deploy to your app
- Start all backend services

**Deployment takes 3-5 minutes.**

### Step 5: Get Your App URL

```bash
flyctl status
```

Your app will be at: `https://factoryguard-ai.fly.dev`

---

## 🔍 Verify Deployment

### Check Logs

```bash
# View real-time logs
flyctl logs

# You should see:
# [FactoryGuard] Production server running on http://localhost:3000
# [FactoryGuard] WebSocket server running on ws://localhost:3000
# [FactoryGuard] Starting backend services...
# [FactoryGuard] ✅ Connected to MQTT broker for supOS synchronization
# [FactoryGuard] ✅ Connected to supOS PostgreSQL
# [FactoryGuard] ✅ Connected to supOS TimescaleDB
# [FactoryGuard] All services started successfully
```

### Check supOS Integration

1. Go to supOS: https://supos-ce-instance2.supos.app:8443
2. Navigate to UNS → Source Flow → factoryguard-ai
3. Open debug panel
4. **You should see messages appearing every 10 seconds!** ✅

### Test the App

Visit your app: `https://factoryguard-ai.fly.dev`

---

## 🔧 Useful Commands

### View Logs
```bash
flyctl logs
flyctl logs -a factoryguard-ai
```

### SSH into Container
```bash
flyctl ssh console
```

### Check Status
```bash
flyctl status
```

### Scale Resources (if needed)
```bash
# Increase memory
flyctl scale memory 1024

# Add more VMs
flyctl scale count 2
```

### Restart App
```bash
flyctl apps restart factoryguard-ai
```

### View Secrets
```bash
flyctl secrets list
```

### Update a Secret
```bash
flyctl secrets set MQTT_PASSWORD="new_password"
```

---

## 📊 Monitoring

### Fly.io Dashboard

Visit: https://fly.io/dashboard

- View metrics (CPU, memory, requests)
- Monitor uptime
- Check deployment history

### Check MQTT Connection

```bash
flyctl logs | grep "MQTT"
```

Should show:
```
✅ Connected to MQTT broker for supOS synchronization
📤 Equipment: Main Conveyor Motor
📤 Sensor: temperature = 68
```

### Check supOS Data Flow

In supOS debug panel, verify:
- Messages every 10 seconds
- Current timestamps
- `"source": "factoryguard"` in all messages

---

## 🔄 Update Deployment

When you make changes:

```bash
# Commit changes
git add .
git commit -m "Update backend services"
git push

# Deploy to Fly.io
flyctl deploy
```

---

## 💰 Pricing

**Free Tier Includes**:
- 3 shared-cpu-1x VMs (256MB RAM each)
- 160GB outbound data transfer
- Perfect for development and demos!

**Your Setup**:
- 1 VM with 512MB RAM
- **Cost**: FREE (within free tier)

**If you need more**:
- Scale to 1GB RAM: ~$2/month
- Add redundancy (2 VMs): ~$4/month

---

## 🐛 Troubleshooting

### Deployment Fails

**Check build logs**:
```bash
flyctl logs
```

**Common issues**:
- Missing secrets → Set all environment variables
- Build errors → Check `npm run build` locally first
- Port conflicts → Ensure PORT=3000 in fly.toml

### App Not Starting

**Check logs**:
```bash
flyctl logs
```

**Look for**:
- Database connection errors
- MQTT connection failures
- Missing environment variables

**Solution**: Verify all secrets are set correctly.

### supOS Not Receiving Data

**Check**:
1. Fly.io logs show MQTT publishing
2. MQTT credentials are correct
3. supOS NodeRED flows are deployed

**Debug**:
```bash
flyctl logs | grep "supOS"
```

### High Memory Usage

**Scale up**:
```bash
flyctl scale memory 1024
```

---

## 🎯 Architecture on Fly.io

```
┌─────────────────────────────────────┐
│  Fly.io (factoryguard-ai.fly.dev)  │
│  ┌───────────────────────────────┐  │
│  │  Frontend (Next.js)           │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  Backend Services             │  │
│  │  - WebSocket                  │  │
│  │  - MQTT Listener              │  │
│  │  - AI Predictor               │  │
│  │  - supOS MQTT Sync ✅         │  │
│  │  - supOS DB Sync ✅           │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
              ↓
    ┌─────────────────┐
    │  HiveMQ Cloud   │
    └─────────────────┘
              ↓
    ┌─────────────────┐
    │  supOS Instance │
    │  - SourceFlow   │
    │  - EventFlow    │
    └─────────────────┘
```

**Everything runs on one Fly.io VM!**

---

## ✅ Success Checklist

- [ ] Install flyctl
- [ ] Login to Fly.io
- [ ] Run `flyctl launch`
- [ ] Set all secrets (environment variables)
- [ ] Update next.config.mjs with `output: 'standalone'`
- [ ] Run `flyctl deploy`
- [ ] Check logs for successful startup
- [ ] Verify supOS receives data
- [ ] Test app at https://factoryguard-ai.fly.dev
- [ ] Monitor for 10-15 minutes

---

## 🎉 You're Done!

Your FactoryGuard AI is now running on Fly.io with full supOS integration!

**What's working**:
- ✅ Frontend accessible at https://factoryguard-ai.fly.dev
- ✅ Backend services running 24/7
- ✅ MQTT publishing to supOS every 10 seconds
- ✅ Database writes to PostgreSQL + TimescaleDB
- ✅ Alerts flowing back from supOS EventFlow

**Next steps**:
- Monitor logs for a few hours
- Check supOS debug panel regularly
- Share the URL with the supOS team!

---

**Need help?** Run `flyctl logs` to see what's happening!
