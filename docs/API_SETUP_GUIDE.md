# Complete API Setup Guide for FactoryGuard AI

This guide provides step-by-step instructions for obtaining all API keys needed for the FactoryGuard AI platform. All services listed have free tiers suitable for hackathons and demos.

---

## 1. Supabase (Database & Auth)

**Free Tier:** 500MB database, 2GB bandwidth, 50,000 monthly active users

### Step-by-Step Setup:

1. **Create Account**
   - Go to https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub (recommended) or email

2. **Create New Project**
   - Click "New Project"
   - Choose organization (create one if needed)
   - Enter project details:
     - Name: `factoryguard-ai`
     - Database Password: Generate a strong password (save this!)
     - Region: Choose closest to you
   - Click "Create new project" (takes 2-3 minutes)

3. **Get API Keys**
   - Once project is ready, go to Settings → API
   - Copy these values:
     - `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` key → This is your `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

4. **Get Database Connection String**
   - Go to Settings → Database
   - Scroll to "Connection string"
   - Select "URI" tab
   - Copy the connection string → This is your `DATABASE_URL`
   - Replace `[YOUR-PASSWORD]` with your database password

5. **Enable Realtime (Optional)**
   - Go to Database → Replication
   - Enable replication for tables you want real-time updates on

### Environment Variables to Add:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
\`\`\`

---

## 2. Hugging Face (AI Models)

**Free Tier:** 30,000 requests/month on Inference API

### Step-by-Step Setup:

1. **Create Account**
   - Go to https://huggingface.co
   - Click "Sign Up"
   - Use email or GitHub

2. **Generate API Token**
   - Click your profile picture (top right)
   - Go to Settings → Access Tokens
   - Click "New token"
   - Name: `factoryguard-ai`
   - Role: Select "Read"
   - Click "Generate token"
   - Copy the token immediately (shown only once!)

3. **Test Models (Optional)**
   - Go to https://huggingface.co/models
   - Search for "anomaly detection" or "time series"
   - Recommended free models:
     - `facebook/timesformer-base-finetuned-k400` (time series)
     - `microsoft/DialoGPT-medium` (text analysis)
     - Any model with "Inference API" badge

### Environment Variables to Add:
\`\`\`env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`

### Usage Limits:
- Free tier: 30,000 requests/month
- Rate limit: ~1 request/second
- Perfect for demos and hackathons

---

## 3. OpenAI (Optional - for Advanced AI)

**Free Tier:** $5 credit for new accounts (expires after 3 months)

### Step-by-Step Setup:

1. **Create Account**
   - Go to https://platform.openai.com
   - Click "Sign up"
   - Verify email and phone number

