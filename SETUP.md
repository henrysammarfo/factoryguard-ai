# FactoryGuard AI - Complete Setup Guide

## 🚀 Quick Start

This guide will help you set up FactoryGuard AI from the frontend demo to a fully functional production system with real-time IoT data, predictive AI, and live monitoring.

---

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account (free tier works)
- Hugging Face account (free tier works)
- MQTT broker access (or use free HiveMQ Cloud)
- Vercel account for deployment (optional)

---

## 🔑 Required API Keys & Services

### 1. **Supabase** (Database & Real-time)
**Purpose**: Store equipment data, alerts, maintenance logs, sensor readings

**Get Your Keys**:
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → Sign in with GitHub
3. Create new project:
   - Project name: `factoryguard-ai`
   - Database password: (save this securely)
   - Region: Choose closest to your factory
4. Wait 2-3 minutes for provisioning
5. Go to **Settings** → **API**
6. Copy these values:
   - `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → This is your `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

**Database Schema**: See `database-schema.sql` (will be created by Cursor)

---

### 2. **Hugging Face** (AI/ML Models)
**Purpose**: Anomaly detection, predictive maintenance, failure prediction

**Get Your API Key**:
1. Go to [huggingface.co](https://huggingface.co)
2. Sign up (free)
3. Click your profile → **Settings** → **Access Tokens**
4. Click **New token**
   - Name: `factoryguard-ai`
   - Role: `Read`
5. Copy the token → This is your `HUGGINGFACE_API_KEY`

**Models We'll Use** (all free):
- `facebook/timeseries-transformer-tourism-monthly` - Time series forecasting
- `microsoft/deberta-v3-base` - Anomaly detection
- `distilbert-base-uncased` - Alert classification

---

### 3. **MQTT Broker** (IoT Sensor Data)
**Purpose**: Receive real-time sensor data from factory equipment

**Option A: HiveMQ Cloud (Free)**:
1. Go to [console.hivemq.cloud](https://console.hivemq.cloud)
2. Sign up → Create new cluster (free tier)
3. Cluster name: `factoryguard`
4. Wait for provisioning
5. Go to **Access Management** → Create credentials:
   - Username: `factoryguard_client`
   - Password: (generate strong password)
6. Copy these values:
   - Host: `MQTT_BROKER_URL` (e.g., `abc123.s1.eu.hivemq.cloud`)
   - Port: `8883` (TLS) → `MQTT_BROKER_PORT`
   - Username: `MQTT_USERNAME`
   - Password: `MQTT_PASSWORD`

**Option B: Local Mosquitto** (Development):
\`\`\`bash
# Install Mosquitto
brew install mosquitto  # macOS
sudo apt install mosquitto mosquitto-clients  # Ubuntu

# Start broker
mosquitto -v

# Use these values:
MQTT_BROKER_URL=localhost
MQTT_BROKER_PORT=1883
MQTT_USERNAME=
MQTT_PASSWORD=
\`\`\`

---

### 4. **supOS Integration** (Optional - For Real Factory)
**Purpose**: Connect to existing supOS industrial platform

**Get Credentials**:
1. Contact your supOS administrator
2. Request API access credentials
3. Get these values:
   - `SUPOS_API_URL` - Your supOS instance URL
   - `SUPOS_API_KEY` - API authentication key
   - `SUPOS_TENANT_ID` - Your tenant/organization ID

**If you don't have supOS**: Skip this - we'll simulate sensor data via MQTT

---

### 5. **OpenAI** (Optional - Enhanced AI Features)
**Purpose**: Natural language insights, advanced predictions

**Get API Key**:
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up → Add payment method (pay-as-you-go)
3. Go to **API Keys** → **Create new secret key**
4. Copy key → This is your `OPENAI_API_KEY`

**Cost**: ~$0.50-2.00/day for typical usage

---

## 🔧 Environment Variables Setup

Create `.env.local` in your project root:

\`\`\`bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Hugging Face (Required)
HUGGINGFACE_API_KEY=hf_your_token_here

# MQTT Broker (Required)
MQTT_BROKER_URL=your-broker.hivemq.cloud
MQTT_BROKER_PORT=8883
MQTT_USERNAME=factoryguard_client
MQTT_PASSWORD=your-mqtt-password
MQTT_USE_TLS=true

# supOS (Optional - for real factory integration)
SUPOS_API_URL=https://your-supos-instance.com
SUPOS_API_KEY=your-supos-key
SUPOS_TENANT_ID=your-tenant-id

# OpenAI (Optional - enhanced AI)
OPENAI_API_KEY=sk-your-openai-key

# WebSocket Server (Auto-configured)
NEXT_PUBLIC_WS_URL=ws://localhost:3001
\`\`\`

---

## 📦 Installation Steps

### Step 1: Install Dependencies
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### Step 2: Set Up Database
The Cursor AI prompt will create and run the database schema automatically. It includes:
- `equipment` table - All factory machines
- `sensor_readings` table - Real-time sensor data
- `alerts` table - System alerts and notifications
- `maintenance_logs` table - Maintenance history
- `predictions` table - AI predictions and RUL estimates

### Step 3: Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Frontend will run on `http://localhost:3000`

### Step 4: Start Backend Services (After Cursor Integration)
\`\`\`bash
# Terminal 1: WebSocket Server
npm run server:ws

# Terminal 2: MQTT Listener
npm run server:mqtt

# Terminal 3: AI Prediction Service
npm run server:ai
\`\`\`

---

## 🧪 Testing with Simulated Data

If you don't have real sensors yet, use our simulator:

\`\`\`bash
# Install simulator dependencies
cd simulator
npm install

# Run sensor simulator (publishes to MQTT)
npm run simulate

# This will generate realistic sensor data for:
# - Temperature (20-85°C with anomalies)
# - Vibration (0.5-8.0 mm/s with spikes)
# - Pressure (2.0-6.5 bar with fluctuations)
# - Energy consumption (150-450 kWh)
\`\`\`

---

## 🚀 Production Deployment

### Deploy to Vercel
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings → Environment Variables → Add all from .env.local
\`\`\`

### Backend Services Deployment
- **WebSocket Server**: Deploy to Railway/Render/Fly.io
- **MQTT Listener**: Run as Docker container
- **AI Service**: Deploy to Hugging Face Spaces or Modal

See `DEPLOYMENT.md` for detailed instructions.

---

## 📊 Expected Results

After setup, you should see:
- ✅ Real-time equipment monitoring (updates every 3s)
- ✅ Live sensor data streaming via WebSocket
- ✅ AI-powered failure predictions
- ✅ Automated alert generation
- ✅ Predictive maintenance scheduling
- ✅ Historical data analytics

---

## 🆘 Troubleshooting

### WebSocket Connection Failed
- Check `NEXT_PUBLIC_WS_URL` is correct
- Ensure WebSocket server is running (`npm run server:ws`)
- Check firewall/CORS settings

### MQTT Connection Issues
- Verify broker credentials
- Check TLS/SSL settings (port 8883 requires TLS)
- Test with MQTT client: `mosquitto_sub -h your-broker -t "sensors/#"`

### Database Errors
- Verify Supabase credentials
- Check if tables exist (run schema migration)
- Ensure RLS policies are configured

### AI Predictions Not Working
- Verify Hugging Face API key
- Check API rate limits (free tier: 1000 requests/day)
- Review logs: `npm run server:ai --verbose`

---

## 📚 Next Steps

1. ✅ Complete this setup guide
2. ✅ Run the Cursor AI prompt (see `CURSOR_PROMPT.md`)
3. ✅ Test with simulated data
4. ✅ Connect real sensors (see `SENSOR_INTEGRATION.md`)
5. ✅ Deploy to production
6. ✅ Monitor and optimize

---

## 💡 Pro Tips

- **Start with simulation**: Test everything with simulated data before connecting real equipment
- **Monitor costs**: Hugging Face free tier is generous, but watch API usage
- **Backup data**: Supabase has automatic backups, but export critical data regularly
- **Security**: Never commit `.env.local` - use Vercel environment variables in production
- **Scaling**: For >100 machines, consider upgrading Supabase plan and using Redis for caching

---

## 🤝 Support

- **Documentation**: See `/docs` folder
- **Issues**: Check GitHub issues
- **Community**: Join our Discord (link in README)

---

**Ready to build the backend?** → See `CURSOR_PROMPT.md`
