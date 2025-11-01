# 🔗 Quick Access - FactoryGuard AI

## GitHub Repository
**https://github.com/henrysammarfo/factoryguard-ai**

---

## 📚 Important Documents

### Main Submission
- **Complete Submission:** [SUBMISSION.md](./SUBMISSION.md)

### Documentation
- **Project README:** [README.md](./README.md)
- **Setup Guide:** [SETUP.md](./SETUP.md)
- **Deployment Guide:** [DEPLOY_LIVE.md](./DEPLOY_LIVE.md)
- **supOS Integration Proof:** [SUPOS_INTEGRATION_PROOF.md](./SUPOS_INTEGRATION_PROOF.md)
- **API Setup Guide:** [docs/API_SETUP_GUIDE.md](./docs/API_SETUP_GUIDE.md)

---

## 💻 Source Code Highlights

### Key Files to Review

**supOS Integration (800+ lines):**
- [lib/supos/client.ts](./lib/supos/client.ts)

**Backend Services:**
- [server/websocket.ts](./server/websocket.ts) - WebSocket server
- [server/mqtt-listener.ts](./server/mqtt-listener.ts) - MQTT data ingestion
- [server/ai-predictor.ts](./server/ai-predictor.ts) - AI prediction service

**Frontend:**
- [app/dashboard/page.tsx](./app/dashboard/page.tsx) - Main dashboard
- [components/](./components/) - Reusable UI components

---

## 🚀 Live Demo

**Status:** Ready to deploy  
**Platform:** Vercel (Frontend) + Railway (Backend)  
**URL:** https://factoryguard-ai.vercel.app/
---

## 🎯 Quick Start

```bash
# Clone repository
git clone https://github.com/henrysammarfo/factoryguard-ai
cd factoryguard-ai

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Add your API keys to .env.local

# Run all services
npm run server:all
```

**Access at:** http://localhost:3000

---

## 📊 Project Structure

```
factoryguard-ai/
├── app/                    # Next.js pages & API routes
├── components/             # React components
├── lib/
│   ├── supos/             # supOS integration (800+ lines)
│   ├── supabase/          # Database client
│   └── ai/                # AI/ML models
├── server/
│   ├── websocket.ts       # WebSocket server
│   ├── mqtt-listener.ts   # MQTT data ingestion
│   └── ai-predictor.ts    # AI prediction service
├── docs/                  # Documentation
└── simulator/             # Sensor data simulator
```

---

## ✅ Features Implemented

- ✅ Real-time equipment monitoring
- ✅ AI-powered failure predictions
- ✅ MQTT sensor data ingestion
- ✅ supOS platform integration
- ✅ WebSocket real-time updates
- ✅ Interactive dashboard
- ✅ Alert system
- ✅ Equipment management
- ✅ Analytics & reporting

---

## 🔐 Security Note

All API keys and credentials are stored in `.env.local` (gitignored).  
No hardcoded secrets in source code.

---

## 📞 Contact

**Developer:** Henry Sam Marfo  
**GitHub:** https://github.com/henrysammarfo  
**Email:** [jasonneil4040@gmail.com]  
**LinkedIn:** [https://www.linkedin.com/in/henrysammarfo/]

---

**For judges/reviewers:** Start with [SUBMISSION.md](./SUBMISSION.md) for the complete overview!
