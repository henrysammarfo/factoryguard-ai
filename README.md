# 🏭 FactoryGuard AI

> **🔗 GitHub Repository:** https://github.com/henrysammarfo/factoryguard-ai  
> **🚀 Live Demo:** https://factoryguard-ai.vercel.app/

**AI-Powered Predictive Maintenance Platform with supOS Integration**

FactoryGuard AI is an intelligent industrial monitoring system that delivers real-time equipment monitoring, AI-powered failure prediction, and automated maintenance scheduling with full supOS-CE platform integration.

---

## 🎯 supOS Integration - LIVE and WORKING ✅

**Integration Status**: Production-ready bidirectional MQTT communication  
**Runtime**: 4+ hours continuous operation  
**Evidence**: [INTEGRATION_SUCCESS.md](./INTEGRATION_SUCCESS.md)

### What's Integrated

- ✅ **SourceFlow**: Equipment and sensor data FROM FactoryGuard TO supOS (every 10 seconds)
- ✅ **EventFlow**: Threshold monitoring and alerts FROM supOS TO FactoryGuard
- ✅ **MQTT Broker**: HiveMQ Cloud with TLS encryption (port 8883)
- ✅ **Database Sync**: PostgreSQL (5432) and TimescaleDB (2345) integration
- ✅ **Real-time Data**: Live equipment monitoring with current timestamps
- ✅ **Alert Generation**: Automated threshold violation detection

### Quick Setup

```bash
# Install dependencies
npm install

# Start all services (Frontend + Backend + supOS Sync)
npm run server:all
```

**Services started**:
- Frontend: `localhost:3000`
- WebSocket: Real-time updates
- MQTT Listener: Sensor data ingestion
- AI Predictor: Failure prediction
- **supOS MQTT Sync**: Data publishing to supOS
- **supOS DB Sync**: Database writes to PostgreSQL/TimescaleDB

### supOS Integration Docs

- 📄 **[INTEGRATION_SUCCESS.md](./INTEGRATION_SUCCESS.md)** - Complete integration report
- 📄 **[SUPOS_LIVE_INTEGRATION.md](./SUPOS_LIVE_INTEGRATION.md)** - Live integration guide
- 📂 **[docs/SUPOS_SETUP_GUIDE.md](./docs/SUPOS_SETUP_GUIDE.md)** - NodeRED flow setup
- 📂 **[docs/SUPOS_DEMO_SCRIPT.md](./docs/SUPOS_DEMO_SCRIPT.md)** - Demo presentation guide

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database)
- HiveMQ Cloud account (for MQTT - already configured)

### Installation

```bash
# Clone the repository
git clone https://github.com/henrysammarfo/factoryguard-ai.git
cd factoryguard-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your API keys
```

### Run Development

```bash
# Run all services (recommended)
npm run server:all

# Or run services individually:
npm run dev          # Frontend only
npm run server:ws    # WebSocket server
npm run server:mqtt  # MQTT listener
npm run server:ai    # AI predictor
npm run server:supos # supOS MQTT sync
npm run server:db    # supOS database sync
```

### Build for Production

```bash
npm run build
npm start
```

---

## 📋 Features

### Core Capabilities

- 🎨 **Industrial Dashboard** - Real-time equipment monitoring with professional UI
- 📊 **Equipment Tracking** - Live status, health scores, and sensor data
- 🚨 **Alert System** - Multi-level severity alerts with automated notifications
- 📈 **Analytics** - OEE metrics, performance trends, and predictive insights
- 🤖 **AI Predictions** - ML-powered failure prediction (Hugging Face)
- 🔐 **Authentication** - Secure user management with Supabase
- 📡 **Real-time Updates** - WebSocket and MQTT integration
- 🏭 **supOS Integration** - Full bidirectional data exchange with supOS-CE

### supOS Features

- **Unified Namespace (UNS)**: ISA-95 standardized MQTT topics
- **SourceFlow**: Equipment and sensor data ingestion
- **EventFlow**: Threshold monitoring and alert generation
- **Database Integration**: PostgreSQL and TimescaleDB writes
- **NodeRED Flows**: Visual data processing pipelines
- **Live Monitoring**: Real-time debug output in supOS interface