2. **Add Payment Method (Required)**
   - Go to Settings → Billing
   - Add credit card (won't be charged unless you exceed free credits)
   - Set usage limits to $5 to prevent overcharges

3. **Generate API Key**
   - Go to API keys section
   - Click "Create new secret key"
   - Name: `factoryguard-ai`
   - Copy the key (shown only once!)

### Environment Variables to Add:
\`\`\`env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`

### Cost Optimization:
- Use GPT-3.5-turbo ($0.50/1M tokens) instead of GPT-4
- Set max_tokens to limit costs
- Cache responses when possible

---

## 4. MQTT Broker (IoT Sensor Data)

**Free Options:**

### Option A: HiveMQ Cloud (Recommended)

**Free Tier:** 100 connections, unlimited messages

1. **Create Account**
   - Go to https://www.hivemq.com/mqtt-cloud-broker/
   - Click "Try for free"
   - Sign up with email

2. **Create Cluster**
   - Click "Create Cluster"
   - Choose "Free" plan
   - Select region
   - Wait for cluster to provision (2-3 minutes)

3. **Get Connection Details**
   - Click on your cluster
   - Note these values:
     - Host: `xxxxx.s1.eu.hivemq.cloud`
     - Port: `8883` (TLS) or `1883` (TCP)
   - Go to "Access Management"
   - Create credentials:
     - Username: `factoryguard`
     - Password: Generate strong password

### Environment Variables to Add:
\`\`\`env
MQTT_BROKER_URL=mqtts://xxxxx.s1.eu.hivemq.cloud:8883
MQTT_USERNAME=factoryguard
MQTT_PASSWORD=your-password-here
\`\`\`

### Option B: Eclipse Mosquitto (Public Test Server)

**For Testing Only - Not Secure!**

\`\`\`env
MQTT_BROKER_URL=mqtt://test.mosquitto.org:1883
MQTT_USERNAME=
MQTT_PASSWORD=
\`\`\`

---

## 5. Vercel (Deployment)

**Free Tier:** Unlimited deployments, 100GB bandwidth

### Step-by-Step Setup:

1. **Create Account**
   - Go to https://vercel.com
   - Sign up with GitHub (recommended)

2. **Connect Repository**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Add Environment Variables**
   - In project settings → Environment Variables
   - Add all the variables from above
   - Make sure to mark sensitive ones as "Secret"

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in ~2 minutes

### Environment Variables to Add in Vercel:
- All variables from Supabase, Hugging Face, OpenAI, and MQTT
- Add `NODE_ENV=production`

---

## 6. Upstash Redis (Optional - for Caching)

**Free Tier:** 10,000 commands/day

### Step-by-Step Setup:

1. **Create Account**
   - Go to https://upstash.com
   - Sign up with GitHub or email

2. **Create Database**
   - Click "Create Database"
   - Name: `factoryguard-cache`
   - Type: Regional
   - Region: Choose closest
   - Click "Create"

3. **Get Connection Details**
   - Click on your database
   - Copy "REST URL" and "REST Token"

### Environment Variables to Add:
\`\`\`env
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxxx
\`\`\`

---

## Complete .env File Template

Create a `.env.local` file in your project root:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# AI Services
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# MQTT Broker
MQTT_BROKER_URL=mqtts://xxxxx.s1.eu.hivemq.cloud:8883
MQTT_USERNAME=factoryguard
MQTT_PASSWORD=your-password-here

# Redis Cache (Optional)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxxx

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

---

## Testing Your Setup

### 1. Test Supabase Connection
\`\`\`bash
curl https://xxxxx.supabase.co/rest/v1/ \
  -H "apikey: YOUR_ANON_KEY"
\`\`\`

### 2. Test Hugging Face API
\`\`\`bash
curl https://api-inference.huggingface.co/models/gpt2 \
  -H "Authorization: Bearer YOUR_HF_TOKEN" \
  -d '{"inputs": "test"}'
\`\`\`

### 3. Test MQTT Connection
Use MQTT Explorer (free desktop app):
- Download from http://mqtt-explorer.com
- Connect using your broker details
- Publish test message to `factoryguard/test`

---

## Cost Summary (Monthly)

| Service | Free Tier | Estimated Usage | Cost |
|---------|-----------|-----------------|------|
| Supabase | 500MB DB, 2GB bandwidth | ~100MB, 500MB | $0 |
| Hugging Face | 30k requests | ~5k requests | $0 |
| OpenAI | $5 credit | ~10k tokens | $0.05 |
| HiveMQ | 100 connections | 10 devices | $0 |
| Vercel | 100GB bandwidth | ~5GB | $0 |
| Upstash | 10k commands | ~2k commands | $0 |
| **TOTAL** | | | **~$0.05/month** |

Perfect for hackathons and demos!

---

## Troubleshooting

### Supabase Connection Issues
- Check if project is paused (free tier pauses after 7 days inactivity)
- Verify database password is correct
- Check if IP is whitelisted (Settings → Database → Connection pooling)

### Hugging Face Rate Limits
- Free tier: 1 request/second
- If exceeded, wait 60 seconds or upgrade to Pro ($9/month)

### MQTT Connection Fails
- Verify TLS/SSL settings (use `mqtts://` for secure)
- Check firewall isn't blocking port 8883
- Test with public broker first: `mqtt://test.mosquitto.org:1883`

### Vercel Deployment Fails
- Check build logs for errors
- Verify all environment variables are set
- Make sure `package.json` has correct scripts

---

## Next Steps

Once you have all API keys:

1. Add them to `.env.local` file
2. Copy the CLAUDE_PROMPT.md content
3. Paste into Claude AI
4. Let Claude build the backend integration
5. Test locally with `npm run dev`
6. Deploy to Vercel

Need help? Check the main README.md or create an issue on GitHub.
