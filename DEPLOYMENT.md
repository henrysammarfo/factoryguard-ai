# 🚀 Deployment Guide - FactoryGuard AI

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
Ensure `.env.local` has all required keys:
- ✅ Supabase URL and keys
- ✅ Hugging Face API key
- ✅ MQTT broker credentials
- ✅ supOS configuration

### 2. Build Test
```bash
npm run build
```
Should complete without errors.

### 3. Local Test
```bash
npm run server:all
```
All services should start successfully.

---

## 🌐 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### Step 3: Add Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=your_value
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value
SUPABASE_SERVICE_ROLE_KEY=your_value
HUGGINGFACE_API_KEY=your_value
MQTT_BROKER_URL=your_value
MQTT_BROKER_PORT=8883
MQTT_USERNAME=your_value
MQTT_PASSWORD=your_value
MQTT_USE_TLS=true
SUPOS_API_URL=http://127.0.0.1:8088
SUPOS_API_KEY=your_value
SUPOS_TENANT_ID=supos
NEXT_PUBLIC_WS_URL=wss://your-app.vercel.app
```

### Step 4: Deploy
Click "Deploy" - Vercel will build and deploy automatically.

---

## 🎯 What Gets Deployed

### ✅ Frontend (Vercel)
- Next.js app
- Static assets
- API routes
- Serverless functions

### ⚠️ Backend Services (Separate Hosting Needed)
The following need separate hosting (Railway, Render, etc.):
- WebSocket server (`server/websocket.ts`)
- MQTT listener (`server/mqtt-listener.ts`)
- AI predictor (`server/ai-predictor.ts`)

---

## 🔧 Backend Deployment (Railway)

### Option 1: Deploy Backend to Railway

1. Create `Procfile`:
```
web: npm run server:all
```

2. Push to Railway:
```bash
railway login
railway init
railway up
```

3. Add environment variables in Railway dashboard

4. Update `NEXT_PUBLIC_WS_URL` in Vercel to Railway URL

### Option 2: Run Backend Locally
For demo purposes, you can:
1. Deploy frontend to Vercel
2. Run backend locally: `npm run server:all`
3. Use ngrok for WebSocket: `ngrok http 3001`
4. Update `NEXT_PUBLIC_WS_URL` to ngrok URL

---

## ✅ Verification

After deployment:

1. **Frontend**: Visit your Vercel URL
2. **Authentication**: Test signup/login
3. **Dashboard**: Check if data loads
4. **Real-time**: Verify WebSocket connection
5. **supOS**: Check integration status at `/dashboard/supos`

---

## 🚨 Important Notes

### For Hackathon Judges:
- **Frontend is fully deployed** on Vercel
- **Backend services** can run locally or on Railway
- **supOS integration** requires supOS-CE running locally
- **Demo mode** works without backend (uses mock data)

### Production Deployment:
- Frontend: Vercel (free tier)
- Backend: Railway/Render ($5-10/month)
- Database: Supabase (free tier)
- MQTT: HiveMQ Cloud (free tier)
- supOS: Self-hosted or cloud instance

---

## 📊 Deployment Status

| Component | Platform | Status |
|-----------|----------|--------|
| Frontend | Vercel | ✅ Ready |
| API Routes | Vercel Serverless | ✅ Ready |
| Database | Supabase | ✅ Live |
| Authentication | Supabase Auth | ✅ Live |
| WebSocket | Railway/Local | ⚠️ Needs setup |
| MQTT | Railway/Local | ⚠️ Needs setup |
| AI Service | Railway/Local | ⚠️ Needs setup |
| supOS | Self-hosted | ⚠️ Optional |

---

## 🎉 Quick Deploy Command

```bash
# 1. Build and test
npm run build

# 2. Push to GitHub
git add .
git commit -m "Production ready"
git push

# 3. Deploy to Vercel (via dashboard or CLI)
vercel --prod

# 4. Run backend locally for demo
npm run server:all
```

---

**Your app is ready to deploy!** 🚀
