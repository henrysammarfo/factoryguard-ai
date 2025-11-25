# 🎬 Live Demo Instructions: FactoryGuard AI

## Demo Overview
**Duration:** 2-3 minutes during presentation  
**Purpose:** Demonstrate real-time supOS integration and AI predictions  
**Critical:** Must work flawlessly - test multiple times before pitch

---

## 🔧 Pre-Demo Setup (30 minutes before)

### 1. Environment Preparation
```bash
# Ensure all dependencies installed
npm install

# Copy environment file
cp .env.example .env.local

# Fill in required API keys:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - HUGGINGFACE_API_KEY
# - SUPOS_CE_ENDPOINT
# - MQTT_BROKER_URL
```

### 2. Service Startup Sequence
```bash
# Start all services (recommended)
npm run server:all

# Or start individually:
npm run server:ws      # WebSocket server (port 8080)
npm run server:mqtt    # MQTT listener
npm run server:ai      # AI prediction service
npm run dev           # Next.js frontend (port 3000)
```

### 3. supOS Connection Verification
- Open browser to `http://localhost:3000/dashboard/supos`
- Verify connection status shows "Connected"
- Check MQTT topics are receiving data

### 4. Sensor Simulator Setup
```bash
cd simulator
npm install
npm run simulate
```
- This generates realistic sensor data for demo

---

## 🎯 Demo Script (2-3 minutes)

### Phase 1: System Overview (30 seconds)
1. **Open Dashboard:** Navigate to `http://localhost:3000/dashboard`
2. **Show Equipment List:** Display all monitored equipment
3. **Highlight Status:** Green/Yellow/Red indicators for equipment health

### Phase 2: Real-time Monitoring (45 seconds)
1. **Live Data Flow:** Point to WebSocket connection indicator
2. **Sensor Readings:** Show temperature, vibration, pressure metrics
3. **MQTT Topics:** Display incoming MQTT messages in console
4. **supOS Integration:** Show data flowing to supOS-CE platform

### Phase 3: AI Predictions (45 seconds)
1. **Prediction Dashboard:** Navigate to equipment detail page
2. **Failure Probability:** Show AI-calculated risk percentages
3. **Trend Analysis:** Display prediction charts over time
4. **Alert Generation:** Trigger a maintenance alert

### Phase 4: Alert & Response (30 seconds)
1. **Alert Notification:** Show popup notification
2. **Automated Scheduling:** Display recommended maintenance time
3. **Analytics View:** Show OEE metrics and performance trends

---

## 🚨 Backup Plans

### If Live Demo Fails:
1. **Pre-recorded Video:** 1-minute highlight reel
2. **Screenshots:** Key dashboard views
3. **Console Logs:** Show successful API calls
4. **Architecture Diagrams:** Technical implementation slides

### Common Issues & Fixes:
- **WebSocket not connecting:** Restart `npm run server:ws`
- **MQTT data not flowing:** Check broker credentials in `.env.local`
- **AI predictions failing:** Verify Hugging Face API key
- **supOS connection down:** Use mock data fallback

---

## 📊 Demo Checklist

### Pre-Presentation (Day Before):
- [ ] All services start without errors
- [ ] supOS connection established
- [ ] Sensor simulator running
- [ ] AI predictions working
- [ ] Dashboard loads in <3 seconds
- [ ] Mobile responsive design tested

### Presentation Day:
- [ ] Laptop charged (2-hour minimum)
- [ ] Stable internet connection
- [ ] Browser cache cleared
- [ ] Incognito mode for clean session
- [ ] Volume on for notifications
- [ ] Backup device ready

### During Demo:
- [ ] Speak clearly while demonstrating
- [ ] Pause for judges to observe
- [ ] Highlight key metrics
- [ ] Show real-time updates
- [ ] Demonstrate AI decision-making

---

## 🎤 Demo Narration Script

**Opening:** "Let me show you FactoryGuard AI in action. We'll monitor a manufacturing line with real-time sensor data flowing through supOS."

**Live Monitoring:** "Here you can see live sensor readings from our equipment - temperature, vibration, and pressure - all streaming via MQTT through our supOS integration."

**AI Predictions:** "Now watch as our AI analyzes this data. The system predicts a 75% failure probability for this motor, triggering an automated maintenance alert."

**Business Impact:** "This early warning allows us to schedule maintenance proactively, preventing costly downtime and optimizing our OEE metrics."

**Closing:** "The demo shows how FactoryGuard AI transforms reactive maintenance into predictive, AI-powered operations using supOS standards."

---

## 🔍 Technical Demo Deep Dive

### For Technical Judges:
- **MQTT Topics:** Show UNS structure `/factory/site/area/line/equipment/sensor`
- **WebSocket Payloads:** Display real-time JSON data structure
- **AI Model Input:** Explain sensor data preprocessing
- **Database Queries:** Show time-series data storage
- **API Endpoints:** Demonstrate RESTful equipment management

### Performance Metrics to Highlight:
- **Latency:** <100ms for real-time updates
- **Throughput:** 1000+ sensor readings per second
- **Accuracy:** 85%+ prediction accuracy
- **Uptime:** 99.9% service availability

---

## 📱 Mobile/Remote Demo Option

If internet issues occur:
- Pre-deploy to Vercel/Netlify
- Use mobile hotspot
- Have local version ready
- Screen share from phone

---

## 🎯 Success Criteria

**Demo is successful if:**
- All services run without errors
- Real-time data updates are visible
- AI predictions generate alerts
- supOS connection is maintained
- Dashboard loads quickly
- Judges can see clear value proposition

**Target:** Flawless 3-minute demonstration that wows the judges!

---

*Remember: Practice the demo 10+ times. Have backups ready. Stay calm and confident!* 🚀