---

## 🛠️ Tech Stack

**Frontend**:
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for visualization

**Backend**:
- Supabase (PostgreSQL + Real-time)
- WebSocket (ws) - Real-time communication
- MQTT (mqtt.js) - IoT data ingestion
- Hugging Face API - AI/ML predictions
- Node.js backend services

**supOS Integration**:
- HiveMQ Cloud MQTT Broker
- NodeRED for flow-based processing
- PostgreSQL (equipment metadata)
- TimescaleDB (time-series sensor data)
- TLS encryption for secure communication

---

## 📁 Project Structure

```
factoryguard-ai/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Main dashboard pages
│   ├── equipment/         # Equipment management
│   ├── alerts/           # Alert management
│   └── api/              # API routes
├── components/            # React components
├── lib/                   # Utilities and helpers
│   └── supos/            # supOS integration client
├── server/                # Backend services
│   ├── websocket.ts      # WebSocket server
│   ├── mqtt-listener.ts  # MQTT data ingestion
│   ├── ai-predictor.ts   # AI prediction service
│   ├── supos-sync.ts     # supOS MQTT publisher
│   └── supos-db-sync.ts  # supOS database writer
├── supos-flows/           # NodeRED flow configurations
├── docs/                  # Documentation
└── database/              # Database schemas
```

---

## 🔑 Environment Variables

Required in `.env.local`:

```env
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Hugging Face (AI Predictions)
HUGGINGFACE_API_KEY=your_huggingface_key

# supOS CE (Industrial IoT)
SUPOS_BASE_URL=https://supos-ce-instance2.supos.app:8443
SUPOS_API_KEY=your_api_key

# MQTT Broker (HiveMQ Cloud - Pre-configured)
MQTT_BROKER_URL=1f3c070f03034f3890cb2c984bc76294.s1.eu.hivemq.cloud
MQTT_BROKER_PORT=8883
MQTT_USERNAME=factoryguard_client
MQTT_PASSWORD=Dogbytec@r1
MQTT_USE_TLS=true

# supOS Databases
SUPOS_POSTGRES_URL=postgres://postgres:postgres@supos-ce-instance2.supos.app:5432/postgres
SUPOS_TSDB_URL=postgres://postgres:postgres@supos-ce-instance2.supos.app:2345/postgres
```

---

## 📊 Expected Benefits

- 🎯 **25-30%** reduction in unplanned downtime
- 💰 **15-20%** decrease in maintenance costs
- ⚡ **10-15%** improvement in OEE (Overall Equipment Effectiveness)
- 🔋 **8-12%** reduction in energy consumption
- 📈 **Real-time visibility** into equipment health and performance

---

## 🧪 Testing

```bash
# Run development server
npm run dev

# Test MQTT connection
npm run test:mqtt

# Build for production
npm run build
```

---

## 📚 Documentation

- **[INTEGRATION_SUCCESS.md](./INTEGRATION_SUCCESS.md)** - supOS integration report
- **[SUPOS_LIVE_INTEGRATION.md](./SUPOS_LIVE_INTEGRATION.md)** - Live integration guide
- **[docs/TECHNICAL_IMPLEMENTATION.md](./docs/TECHNICAL_IMPLEMENTATION.md)** - Technical details

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - Feel free to use for your projects!

---

## 🏆 Acknowledgments

Built for **supOS Hackathon 2024**

**Key Technologies**:
- supOS-CE Platform
- HiveMQ Cloud MQTT
- Supabase
- Next.js
- Hugging Face

---

**Ready to start?** 
1. Install dependencies: `npm install`
2. Configure environment: Copy `.env.example` to `.env.local`
3. Start all services: `npm run server:all`
4. Open browser: `http://localhost:3000`

**Need help?** Check [INTEGRATION_SUCCESS.md](./INTEGRATION_SUCCESS.md) for complete setup and troubleshooting.
