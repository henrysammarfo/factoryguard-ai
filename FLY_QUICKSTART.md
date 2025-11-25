# 🚀 Quick Start: Deploy to Fly.io

## What You Need

1. **Fly.io account** (free tier available)
2. **flyctl CLI** installed

## Install flyctl

**Windows**:
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Mac/Linux**:
```bash
curl -L https://fly.io/install.sh | sh
```

## Deploy in 3 Steps

### 1. Login
```bash
flyctl auth login
```

### 2. Set Secrets
```bash
cd c:\Users\jessi\Desktop\factoryguard-ai

# Set all environment variables
flyctl secrets set NEXT_PUBLIC_SUPABASE_URL="your_url"
flyctl secrets set NEXT_PUBLIC_SUPABASE_ANON_KEY="your_key"
flyctl secrets set SUPABASE_SERVICE_ROLE_KEY="your_key"
flyctl secrets set HUGGINGFACE_API_KEY="your_key"
flyctl secrets set MQTT_BROKER_URL="1f3c070f03034f3890cb2c984bc76294.s1.eu.hivemq.cloud"
flyctl secrets set MQTT_BROKER_PORT="8883"
flyctl secrets set MQTT_USERNAME="factoryguard_client"
flyctl secrets set MQTT_PASSWORD="Dogbytec@r1"
flyctl secrets set MQTT_USE_TLS="true"
flyctl secrets set SUPOS_POSTGRES_URL="postgres://postgres:postgres@supos-ce-instance2.supos.app:5432/postgres"
flyctl secrets set SUPOS_TSDB_URL="postgres://postgres:postgres@supos-ce-instance2.supos.app:2345/postgres"
```

### 3. Deploy
```bash
flyctl launch  # First time only
flyctl deploy  # Deploy!
```

## Verify

```bash
# Check logs
flyctl logs

# Should see:
# ✅ Connected to MQTT broker for supOS synchronization
# ✅ Connected to supOS PostgreSQL
# ✅ Connected to supOS TimescaleDB
```

## Your App

Visit: `https://factoryguard-ai.fly.dev`

## Check supOS

1. Go to: https://supos-ce-instance2.supos.app:8443
2. Navigate to: UNS → Source Flow → factoryguard-ai
3. Open debug panel
4. **See messages every 10 seconds!** ✅

---

**See [FLY_DEPLOYMENT.md](./FLY_DEPLOYMENT.md) for complete guide!**
