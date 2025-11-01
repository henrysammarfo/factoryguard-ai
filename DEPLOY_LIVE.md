# 🚀 COMPLETE DEPLOYMENT GUIDE - FactoryGuard AI

## ✅ Pre-Deployment Checklist

- [x] Build test passed
- [x] All services working locally
- [x] Environment variables configured
- [x] Git repository pushed to GitHub
- [x] Supabase database live
- [x] MQTT broker configured (HiveMQ Cloud)

---

## 📦 PART 1: Deploy Frontend to Vercel

### Step 1: Build Test (Verify First)

```bash
npm run build
```

**Expected**: Build completes successfully ✅

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Production ready - Full deployment"
git push origin main
```

### Step 3: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. **Go to**: https://vercel.com
2. **Sign in** with GitHub
3. **Click**: "Add New" → "Project"
4. **Import**: `henrysammarfo/factoryguard-ai`
5. **Framework**: Next.js (auto-detected)
6. **Root Directory**: `./`
7. **Build Command**: `npm run build`
8. **Output Directory**: `.next`

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Step 4: Add Environment Variables in Vercel

Go to: **Project Settings** → **Environment Variables**

Add these:

```env
# Supabase (Get from your Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Hugging Face (Get from https://huggingface.co/settings/tokens)
HUGGINGFACE_API_KEY=your_huggingface_api_key

# MQTT (Your MQTT broker credentials)
MQTT_BROKER_URL=your_mqtt_broker_url
MQTT_BROKER_PORT=8883
MQTT_USERNAME=your_mqtt_username
MQTT_PASSWORD=your_mqtt_password
MQTT_USE_TLS=true

# supOS
SUPOS_API_URL=http://127.0.0.1:8088
SUPOS_API_KEY=your_supos_api_key

# WebSocket (Update after backend deployment)
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# OpenAI (Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=your_openai_api_key
```

**IMPORTANT**: Copy values from your local `.env.local` file!

### Step 5: Deploy

Click **"Deploy"** - Vercel will build and deploy automatically.

**Your frontend will be live at**: `https://your-app.vercel.app`

---

## 🖥️ PART 2: Deploy Backend to Railway

### Why Railway?
- ✅ Easy deployment for Node.js services
- ✅ Supports WebSocket
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Environment variables

### Step 1: Create Railway Account

1. Go to: https://railway.app
2. Sign up with GitHub
3. Verify email

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: `henrysammarfo/factoryguard-ai`
4. Railway will detect it's a Node.js project

### Step 3: Configure Backend Services

Railway will create one service. We need to configure it to run all backend services.

#### Create `Procfile` (if not exists):

```bash
web: npm run server:all
```

Or create separate services:

#### Service 1: WebSocket Server
```bash
web: npm run server:ws
```

#### Service 2: MQTT Listener
```bash
worker: npm run server:mqtt
```

#### Service 3: AI Predictor
```bash
worker: npm run server:ai
```

### Step 4: Add Environment Variables in Railway

Go to: **Project** → **Variables**

Add all the same environment variables from `.env.local`:

```env
# Copy all values from your local .env.local file
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
MQTT_BROKER_URL=your_mqtt_broker_url
MQTT_BROKER_PORT=8883
MQTT_USERNAME=your_mqtt_username
MQTT_PASSWORD=your_mqtt_password
MQTT_USE_TLS=true
SUPOS_API_URL=http://127.0.0.1:8088
SUPOS_API_KEY=your_supos_api_key
PORT=3001
```

### Step 5: Deploy

Railway will automatically deploy. You'll get a URL like:
`https://your-backend.up.railway.app`

### Step 6: Update Frontend WebSocket URL

Go back to **Vercel** → **Environment Variables**

Update:
```env
NEXT_PUBLIC_WS_URL=wss://your-backend.up.railway.app
```

**Redeploy** Vercel frontend to pick up the new WebSocket URL.

---

## 🎯 ALTERNATIVE: Deploy Backend to Render

### Step 1: Create Render Account

1. Go to: https://render.com
2. Sign up with GitHub

### Step 2: Create Web Service

1. Click **"New"** → **"Web Service"**
2. Connect GitHub: `henrysammarfo/factoryguard-ai`
3. **Name**: `factoryguard-backend`
4. **Environment**: `Node`
5. **Build Command**: `npm install`
6. **Start Command**: `npm run server:all`
7. **Plan**: Free

