# 🔑 Complete API Keys & Integration Guide

This document provides detailed, step-by-step instructions for obtaining every API key and credential needed for FactoryGuard AI.

---

## 1. Supabase (Database & Real-time) ⭐ REQUIRED

### What You'll Get
- PostgreSQL database for storing all factory data
- Real-time subscriptions for live updates
- Built-in authentication (if needed later)
- Row Level Security for data protection

### Step-by-Step Setup

#### Create Account & Project
1. **Visit**: [https://supabase.com](https://supabase.com)
2. **Click**: "Start your project" (top right)
3. **Sign in**: Use GitHub, Google, or email
4. **Create Organization** (if first time):
   - Organization name: `Your Company Name`
   - Click "Create organization"

5. **Create New Project**:
   - Click "New project"
   - Project name: `factoryguard-ai`
   - Database Password: Generate strong password (SAVE THIS!)
   - Region: Select closest to your location
     - US East: `us-east-1`
     - EU: `eu-central-1`
     - Asia: `ap-southeast-1`
   - Pricing plan: Free (sufficient for hackathon/demo)
   - Click "Create new project"

6. **Wait**: 2-3 minutes for database provisioning

#### Get Your API Keys
1. **Navigate**: Left sidebar → ⚙️ **Settings** → **API**
2. **Copy These Values**:

   **Project URL**:
   \`\`\`
   https://abcdefghijklmnop.supabase.co
   \`\`\`
   → Save as: `NEXT_PUBLIC_SUPABASE_URL`

   **API Keys Section**:
   - **anon public** (safe to use in browser):
     \`\`\`
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     \`\`\`
     → Save as: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   - **service_role** (⚠️ KEEP SECRET - server only):
     \`\`\`
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     \`\`\`
     → Save as: `SUPABASE_SERVICE_ROLE_KEY`

#### Verify Setup
\`\`\`bash
# Test connection
curl https://your-project.supabase.co/rest/v1/ \
  -H "apikey: your-anon-key"

# Should return: {"message":"Welcome to Supabase"}
\`\`\`

### Cost
- **Free tier**: 500MB database, 2GB bandwidth, 50MB file storage
- **Sufficient for**: Hackathon, demo, small factory (<20 machines)
- **Upgrade needed**: If >100 machines or >1GB data

---

## 2. Hugging Face (AI/ML Models) ⭐ REQUIRED

### What You'll Get
- Access to 100,000+ pre-trained AI models
- Time series forecasting for predictive maintenance
- Anomaly detection for equipment failures
- Free inference API (1000 requests/day)

### Step-by-Step Setup

#### Create Account
1. **Visit**: [https://huggingface.co](https://huggingface.co)
2. **Click**: "Sign Up" (top right)
3. **Choose**: Email or GitHub sign-in
4. **Verify**: Email address
5. **Complete**: Profile setup (optional)

#### Generate API Token
1. **Click**: Your profile picture (top right)
2. **Select**: ⚙️ **Settings**
3. **Navigate**: Left sidebar → **Access Tokens**
4. **Click**: "New token" button
5. **Configure Token**:
   - Name: `factoryguard-ai-production`
   - Role: **Read** (sufficient for inference)
   - Click "Generate token"

6. **Copy Token** (shows once only!):
   \`\`\`
   hf_AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
   \`\`\`
   → Save as: `HUGGINGFACE_API_KEY`

#### Test API Access
\`\`\`bash
# Test with curl
curl https://api-inference.huggingface.co/models/facebook/timeseries-transformer-tourism-monthly \
  -H "Authorization: Bearer hf_your_token" \
  -H "Content-Type: application/json" \
  -d '{"inputs": [1, 2, 3, 4, 5]}'

# Should return predictions
\`\`\`

### Models We Use
- `facebook/timeseries-transformer-tourism-monthly` - RUL prediction
- `microsoft/deberta-v3-base` - Anomaly detection
- `distilbert-base-uncased` - Alert classification

### Cost
- **Free tier**: 1,000 requests/day per model
- **Rate limit**: 1 request/second
- **Sufficient for**: Real-time monitoring of 50 machines
- **Upgrade**: Pro ($9/month) for 10,000 requests/day

---

## 3. MQTT Broker (IoT Sensor Data) ⭐ REQUIRED

### What You'll Get
- Real-time message broker for sensor data
- Publish/Subscribe pattern for IoT devices
- TLS encryption for secure data transmission
- Support for thousands of concurrent connections

### Option A: HiveMQ Cloud (Recommended for Production)

#### Create Free Cluster
1. **Visit**: [https://console.hivemq.cloud](https://console.hivemq.cloud)
2. **Click**: "Sign Up" → Use email or Google
3. **Verify**: Email address
4. **Create Cluster**:
   - Click "Create new cluster"
   - Cluster name: `factoryguard-production`
   - Cloud provider: AWS (or your preference)
   - Region: Choose closest to factory
   - Plan: **Free** (100 connections, 10GB/month)
   - Click "Create"

5. **Wait**: 2-3 minutes for provisioning

#### Get Connection Details
1. **Navigate**: Your cluster → **Overview**
2. **Copy**:
   - **Host**: `abc123def456.s1.eu.hivemq.cloud`
     → Save as: `MQTT_BROKER_URL`
   - **Port**: `8883` (TLS/SSL)
     → Save as: `MQTT_BROKER_PORT`

#### Create Access Credentials
1. **Navigate**: **Access Management** tab
2. **Click**: "Add credentials"
3. **Configure**:
   - Username: `factoryguard_client`
   - Password: Generate strong password (SAVE THIS!)
   - Permissions: All topics (`#`)
4. **Save**:
   - Username → `MQTT_USERNAME`
   - Password → `MQTT_PASSWORD`

#### Test Connection
\`\`\`bash
# Install MQTT client
npm install -g mqtt

# Test publish
mqtt pub -h 'your-broker.hivemq.cloud' -p 8883 \
  -u 'factoryguard_client' -P 'your-password' \
  --protocol mqtts \
  -t 'sensors/test' -m 'Hello from FactoryGuard'

# Test subscribe
mqtt sub -h 'your-broker.hivemq.cloud' -p 8883 \
  -u 'factoryguard_client' -P 'your-password' \
  --protocol mqtts \
  -t 'sensors/#'
\`\`\`

### Option B: Local Mosquitto (Development Only)

#### Install
\`\`\`bash
# macOS
brew install mosquitto

# Ubuntu/Debian
sudo apt update
sudo apt install mosquitto mosquitto-clients

# Windows
# Download from: https://mosquitto.org/download/
\`\`\`

#### Start Broker
\`\`\`bash
# Start with default config
mosquitto -v

# Or with custom config
mosquitto -c /path/to/mosquitto.conf
\`\`\`

#### Environment Variables
\`\`\`bash
MQTT_BROKER_URL=localhost
MQTT_BROKER_PORT=1883
MQTT_USERNAME=
MQTT_PASSWORD=
MQTT_USE_TLS=false
\`\`\`

### Cost
- **HiveMQ Free**: 100 connections, 10GB/month
- **HiveMQ Starter**: $49/month for 1000 connections
- **Mosquitto**: Free (self-hosted)

---

## 4. supOS Platform (Optional - Real Factory Integration)

### What You'll Get
- Integration with existing supOS industrial platform
- Access to real-time factory data
- Connection to PLCs, SCADA, MES systems
- Historical data access

### Step-by-Step Setup

#### Contact Your supOS Administrator
1. **Email**: Your factory's IT/OT department
2. **Request**: API access for FactoryGuard AI integration
3. **Provide**: Use case and required permissions

#### Required Information
Ask for these specific values:

1. **API Endpoint**:
   \`\`\`
   https://supos.yourfactory.com/api/v1
   \`\`\`
   → Save as: `SUPOS_API_URL`

2. **API Key** (or OAuth credentials):
   \`\`\`
   supos_key_abc123def456ghi789
   \`\`\`
   → Save as: `SUPOS_API_KEY`

3. **Tenant/Organization ID**:
   \`\`\`
   tenant_12345
   \`\`\`
   → Save as: `SUPOS_TENANT_ID`

4. **Available Data Points**: Request list of:
   - Equipment IDs
   - Sensor tag names
   - Available metrics
   - Update frequency

#### Test Connection
\`\`\`bash
# Test API access
curl https://supos.yourfactory.com/api/v1/health \
  -H "Authorization: Bearer your-api-key" \
  -H "X-Tenant-ID: your-tenant-id"

# Should return: {"status": "ok"}
\`\`\`

### Alternative: Simulate supOS Data
If you don't have supOS access, use our simulator:
\`\`\`bash
cd simulator
npm run simulate:supos
\`\`\`

---

## 5. OpenAI (Optional - Enhanced AI Features)

### What You'll Get
- GPT-4 for natural language insights
- Advanced anomaly detection
- Automated report generation
- Conversational AI for operators

### Step-by-Step Setup

#### Create Account
1. **Visit**: [https://platform.openai.com](https://platform.openai.com)
2. **Click**: "Sign up"
3. **Verify**: Email and phone number
4. **Add Payment**: Credit card required (pay-as-you-go)

#### Generate API Key
1. **Navigate**: Left sidebar → **API keys**
2. **Click**: "Create new secret key"
3. **Configure**:
   - Name: `factoryguard-ai`
   - Permissions: All (or restrict to specific models)
4. **Copy Key** (shows once only!):
   \`\`\`
   sk-proj-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
   \`\`\`
   → Save as: `OPENAI_API_KEY`

#### Set Usage Limits (Recommended)
1. **Navigate**: **Settings** → **Billing** → **Usage limits**
2. **Set**:
   - Hard limit: $10/month (for testing)
   - Email alerts: At $5 and $8

#### Test API
\`\`\`bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer sk-your-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Test"}]
  }'
\`\`\`

### Cost Estimate
- **GPT-4o-mini**: $0.15/1M input tokens, $0.60/1M output tokens
- **Typical usage**: $0.50-2.00/day for FactoryGuard AI
- **Monthly**: ~$15-60 depending on usage

---

## 6. Additional Services (Optional)

### Vercel (Deployment)
1. **Visit**: [https://vercel.com](https://vercel.com)
2. **Sign up**: With GitHub
3. **Import**: Your repository
4. **Add**: Environment variables in dashboard
5. **Deploy**: Automatic on push

**Cost**: Free for hobby projects

### Redis (Caching - Optional)
1. **Visit**: [https://upstash.com](https://upstash.com)
2. **Create**: Free Redis database
3. **Copy**: `REDIS_URL` and `REDIS_TOKEN`

**Cost**: Free tier (10,000 commands/day)

---

## 📋 Complete Environment Variables Checklist

Copy this template to `.env.local`:

\`\`\`bash
# ===== REQUIRED =====

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Hugging Face
HUGGINGFACE_API_KEY=

# MQTT Broker
MQTT_BROKER_URL=
MQTT_BROKER_PORT=
MQTT_USERNAME=
MQTT_PASSWORD=
MQTT_USE_TLS=true

# ===== OPTIONAL =====

# supOS (if available)
SUPOS_API_URL=
SUPOS_API_KEY=
SUPOS_TENANT_ID=

# OpenAI (enhanced AI)
OPENAI_API_KEY=

# Redis (caching)
REDIS_URL=
REDIS_TOKEN=

# WebSocket (auto-configured)
NEXT_PUBLIC_WS_URL=ws://localhost:3001
\`\`\`

---

## ✅ Verification Checklist

Before proceeding to Cursor integration:

- [ ] Supabase project created and keys copied
- [ ] Hugging Face account created and token generated
- [ ] MQTT broker set up (HiveMQ or local)
- [ ] MQTT credentials tested with `mqtt` CLI
- [ ] All required env vars added to `.env.local`
- [ ] Optional services configured (if using)
- [ ] `.env.local` added to `.gitignore`

---

## 🆘 Common Issues

### "Invalid API Key" Errors
- Verify key is copied completely (no spaces)
- Check key hasn't expired
- Ensure correct environment variable name

### MQTT Connection Refused
- Verify broker URL and port
- Check TLS setting matches port (8883 = TLS, 1883 = no TLS)
- Test credentials with MQTT client first

### Supabase "Project Not Found"
- Ensure project is fully provisioned (wait 3-5 min)
- Check URL format: `https://[project-ref].supabase.co`
- Verify anon key matches project

---

**Next Step**: Once all keys are obtained → See `CURSOR_PROMPT.md` to build the backend!
