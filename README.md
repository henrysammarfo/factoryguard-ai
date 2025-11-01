# 🏭 FactoryGuard AI

**AI-Powered Predictive Maintenance Platform Built on supOS-CE**

FactoryGuard AI is an intelligent industrial monitoring system that leverages supOS-CE's Unified Namespace (UNS), DBConnect, EventFlow, and SourceFlow to deliver real-time equipment monitoring, AI-powered failure prediction, and automated maintenance scheduling.

## 🎯 supOS Integration

**This project is built on supOS-CE and demonstrates real integration with:**

- ✅ **UNS (Unified Namespace)** - ISA-95 standardized data model for equipment hierarchy
- ✅ **DBConnect** - PostgreSQL + TimescaleDB for time-series data storage
- ✅ **EventFlow** - Real-time WebSocket event streaming for live updates
- ✅ **SourceFlow** - MQTT data ingestion supporting 300+ industrial protocols
- ✅ **REST API** - Direct integration with supOS API for equipment and sensor data
- ✅ **Dashboard Integration** - Embeddable UI components for supOS interface

📄 **See [SUPOS_INTEGRATION_PROOF.md](./SUPOS_INTEGRATION_PROOF.md) for complete integration documentation**

## 🚀 Quick Start

### Installation

\`\`\`bash
npm install
\`\`\`

### Run All Services (Recommended)

\`\`\`bash
npm run server:all
\`\`\`

This single command starts:
- Next.js frontend (`localhost:3000`)
- WebSocket server (real-time updates)
- MQTT listener (sensor data ingestion)
- AI prediction service (Hugging Face)

### Or Run Services Individually

\`\`\`bash
# Frontend only
npm run dev

# WebSocket server
npm run server:ws

# MQTT listener
npm run server:mqtt

# AI predictor
npm run server:ai
\`\`\`

## 📋 Features

### ✅ Core Features

- 🎨 **Industrial Dashboard** - Professional UI with real-time monitoring
- 📊 **Equipment Monitoring** - Live status tracking with sensor data
- 🚨 **Alert System** - Multi-level severity alerts with notifications
- 📈 **Analytics** - OEE metrics, performance trends, and insights
- 🤖 **AI Predictions** - Machine learning-powered failure prediction
- 🔐 **Authentication** - Secure Supabase-based user management
- 📡 **Real-time Updates** - WebSocket and MQTT integration
- 🏭 **supOS Integration** - Full integration with supOS-CE platform

## 🛠️ Tech Stack

**Frontend**:
- Next.js 16 (App Router)
- React 19.2
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Recharts for data visualization

**Backend**:
- Supabase (PostgreSQL + Real-time subscriptions)
- WebSocket (ws) - Real-time communication
- MQTT (mqtt.js) - IoT data ingestion
- Hugging Face Inference API - AI/ML predictions
- supOS-CE - Industrial data platform

**supOS Integration**:
- supOS REST API
- PostgreSQL (DBConnect)
- TimescaleDB (Time-series data)
- EventFlow (WebSocket events)
- SourceFlow (MQTT ingestion)

## 🔑 Environment Setup

Create a `.env.local` file with:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Hugging Face
HUGGINGFACE_API_KEY=your_hf_key

# MQTT
MQTT_BROKER_URL=your_mqtt_broker
MQTT_USERNAME=your_username
MQTT_PASSWORD=your_password

# supOS
SUPOS_API_URL=http://127.0.0.1:8088
SUPOS_API_KEY=your_supos_api_key
\`\`\`

See [SETUP.md](./SETUP.md) and [API_KEYS.md](./API_KEYS.md) for detailed instructions.

## 📊 Expected Benefits

- 🎯 25-30% reduction in unplanned downtime
- 💰 15-20% decrease in maintenance costs
- ⚡ 10-15% improvement in OEE
- 🔋 8-12% reduction in energy consumption

## 📄 License

MIT License - Feel free to use for your projects!

---

**Built for supOS Hackathon 2024** | [Documentation](./SUPOS_INTEGRATION_PROOF.md) | [Setup Guide](./SETUP.md)

---

**Ready to build?** Start with [SETUP.md](./SETUP.md) → [API_KEYS.md](./API_KEYS.md) → [CURSOR_PROMPT.md](./CURSOR_PROMPT.md)