### Step 3: Add Environment Variables

Same as Railway - add all variables from `.env.local`

### Step 4: Deploy

Render will build and deploy automatically.

---

## 🔄 SIMPLIFIED: Deploy Everything to Vercel

Vercel can host both frontend AND backend!

### Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/ws",
      "dest": "server/websocket.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

**Note**: WebSocket support on Vercel is limited. Railway/Render is better for WebSocket.

---

## ✅ POST-DEPLOYMENT VERIFICATION

### 1. Test Frontend

Visit: `https://your-app.vercel.app`

- ✅ Page loads
- ✅ Can signup/login
- ✅ Dashboard displays
- ✅ No console errors

### 2. Test Backend

Check Railway/Render logs:

```
[FactoryGuard] WebSocket server running
[FactoryGuard] ✅ Successfully connected to MQTT broker!
[FactoryGuard] AI prediction service started
```

### 3. Test Real-time Connection

1. Open frontend
2. Open browser console
3. Should see: `WebSocket connected`

### 4. Test MQTT

Run locally:
```bash
npm run test:mqtt
```

Data should appear in deployed dashboard!

---

## 🎯 RECOMMENDED DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────────┐
│         FRONTEND (Vercel)               │
│  https://factoryguard.vercel.app        │
│  - Next.js App                          │
│  - Static Assets                        │
│  - API Routes                           │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│       BACKEND (Railway/Render)          │
│  https://backend.railway.app            │
│  - WebSocket Server (Port 3001)         │
│  - MQTT Listener                        │
│  - AI Predictor                         │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        ↓                   ↓
┌───────────────┐   ┌──────────────────┐
│   SUPABASE    │   │   HIVEMQ CLOUD   │
│   (Database)  │   │   (MQTT Broker)  │
│   - PostgreSQL│   │   - TLS Enabled  │
│   - Real-time │   │   - Port 8883    │
└───────────────┘   └──────────────────┘
```

---

## 📋 DEPLOYMENT CHECKLIST

### Before Deployment:
- [x] `npm run build` succeeds
- [x] All environment variables in `.env.local`
- [x] Git repository pushed
- [x] Supabase database created
- [x] MQTT broker configured

### Frontend (Vercel):
- [ ] Project imported from GitHub
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Site accessible
- [ ] No build errors

### Backend (Railway/Render):
- [ ] Service created
- [ ] Environment variables added
- [ ] All services running
- [ ] WebSocket accessible
- [ ] MQTT connected
- [ ] Logs show no errors

### Post-Deployment:
- [ ] Frontend loads correctly
- [ ] Authentication works
- [ ] Dashboard displays data
- [ ] WebSocket connection established
- [ ] MQTT data flows through
- [ ] Alerts are created

---

## 🚀 QUICK DEPLOY COMMANDS

### Deploy Frontend (Vercel CLI):
```bash
vercel --prod
```

### Deploy Backend (Railway CLI):
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

---

## 🔧 TROUBLESHOOTING

### Frontend Not Loading?
- Check Vercel deployment logs
- Verify environment variables
- Check browser console for errors

### WebSocket Not Connecting?
- Verify `NEXT_PUBLIC_WS_URL` is correct
- Check Railway/Render is running
- Ensure WebSocket port is exposed

### MQTT Not Working?
- Check MQTT credentials in environment variables
- Verify HiveMQ Cloud is accessible
- Check backend logs for connection status

### Database Errors?
- Verify Supabase URL and keys
- Check Supabase dashboard for issues
- Ensure tables are created

---

## 🎉 SUCCESS!

Once deployed, your app will be:

- ✅ **Frontend**: Live on Vercel
- ✅ **Backend**: Running on Railway/Render
- ✅ **Database**: Supabase (cloud)
- ✅ **MQTT**: HiveMQ Cloud
- ✅ **Real-time**: WebSocket connected
- ✅ **AI**: Hugging Face predictions
- ✅ **supOS**: Integration code ready

**Your FactoryGuard AI is now LIVE and PRODUCTION-READY!** 🚀

---

## 📊 Deployment URLs

After deployment, you'll have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **Database**: Your Supabase URL
- **MQTT**: Your MQTT broker URL

Share the frontend URL with judges/users! 🎯
