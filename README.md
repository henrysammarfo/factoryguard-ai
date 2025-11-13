# 🏭 FactoryGuard AI

> **🔗 GitHub Repository:** https://github.com/henrysammarfo/factoryguard-ai  
> **🚀 Live Demo:** https://factoryguard-ai.vercel.app/  
> **📖 Full Submission:** [SUBMISSION.md](./SUBMISSION.md)

**AI-Powered Predictive Maintenance Platform with supOS Integration**

FactoryGuard AI is an intelligent industrial monitoring system that implements supOS principles including Unified Namespace (UNS) for MQTT-based data exchange, delivering real-time equipment monitoring, AI-powered failure prediction, and automated maintenance scheduling.

## 🎯 Quick Links for Judges/Reviewers

- **📋 Complete Submission Document:** [SUBMISSION.md](./SUBMISSION.md)
- **🔧 Setup Instructions:** [SETUP.md](./SETUP.md)
- **🚀 Deployment Guide:** [DEPLOY_LIVE.md](./DEPLOY_LIVE.md)
- **🔌 supOS Integration Proof:** [SUPOS_INTEGRATION_PROOF.md](./SUPOS_INTEGRATION_PROOF.md)
- **💻 Source Code:** Browse the repository
- **📚 API Documentation:** [docs/API_SETUP_GUIDE.md](./docs/API_SETUP_GUIDE.md)

## 🎯 supOS Integration

**This project implements supOS principles and demonstrates real industrial IoT integration with:**

- ✅ **UNS (Unified Namespace)** - ISA-95 standardized MQTT topic hierarchy
- ✅ **MQTT Broker Integration** - Cloud-based MQTT for industrial data exchange
- ✅ **Real-time Event Streaming** - WebSocket updates for live monitoring
- ✅ **Time-series Data Storage** - PostgreSQL for sensor data and analytics
- ✅ **Industrial Data Ingestion** - MQTT-based sensor data collection
- ✅ **Predictive Maintenance** - AI/ML models for equipment failure prediction

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
- MQTT-based UNS (Unified Namespace)
- Industrial IoT data protocols
- Real-time event streaming
- Time-series data analytics
- Predictive maintenance AI

## 🔑 Environment Setup

Copy `.env.example` to `.env.local` and fill in your API keys:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Required environment variables:
- **Supabase**: Database and authentication
- **Hugging Face**: AI/ML predictions
- **supOS CE**: Industrial IoT platform integration

See [SETUP.md](./SETUP.md) for detailed setup instructions.

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

**Ready to build?** Start with [SETUP.md](./SETUP.md) → [API_KEYS.md](./API_KEYS.md)
